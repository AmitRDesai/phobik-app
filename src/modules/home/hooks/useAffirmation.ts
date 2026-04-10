import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

/** Returns YYYY-MM-DD in local time (not UTC) */
function todayLocal(): string {
  return new Date().toLocaleDateString('en-CA');
}

/** Today's most recent affirmation (null if none set today) */
export function useTodayAffirmation() {
  const userId = useUserId();
  const today = todayLocal();

  const { data, isLoading, error } = useQuery({
    queryKey: ['affirmation-today', userId, today],
    query: db
      .selectFrom('user_affirmation')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('selected_date', '=', today)
      .orderBy('created_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const affirmation = useMemo(
    () => (data?.[0] ? toCamel(data[0]) : null),
    [data],
  );

  return { data: affirmation, isLoading, error };
}

/** All affirmations ordered by date (most recent first) */
export function useAffirmationHistory() {
  const userId = useUserId();

  const { data, isLoading, error } = useQuery({
    queryKey: ['affirmation-history', userId],
    query: db
      .selectFrom('user_affirmation')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .orderBy('selected_date', 'desc')
      .orderBy('created_at', 'desc'),
    enabled: !!userId,
  });

  const history = useMemo(() => data?.map((r) => toCamel(r)), [data]);
  return { data: history, isLoading, error };
}

/** Save a new affirmation for today */
export function useSaveAffirmation() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: { feeling: string; text: string }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      const now = new Date().toISOString();
      const today = todayLocal();

      await db
        .insertInto('user_affirmation')
        .values({
          id,
          user_id: userId,
          feeling: input.feeling,
          text: input.text,
          selected_date: today,
          created_at: now,
        })
        .execute();

      return { id };
    },
  });
}
