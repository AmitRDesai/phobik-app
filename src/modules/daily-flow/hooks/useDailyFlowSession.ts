import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';

import type {
  AnalysisResult,
  BodyRegionId,
  DailyFlowSession,
  EffectRating,
  EmotionalFamilyId,
  FlowStep,
  TimeOptionId,
} from '../data/types';

const SESSION_JSON = {
  emotional_families: true,
  body_regions: true,
  sensations: true,
  analysis_result: true,
} as const;

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

  const row = data?.[0];
  const session: DailyFlowSession | null = row
    ? (toCamel(row, SESSION_JSON) as DailyFlowSession)
    : null;

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
          emotional_families: JSON.stringify([]),
          body_regions: JSON.stringify([]),
          sensations: JSON.stringify([]),
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
  timeOption?: TimeOptionId | null;
  emotionalFamilies?: EmotionalFamilyId[];
  bodyRegions?: BodyRegionId[];
  sensations?: string[];
  analysisResult?: AnalysisResult | null;
  effectRating?: EffectRating | null;
};

export function useUpdateDailyFlowSession() {
  return useMutation({
    mutationFn: async (input: UpdateInput) => {
      const patch: Record<string, string | null> = {
        updated_at: new Date().toISOString(),
      };
      if (input.currentStep !== undefined)
        patch.current_step = input.currentStep;
      if (input.timeOption !== undefined) patch.time_option = input.timeOption;
      if (input.emotionalFamilies !== undefined)
        patch.emotional_families = JSON.stringify(input.emotionalFamilies);
      if (input.bodyRegions !== undefined)
        patch.body_regions = JSON.stringify(input.bodyRegions);
      if (input.sensations !== undefined)
        patch.sensations = JSON.stringify(input.sensations);
      if (input.analysisResult !== undefined)
        patch.analysis_result = input.analysisResult
          ? JSON.stringify(input.analysisResult)
          : null;
      if (input.effectRating !== undefined)
        patch.effect_rating = input.effectRating;

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
    mutationFn: async (input: {
      id: string;
      effectRating: EffectRating;
      reflectionText: string;
    }) => {
      const now = new Date().toISOString();
      await db
        .updateTable('daily_flow_session')
        .set({
          status: 'completed',
          current_step: 'reflection',
          effect_rating: input.effectRating,
          reflection_text: input.reflectionText,
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
