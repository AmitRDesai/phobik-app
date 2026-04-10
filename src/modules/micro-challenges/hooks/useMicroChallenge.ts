import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { sql } from 'kysely';
import { useMemo } from 'react';
import type { MicroChallengeAIContent } from './useMicroChallenge.types';

// ─── Active challenge ───

export function useActiveChallenge() {
  const userId = useUserId();

  const { data, ...rest } = useQuery({
    queryKey: ['micro-challenge-active', userId],
    query: db
      .selectFrom('micro_challenge')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'active')
      .limit(1),
    enabled: !!userId,
  });

  const challenge = useMemo(() => {
    if (!data?.[0]) return null;
    const row = toCamel(data[0], { aiResponse: true });
    return row;
  }, [data]);

  return { challenge, ...rest };
}

// ─── Stats ───

export function useMicroChallengeStats() {
  const userId = useUserId();

  // Total completed
  const { data: totalData } = useQuery({
    queryKey: ['micro-challenge-total', userId],
    query: db
      .selectFrom('micro_challenge')
      .select(sql<number>`count(*)`.as('count'))
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed'),
    enabled: !!userId,
  });

  // Completed today
  const today = new Date().toISOString().slice(0, 10);
  const { data: todayData } = useQuery({
    queryKey: ['micro-challenge-today', userId, today],
    query: db
      .selectFrom('micro_challenge')
      .select(sql<number>`count(*)`.as('count'))
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed')
      .where(sql`date(created_at)`, '=', today),
    enabled: !!userId,
  });

  // Weekly streak data
  const { data: weekData } = useQuery({
    queryKey: ['micro-challenge-week', userId, today],
    query: db
      .selectFrom('micro_challenge')
      .select([sql<string>`date(created_at)`.as('day')])
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed')
      .where(sql`created_at`, '>=', sql`date('now', '-7 days')`)
      .groupBy(sql`date(created_at)`),
    enabled: !!userId,
  });

  const totalCompleted = (totalData?.[0] as { count?: number })?.count ?? 0;
  const completedToday =
    ((todayData?.[0] as { count?: number })?.count ?? 0) > 0;
  const completedDates = useMemo(
    () => new Set(weekData?.map((r) => (r as { day: string }).day) ?? []),
    [weekData],
  );

  return { totalCompleted, completedToday, completedDates };
}

// ─── Mutations ───

export function useStartChallenge() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated');

      // Abandon any existing active challenge
      await db
        .updateTable('micro_challenge')
        .set({ status: 'abandoned' })
        .where('user_id', '=', userId)
        .where('status', '=', 'active')
        .execute();

      const id = uuid();
      const now = new Date().toISOString();

      await db
        .insertInto('micro_challenge')
        .values({
          id,
          user_id: userId,
          status: 'active',
          current_step: 0,
          dose_dopamine: 0,
          dose_oxytocin: 0,
          dose_serotonin: 0,
          dose_endorphins: 0,
          duration_seconds: 0,
          created_at: now,
        })
        .execute();

      return { id };
    },
  });
}

export function useUpdateChallenge() {
  return useMutation({
    mutationFn: async (input: {
      id: string;
      emotionId?: string;
      needId?: string;
      aiResponse?: MicroChallengeAIContent;
      currentStep?: number;
      doseDopamine?: number;
      doseOxytocin?: number;
      doseSerotonin?: number;
      doseEndorphins?: number;
    }) => {
      const set: {
        emotion_id?: string;
        need_id?: string;
        current_step?: number;
        dose_dopamine?: number;
        dose_oxytocin?: number;
        dose_serotonin?: number;
        dose_endorphins?: number;
        ai_response?: string;
      } = {};
      if (input.emotionId !== undefined) set.emotion_id = input.emotionId;
      if (input.needId !== undefined) set.need_id = input.needId;
      if (input.currentStep !== undefined) set.current_step = input.currentStep;
      if (input.doseDopamine !== undefined)
        set.dose_dopamine = input.doseDopamine;
      if (input.doseOxytocin !== undefined)
        set.dose_oxytocin = input.doseOxytocin;
      if (input.doseSerotonin !== undefined)
        set.dose_serotonin = input.doseSerotonin;
      if (input.doseEndorphins !== undefined)
        set.dose_endorphins = input.doseEndorphins;
      if (input.aiResponse !== undefined)
        set.ai_response = JSON.stringify(input.aiResponse);

      if (Object.keys(set).length === 0) return;

      await db
        .updateTable('micro_challenge')
        .set(set)
        .where('id', '=', input.id)
        .where('status', '=', 'active')
        .execute();
    },
  });
}

export function useCompleteChallenge() {
  return useMutation({
    mutationFn: async (input: {
      id: string;
      reflection?: string;
      durationSeconds?: number;
    }) => {
      const set: Record<string, unknown> = {
        status: 'completed',
        completed_at: new Date().toISOString(),
      };
      if (input.reflection) set.reflection = input.reflection;
      if (input.durationSeconds !== undefined)
        set.duration_seconds = input.durationSeconds;

      await db
        .updateTable('micro_challenge')
        .set(set)
        .where('id', '=', input.id)
        .where('status', '=', 'active')
        .execute();
    },
  });
}

export function useAbandonChallenge() {
  return useMutation({
    mutationFn: async (id: string) => {
      await db
        .updateTable('micro_challenge')
        .set({ status: 'abandoned' })
        .where('id', '=', id)
        .where('status', '=', 'active')
        .execute();
    },
  });
}

/** Format large numbers: 999 → "999", 1000 → "1K", 1500000 → "1.5M" */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  const m = n / 1_000_000;
  return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
}
