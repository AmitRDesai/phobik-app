import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { DailyFlowSession, FlowStep } from '../data/types';

const ADD_ONS_JSON = { add_ons: true } as const;

export function useActiveDailyFlowSession() {
  const userId = useUserId();

  const { data, isLoading, ...rest } = useQuery({
    queryKey: ['daily-flow-active', userId],
    query: db
      .selectFrom('daily_flow_session')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'in_progress')
      .orderBy('started_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const session = useMemo<DailyFlowSession | null>(() => {
    const row = data?.[0];
    if (!row) return null;
    return toCamel(row, ADD_ONS_JSON) as DailyFlowSession;
  }, [data]);

  return { session, isLoading, ...rest };
}

export function useStartDailyFlowSession() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (): Promise<{ id: string }> => {
      if (!userId) throw new Error('Not authenticated');
      const id = uuid();
      const now = new Date().toISOString();

      await db
        .insertInto('daily_flow_session')
        .values({
          id,
          user_id: userId,
          status: 'in_progress',
          current_step: 'intro',
          started_at: now,
          add_ons: JSON.stringify({ eft: false, bilateral: false }),
          created_at: now,
          updated_at: now,
        })
        .execute();

      return { id };
    },
  });
}

type UpdateInput = {
  id: string;
  currentStep?: FlowStep;
  feeling?: string | null;
  intention?: string | null;
  supportOption?: string | null;
  addOns?: { eft: boolean; bilateral: boolean };
};

export function useUpdateDailyFlowSession() {
  return useMutation({
    mutationFn: async (input: UpdateInput) => {
      const patch: Record<string, string | null> = {
        updated_at: new Date().toISOString(),
      };
      if (input.currentStep !== undefined)
        patch.current_step = input.currentStep;
      if (input.feeling !== undefined) patch.feeling = input.feeling;
      if (input.intention !== undefined) patch.intention = input.intention;
      if (input.supportOption !== undefined)
        patch.support_option = input.supportOption;
      if (input.addOns !== undefined)
        patch.add_ons = JSON.stringify(input.addOns);

      await db
        .updateTable('daily_flow_session')
        .set(patch)
        .where('id', '=', input.id)
        .execute();
    },
  });
}

export function useCompleteDailyFlowSession() {
  return useMutation({
    mutationFn: async (input: { id: string; reflection: string }) => {
      const now = new Date().toISOString();
      await db
        .updateTable('daily_flow_session')
        .set({
          status: 'completed',
          current_step: 'reflection',
          reflection: input.reflection,
          completed_at: now,
          updated_at: now,
        })
        .where('id', '=', input.id)
        .execute();
    },
  });
}

export function useAbandonDailyFlowSession() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      await db
        .updateTable('daily_flow_session')
        .set({ status: 'abandoned', updated_at: new Date().toISOString() })
        .where('id', '=', input.id)
        .execute();
    },
  });
}
