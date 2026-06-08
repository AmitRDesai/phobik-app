import { db } from '@/lib/powersync/database';

// WHOOP writes its data into Apple Health too. When a direct WHOOP connection
// is active we drop those mirror samples (keeping the canonical cloud copy) by
// matching the HealthKit writing-app bundle. Prefix match covers `com.whoop.*`
// and `com.whoopinc.*`. ⚠️ Verify against the real bundle on-device.
const WHOOP_BUNDLE_PREFIX = 'com.whoop';

export function isWhoopBundle(bundleId: string | undefined): boolean {
  return (
    bundleId != null && bundleId.toLowerCase().startsWith(WHOOP_BUNDLE_PREFIX)
  );
}

export type BiometricMetric =
  | 'heart_rate'
  | 'hrv_sdnn'
  | 'hrv_rmssd'
  | 'resting_hr'
  | 'respiratory_rate';
export type BiometricSource = 'apple_health' | 'health_connect';
export type BiometricUnit = 'bpm' | 'ms' | 'breaths_per_min';

export type BiometricSample = {
  metric: BiometricMetric;
  value: number;
  unit: BiometricUnit;
  source: BiometricSource;
  recordedAt: Date;
};

/**
 * Deterministic id keyed on the natural identity of a sample. Two writes for
 * the same underlying device sample (e.g. the same HealthKit reading written
 * from two devices) collapse into one row.
 */
export function computeReadingId(
  userId: string,
  recordedAt: Date,
  metric: BiometricMetric,
  source: BiometricSource,
): string {
  return `bio-${userId.slice(0, 8)}-${recordedAt.getTime()}-${metric}-${source}`;
}

export async function persistReadings(
  userId: string,
  samples: BiometricSample[],
): Promise<void> {
  if (samples.length === 0) return;
  const now = new Date().toISOString();
  // Dedupe within the batch — HealthKit / Health Connect can return
  // overlapping windows, and SQLite multi-row INSERT rejects in-batch dups
  // even with ON CONFLICT DO NOTHING.
  const seen = new Set<string>();
  const rows: {
    id: string;
    user_id: string;
    metric: BiometricMetric;
    value: number;
    unit: BiometricUnit;
    source: BiometricSource;
    granularity: 'sample';
    recorded_at: string;
    created_at: string;
  }[] = [];
  for (const s of samples) {
    const id = computeReadingId(userId, s.recordedAt, s.metric, s.source);
    if (seen.has(id)) continue;
    seen.add(id);
    rows.push({
      id,
      user_id: userId,
      metric: s.metric,
      value: s.value,
      unit: s.unit,
      source: s.source,
      // On-device readings are always per-sample; cloud aggregates (Whoop
      // daily_avg) never flow through this device-upload path.
      granularity: 'sample',
      recorded_at: s.recordedAt.toISOString(),
      created_at: now,
    });
  }
  if (rows.length === 0) return;
  // PowerSync's synced tables are SQLite views — ON CONFLICT clauses are
  // rejected ("cannot UPSERT a view"). Pre-filter by querying which deterministic
  // ids already exist, then insert only the new rows.
  const existing = await db
    .selectFrom('biometric_reading')
    .select('id')
    .where(
      'id',
      'in',
      rows.map((r) => r.id),
    )
    .execute();
  const existingIds = new Set(existing.map((r) => r.id));
  const newRows = rows.filter((r) => !existingIds.has(r.id));
  if (newRows.length === 0) return;
  await db.insertInto('biometric_reading').values(newRows).execute();
}
