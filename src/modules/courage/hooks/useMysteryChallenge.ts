import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { sql } from 'kysely';

export function useTodaysChallenge() {
  const userId = useUserId();
  const today = new Date().toISOString().slice(0, 10);

  const { data, ...rest } = useQuery({
    queryKey: ['mystery-challenge-today', userId, today],
    query: db
      .selectFrom('mystery_challenge')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where(sql`date(completed_at)`, '=', today)
      .orderBy('completed_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  return { data: data?.[0] ? toCamel(data[0]) : null, ...rest };
}

export function useRecordChallenge() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      challengeType: string;
      doseDopamine: number;
      doseOxytocin: number;
      doseSerotonin: number;
      doseEndorphins: number;
      durationSeconds: number;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      const now = new Date().toISOString();

      await db
        .insertInto('mystery_challenge')
        .values({
          id,
          user_id: userId,
          challenge_type: input.challengeType,
          dose_dopamine: input.doseDopamine,
          dose_oxytocin: input.doseOxytocin,
          dose_serotonin: input.doseSerotonin,
          dose_endorphins: input.doseEndorphins,
          duration_seconds: input.durationSeconds,
          completed_at: now,
          created_at: now,
        })
        .execute();

      return { id };
    },
  });
}

export function useChallengeHistory() {
  const userId = useUserId();

  const { data, ...rest } = useQuery({
    queryKey: ['mystery-challenge-history', userId],
    query: db
      .selectFrom('mystery_challenge')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .orderBy('completed_at', 'desc')
      .limit(20),
    enabled: !!userId,
  });

  const transformed = useMemo(() => data?.map((r) => toCamel(r)), [data]);
  return { data: transformed, ...rest };
}
