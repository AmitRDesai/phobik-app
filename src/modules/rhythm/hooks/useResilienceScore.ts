import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { parseJSON } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { resilienceFromCheckIn } from '../lib/scoring';

const CHECK_IN_TYPE = 'resilience';

type ResilienceAnswers = { index: number };

export type ResilienceScore = {
  /** Resilience 0–100, or null if no check-in for the date. */
  score: number | null;
  /** Selected answer index 0–4, or null. */
  index: number | null;
  isLoading: boolean;
};

export function useResilienceScore(
  date: string = dayjs().format('YYYY-MM-DD'),
): ResilienceScore {
  const userId = useUserId();

  const { data, isLoading } = useQuery({
    queryKey: ['resilience-checkin', userId, date],
    query: db
      .selectFrom('self_check_in')
      .select(['answers'])
      .where('user_id', '=', userId ?? '')
      .where('type', '=', CHECK_IN_TYPE)
      .where('started_at', '>=', dayjs(date).startOf('day').toISOString())
      .where(
        'started_at',
        '<',
        dayjs(date).add(1, 'day').startOf('day').toISOString(),
      )
      .orderBy('started_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const answers = parseJSON<ResilienceAnswers>(data?.[0]?.answers);
  const index = answers?.index ?? null;

  return {
    score: index != null ? resilienceFromCheckIn(index) : null,
    index,
    isLoading,
  };
}

/** Saves today's self-efficacy check-in (one row per day; latest wins). */
export function useSaveResilienceCheckIn() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (index: number) => {
      if (!userId) throw new Error('Not authenticated');
      const now = new Date().toISOString();
      await db
        .insertInto('self_check_in')
        .values({
          id: uuid(),
          user_id: userId,
          type: CHECK_IN_TYPE,
          status: 'completed',
          answers: JSON.stringify({ index } satisfies ResilienceAnswers),
          started_at: now,
          completed_at: now,
          created_at: now,
          updated_at: now,
        })
        .execute();
    },
  });
}
