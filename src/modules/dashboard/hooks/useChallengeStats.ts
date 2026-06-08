import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import { sql } from 'kysely';
import dayjs from 'dayjs';

export type ChallengeStats = {
  /** All-time count of completed challenges across challenge types. */
  total: number;
  /** Local dates (YYYY-MM-DD) with a completed Daily Flow, for the streak grid. */
  completedDates: Set<string>;
  isLoading: boolean;
};

type CountTable =
  | 'micro_challenge'
  | 'mystery_challenge'
  | 'empathy_challenge_day';

function useCompletedCount(table: CountTable, userId: string | undefined) {
  return useQuery({
    queryKey: ['completed-count', table, userId],
    query: db
      .selectFrom(table)
      .select([sql<number>`COUNT(*)`.as('n')])
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed'),
    enabled: !!userId,
  });
}

/** Aggregates completion counts for the home challenges/streak card. */
export function useChallengeStats(): ChallengeStats {
  const userId = useUserId();

  const micro = useCompletedCount('micro_challenge', userId);
  const mystery = useCompletedCount('mystery_challenge', userId);
  const empathy = useCompletedCount('empathy_challenge_day', userId);

  const { data: flows, isLoading: flowsLoading } = useQuery({
    queryKey: ['challenge-streak', userId],
    query: db
      .selectFrom('daily_flow_session')
      .select(['completed_at'])
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed')
      .where('completed_at', '>=', dayjs().subtract(14, 'day').toISOString()),
    enabled: !!userId,
  });

  const total =
    (micro.data?.[0]?.n ?? 0) +
    (mystery.data?.[0]?.n ?? 0) +
    (empathy.data?.[0]?.n ?? 0);

  const completedDates = new Set(
    (flows ?? [])
      .map((r) => r.completed_at as string | null)
      .filter((c): c is string => c != null)
      .map((c) => dayjs(c).format('YYYY-MM-DD')),
  );

  return {
    total,
    completedDates,
    isLoading:
      micro.isLoading || mystery.isLoading || empathy.isLoading || flowsLoading,
  };
}
