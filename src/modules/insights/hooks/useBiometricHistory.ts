import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import type { TimeRange } from '@/modules/insights/store/insights';
import { useQuery } from '@powersync/tanstack-react-query';
import { sql } from 'kysely';

export type BiometricMetric = 'heart_rate' | 'hrv_sdnn' | 'hrv_rmssd';

export type BiometricHistoryPoint = {
  bucket: string; // ISO-ish bucket key — '2026-04-25' (daily) or '2026-04-25 14' (hourly)
  at: Date; // representative timestamp inside the bucket (latest sample)
  value: number; // average within the bucket
  min: number;
  max: number;
};

export type BiometricHistoryStats = {
  points: BiometricHistoryPoint[];
  avg: number | null;
  min: number | null;
  max: number | null;
  latest: BiometricHistoryPoint | null;
};

const RANGE_DEFS: Record<
  TimeRange,
  { lookbackMs: number; bucketFormat: string; bucketLabel: 'hour' | 'day' }
> = {
  Day: {
    lookbackMs: 24 * 60 * 60 * 1000,
    bucketFormat: '%Y-%m-%d %H',
    bucketLabel: 'hour',
  },
  Week: {
    lookbackMs: 7 * 24 * 60 * 60 * 1000,
    bucketFormat: '%Y-%m-%d',
    bucketLabel: 'day',
  },
  '2 Weeks': {
    lookbackMs: 14 * 24 * 60 * 60 * 1000,
    bucketFormat: '%Y-%m-%d',
    bucketLabel: 'day',
  },
  Month: {
    lookbackMs: 30 * 24 * 60 * 60 * 1000,
    bucketFormat: '%Y-%m-%d',
    bucketLabel: 'day',
  },
};

export function useBiometricHistory(
  metric: BiometricMetric | BiometricMetric[],
  range: TimeRange,
): BiometricHistoryStats & { isLoading: boolean; bucketLabel: 'hour' | 'day' } {
  const userId = useUserId();
  const { lookbackMs, bucketFormat, bucketLabel } = RANGE_DEFS[range];
  const startIso = new Date(Date.now() - lookbackMs).toISOString();
  const metrics = Array.isArray(metric) ? metric : [metric];

  const { data, isLoading } = useQuery({
    queryKey: ['biometric-history', userId, metrics.join(','), range],
    query: db
      .selectFrom('biometric_reading')
      .select([
        sql<string>`strftime(${bucketFormat}, recorded_at)`.as('bucket'),
        sql<number>`AVG(value)`.as('avg_value'),
        sql<number>`MIN(value)`.as('min_value'),
        sql<number>`MAX(value)`.as('max_value'),
        sql<string>`MAX(recorded_at)`.as('latest_at'),
      ])
      .where('user_id', '=', userId ?? '')
      .where('metric', 'in', metrics)
      .where('recorded_at', '>=', startIso)
      .groupBy(sql`strftime(${bucketFormat}, recorded_at)`)
      .orderBy('bucket'),
    enabled: !!userId,
  });

  const points: BiometricHistoryPoint[] = (data ?? []).map((row) => ({
    bucket: row.bucket,
    at: new Date(row.latest_at),
    value: row.avg_value,
    min: row.min_value,
    max: row.max_value,
  }));

  let avg: number | null = null;
  let min: number | null = null;
  let max: number | null = null;
  if (points.length > 0) {
    let sum = 0;
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const p of points) {
      sum += p.value;
      if (p.min < lo) lo = p.min;
      if (p.max > hi) hi = p.max;
    }
    avg = sum / points.length;
    min = lo;
    max = hi;
  }

  return {
    points,
    avg,
    min,
    max,
    latest: points[points.length - 1] ?? null,
    isLoading,
    bucketLabel,
  };
}
