import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import {
  computeSleepScore,
  type SleepSession,
} from '@/modules/insights/hooks/useSleepHistory';
import { useQuery } from '@powersync/tanstack-react-query';
import dayjs from 'dayjs';

/**
 * Score for the sleep session that *ended* on the given local date — i.e.,
 * "sleep for today" means the night that finished this morning. Returns the
 * latest matching session if there are multiple (rare).
 */
export function useSleepScoreForDate(date: string): {
  score: number | null;
  session: SleepSession | null;
  isLoading: boolean;
} {
  const userId = useUserId();
  const startOfDay = dayjs(date).startOf('day').toISOString();
  const startOfNextDay = dayjs(date).add(1, 'day').startOf('day').toISOString();

  const { data, isLoading } = useQuery({
    queryKey: ['sleep-score-for-date', userId, date],
    query: db
      .selectFrom('sleep_session')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('end_time', '>=', startOfDay)
      .where('end_time', '<', startOfNextDay)
      .orderBy('end_time', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const row = data?.[0];
  const session: SleepSession | null = row
    ? {
        id: row.id,
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
      }
    : null;

  return {
    score: computeSleepScore(session),
    session,
    isLoading,
  };
}
