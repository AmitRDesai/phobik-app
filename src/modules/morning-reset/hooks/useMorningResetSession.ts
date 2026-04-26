import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { FlowStep, MorningResetSession } from '../data/types';

export function useActiveMorningResetSession() {
  const userId = useUserId();

  const { data, isLoading, ...rest } = useQuery({
    queryKey: ['morning-reset-active', userId],
    query: db
      .selectFrom('morning_reset_session')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'in_progress')
      .orderBy('started_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const session = useMemo<MorningResetSession | null>(() => {
    const row = data?.[0];
    if (!row) return null;
    return toCamel(row) as MorningResetSession;
  }, [data]);

  return { session, isLoading, ...rest };
}

export function useStartMorningResetSession() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (): Promise<{ id: string }> => {
      if (!userId) throw new Error('Not authenticated');
      const id = uuid();
      const now = new Date().toISOString();

      await db
        .insertInto('morning_reset_session')
        .values({
          id,
          user_id: userId,
          status: 'in_progress',
          current_step: 'landing',
          started_at: now,
          created_at: now,
          updated_at: now,
        })
        .execute();

      return { id };
    },
  });
}

export function useUpdateMorningResetSession() {
  return useMutation({
    mutationFn: async (input: { id: string; currentStep: FlowStep }) => {
      await db
        .updateTable('morning_reset_session')
        .set({
          current_step: input.currentStep,
          updated_at: new Date().toISOString(),
        })
        .where('id', '=', input.id)
        .execute();
    },
  });
}

export function useCompleteMorningResetSession() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const now = new Date().toISOString();
      await db
        .updateTable('morning_reset_session')
        .set({
          status: 'completed',
          current_step: 'deep_focus',
          completed_at: now,
          updated_at: now,
        })
        .where('id', '=', input.id)
        .execute();
    },
  });
}

export function useAbandonMorningResetSession() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      await db
        .updateTable('morning_reset_session')
        .set({ status: 'abandoned', updated_at: new Date().toISOString() })
        .where('id', '=', input.id)
        .execute();
    },
  });
}
