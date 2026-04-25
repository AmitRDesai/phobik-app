import { db } from '@/lib/powersync/database';

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
      recorded_at: s.recordedAt.toISOString(),
      created_at: now,
    });
  }
  if (rows.length === 0) return;
  await db
    .insertInto('biometric_reading')
    .values(rows)
    .onConflict((oc) => oc.column('id').doNothing())
    .execute();
}
