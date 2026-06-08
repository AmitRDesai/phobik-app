import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import {
  computeSleepScore,
  type SleepSession,
} from '@/modules/insights/hooks/useSleepHistory';
import { useQuery } from '@powersync/tanstack-react-query';
import dayjs from 'dayjs';

export type TrendRange = '1D' | '7D' | '30D' | '90D';

export const TREND_RANGES: TrendRange[] = ['1D', '7D', '30D', '90D'];

const RANGE_DAYS: Record<TrendRange, number> = {
  '1D': 1,
  '7D': 7,
  '30D': 30,
  '90D': 90,
};

export type TrendPoint = { date: string; value: number };

/**
 * Daily My Rhythm trend over the selected range. Uses nightly sleep score as
 * the composite proxy until per-day pillar history is materialized — it is the
 * most reliably-logged daily signal and tracks Recovery (the heaviest pillar).
 */
export function useRhythmTrend(range: TrendRange): {
  points: TrendPoint[];
  isLoading: boolean;
} {
  const userId = useUserId();
  const since = dayjs()
    .subtract(RANGE_DAYS[range], 'day')
    .startOf('day')
    .toISOString();

  const { data, isLoading } = useQuery({
    queryKey: ['rhythm-trend', userId, range],
    query: db
      .selectFrom('sleep_session')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('end_time', '>=', since)
      .orderBy('end_time', 'asc'),
    enabled: !!userId,
  });

  const points: TrendPoint[] = (data ?? [])
    .map((row) => {
      const session: SleepSession = {
        id: row.id as string,
        startTime: new Date(row.start_time as string),
        endTime: new Date(row.end_time as string),
        inBedMinutes: (row.in_bed_minutes as number) ?? 0,
        totalMinutes: (row.total_minutes as number) ?? 0,
        deepMinutes: (row.deep_minutes as number | null) ?? null,
        remMinutes: (row.rem_minutes as number | null) ?? null,
        lightMinutes: (row.light_minutes as number | null) ?? null,
        awakeMinutes: (row.awake_minutes as number | null) ?? null,
        efficiencyPct: (row.efficiency_pct as number | null) ?? null,
        restorativePct: (row.restorative_pct as number | null) ?? null,
        source: (row.source as string) ?? '',
      };
      const value = computeSleepScore(session);
      return value == null
        ? null
        : { date: dayjs(session.endTime).format('YYYY-MM-DD'), value };
    })
    .filter((p): p is TrendPoint => p != null);

  return { points, isLoading };
}
