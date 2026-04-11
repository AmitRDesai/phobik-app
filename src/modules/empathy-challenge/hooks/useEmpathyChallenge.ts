import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useActiveChallenge() {
  const userId = useUserId();

  const { data: challenges, ...challengeRest } = useQuery({
    queryKey: ['empathy-challenge-active', userId],
    query: db
      .selectFrom('empathy_challenge')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'active')
      .limit(1),
    enabled: !!userId,
  });

  const challengeId = challenges?.[0]?.id ?? '';

  const { data: days } = useQuery({
    queryKey: ['empathy-challenge-days', challengeId],
    query: db
      .selectFrom('empathy_challenge_day')
      .selectAll()
      .where('challenge_id', '=', challengeId)
      .orderBy('day_number', 'asc'),
    enabled: !!challengeId,
  });

  const challenge = challenges?.[0];

  const data = useMemo(
    () =>
      challenge
        ? { ...toCamel(challenge), days: (days ?? []).map((d) => toCamel(d)) }
        : null,
    [challenge, days],
  );

  // Treat as loading when no data found yet but a refetch is in progress —
  // prevents routing decisions based on stale cached empty results
  const isLoading =
    challengeRest.isLoading ||
    (!challenges?.length && challengeRest.fetchStatus === 'fetching');

  return { ...challengeRest, data, isLoading };
}

export function useStartChallenge() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated');

      await db
        .updateTable('empathy_challenge')
        .set({ status: 'abandoned' })
        .where('user_id', '=', userId)
        .where('status', '=', 'active')
        .execute();

      const challengeId = uuid();
      const now = new Date().toISOString();

      await db
        .insertInto('empathy_challenge')
        .values({
          id: challengeId,
          user_id: userId,
          status: 'active',
          started_at: now,
          created_at: now,
        })
        .execute();

      for (let i = 0; i < 7; i++) {
        await db
          .insertInto('empathy_challenge_day')
          .values({
            id: uuid(),
            challenge_id: challengeId,
            user_id: userId,
            day_number: i + 1,
            status: i === 0 ? 'unlocked' : 'locked',
            dose_oxytocin: 0,
            dose_serotonin: 0,
            created_at: now,
          })
          .execute();
      }

      return { id: challengeId };
    },
  });
}

export function useStartDay() {
  return useMutation({
    mutationFn: async (input: { dayId: string }) => {
      await db
        .updateTable('empathy_challenge_day')
        .set({ status: 'in_progress', started_at: new Date().toISOString() })
        .where('id', '=', input.dayId)
        .execute();
    },
  });
}

export function useCompleteDay() {
  return useMutation({
    mutationFn: async (input: { dayId: string; reflection: string }) => {
      const now = new Date().toISOString();

      const day = await db
        .selectFrom('empathy_challenge_day')
        .selectAll()
        .where('id', '=', input.dayId)
        .executeTakeFirst();

      if (!day) throw new Error('Day not found');

      await db
        .updateTable('empathy_challenge_day')
        .set({
          status: 'completed',
          reflection: input.reflection,
          dose_oxytocin: 10,
          dose_serotonin: 5,
          completed_at: now,
        })
        .where('id', '=', input.dayId)
        .execute();

      if (day.day_number && day.day_number < 7) {
        await db
          .updateTable('empathy_challenge_day')
          .set({ status: 'unlocked' })
          .where('challenge_id', '=', day.challenge_id)
          .where('day_number', '=', day.day_number + 1)
          .where('status', '=', 'locked')
          .execute();
      }

      if (day.day_number === 7) {
        await db
          .updateTable('empathy_challenge')
          .set({ status: 'completed', completed_at: now })
          .where('id', '=', day.challenge_id)
          .execute();
      }
    },
  });
}
