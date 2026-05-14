import { db } from '@/lib/powersync/database';

export type SleepSource = 'apple_health' | 'health_connect';

export type SleepSessionInput = {
  startTime: Date;
  endTime: Date;
  inBedMinutes: number;
  totalMinutes: number;
  deepMinutes: number | null;
  remMinutes: number | null;
  lightMinutes: number | null;
  awakeMinutes: number | null;
  source: SleepSource;
};

export type ComputedSleepSession = SleepSessionInput & {
  efficiencyPct: number | null;
  restorativePct: number | null;
};

/**
 * Deterministic id keyed on (userId, startTime, source) so the same physical
 * sleep session collapses to one row across devices and reinstalls.
 */
export function computeSleepId(
  userId: string,
  startTime: Date,
  source: SleepSource,
): string {
  return `sleep-${userId.slice(0, 8)}-${startTime.getTime()}-${source}`;
}

export function deriveSleepMetrics(
  input: SleepSessionInput,
): ComputedSleepSession {
  const efficiencyPct =
    input.inBedMinutes > 0
      ? (input.totalMinutes / input.inBedMinutes) * 100
      : null;
  const hasStages =
    (input.deepMinutes != null && input.deepMinutes > 0) ||
    (input.remMinutes != null && input.remMinutes > 0);
  const restorativePct =
    hasStages && input.totalMinutes > 0
      ? (((input.deepMinutes ?? 0) + (input.remMinutes ?? 0)) /
          input.totalMinutes) *
        100
      : null;
  return { ...input, efficiencyPct, restorativePct };
}

export async function persistSleepSessions(
  userId: string,
  sessions: SleepSessionInput[],
): Promise<void> {
  if (sessions.length === 0) return;
  const now = new Date().toISOString();
  const seen = new Set<string>();
  const rows: {
    id: string;
    user_id: string;
    start_time: string;
    end_time: string;
    in_bed_minutes: number;
    total_minutes: number;
    deep_minutes: number | null;
    rem_minutes: number | null;
    light_minutes: number | null;
    awake_minutes: number | null;
    efficiency_pct: number | null;
    restorative_pct: number | null;
    source: SleepSource;
    recorded_at: string;
    created_at: string;
  }[] = [];
  for (const raw of sessions) {
    const s = deriveSleepMetrics(raw);
    if (s.totalMinutes <= 0) continue; // skip empty/invalid sessions
    const id = computeSleepId(userId, s.startTime, s.source);
    if (seen.has(id)) continue;
    seen.add(id);
    rows.push({
      id,
      user_id: userId,
      start_time: s.startTime.toISOString(),
      end_time: s.endTime.toISOString(),
      in_bed_minutes: s.inBedMinutes,
      total_minutes: s.totalMinutes,
      deep_minutes: s.deepMinutes,
      rem_minutes: s.remMinutes,
      light_minutes: s.lightMinutes,
      awake_minutes: s.awakeMinutes,
      efficiency_pct: s.efficiencyPct,
      restorative_pct: s.restorativePct,
      source: s.source,
      recorded_at: now,
      created_at: now,
    });
  }
  if (rows.length === 0) return;
  // PowerSync's synced tables are SQLite views — ON CONFLICT clauses are
  // rejected ("cannot UPSERT a view"). Pre-filter by querying which deterministic
  // ids already exist, then insert only the new rows.
  const existing = await db
    .selectFrom('sleep_session')
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
  await db.insertInto('sleep_session').values(newRows).execute();
}
