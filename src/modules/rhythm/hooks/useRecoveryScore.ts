import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useSleepScoreForDate } from '@/modules/dashboard/hooks/useSleepScoreForDate';
import { useQuery } from '@powersync/tanstack-react-query';
import dayjs from 'dayjs';

import { consistencyScore, recoveryScore } from '../lib/scoring';

export type RecoveryScore = {
  /** Recovery 0–100, or null if no sleep data. */
  score: number | null;
  /** Sleep-quality sub-score (0–100). */
  sleepQuality: number | null;
  /** Consistency sub-score (0–100). */
  consistency: number | null;
  /** Total sleep minutes for the night. */
  totalMinutes: number | null;
  efficiencyPct: number | null;
  isLoading: boolean;
};

export function useRecoveryScore(
  date: string = dayjs().format('YYYY-MM-DD'),
): RecoveryScore {
  const userId = useUserId();
  const {
    score: sleepQuality,
    session,
    isLoading,
  } = useSleepScoreForDate(date);

  // Last 7 nights of durations for the consistency sub-score.
  const { data, isLoading: historyLoading } = useQuery({
    queryKey: ['recovery-consistency', userId, date],
    query: db
      .selectFrom('sleep_session')
      .select(['total_minutes'])
      .where('user_id', '=', userId ?? '')
      .where('end_time', '>=', dayjs(date).subtract(7, 'day').toISOString())
      .where(
        'end_time',
        '<',
        dayjs(date).add(1, 'day').startOf('day').toISOString(),
      )
      .orderBy('end_time', 'desc'),
    enabled: !!userId,
  });

  const durations = (data ?? [])
    .map((r) => r.total_minutes as number | null)
    .filter((m): m is number => m != null && m > 0);
  const consistency = consistencyScore(durations);

  return {
    score: recoveryScore(sleepQuality, consistency),
    sleepQuality,
    consistency,
    totalMinutes: session?.totalMinutes ?? null,
    efficiencyPct: session?.efficiencyPct ?? null,
    isLoading: isLoading || historyLoading,
  };
}
