import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { dialog } from '@/utils/dialog';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';

import { isTodayLocal } from '../data/flow-navigation';
import type {
  AnalysisResult,
  BodyRegionId,
  CheckInState,
  DailyFlowSession,
  EffectRating,
  EmotionalFamilyId,
  FeelingIntensities,
  FlowStep,
  StressorId,
  TimeOptionId,
} from '../data/types';

const SESSION_JSON = {
  emotional_families: true,
  feeling_intensities: true,
  body_regions: true,
  sensations: true,
  analysis_result: true,
} as const;

export function useActiveDailyFlowSession() {
  const userId = useUserId();

  const { data, isLoading } = useQuery({
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

  return { session, isLoading };
}

/**
 * Whether today's Daily Flow is already underway — drives "Resume" vs "Start"
 * CTAs. True only for an in-progress session started today (stale sessions
 * from prior days don't count).
 */
export function useResumableDailyFlow() {
  const { session, isLoading } = useActiveDailyFlowSession();
  const canResume = !!session?.startedAt && isTodayLocal(session.startedAt);
  return { canResume, isLoading };
}

/**
 * Entry handler for the Daily Flow CTAs. Returns `canResume` (for the label)
 * and `start()`:
 *   - resuming an in-progress flow, or the first flow of the day → enter directly
 *   - already completed today → confirm before starting a fresh session
 */
export function useStartDailyFlow() {
  const router = useRouter();
  const userId = useUserId();
  const { canResume } = useResumableDailyFlow();

  const startOfDay = dayjs().startOf('day').toISOString();
  const startOfNextDay = dayjs().add(1, 'day').startOf('day').toISOString();
  const { data } = useQuery({
    queryKey: ['daily-flow-completed-today', userId, startOfDay],
    query: db
      .selectFrom('daily_flow_session')
      .select(['id'])
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed')
      .where('completed_at', '>=', startOfDay)
      .where('completed_at', '<', startOfNextDay)
      .limit(1),
    enabled: !!userId,
  });
  const completedToday = (data?.length ?? 0) > 0;

  const start = async () => {
    if (!canResume && completedToday) {
      const result = await dialog.info<'start' | 'cancel'>({
        title: 'Start another Daily Flow?',
        message:
          "You've already completed your Daily Flow today. Starting again begins a fresh session.",
        buttons: [
          { label: 'Cancel', value: 'cancel', variant: 'secondary' },
          { label: 'Start', value: 'start', variant: 'primary' },
        ],
      });
      if (result !== 'start') return;
    }
    router.push('/daily-flow');
  };

  return { start, canResume };
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
          feeling_intensities: JSON.stringify({}),
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
  feelingIntensities?: FeelingIntensities;
  stressor?: StressorId | null;
  checkInState?: CheckInState | null;
  bodyRegions?: BodyRegionId[];
  sensations?: string[];
  analysisResult?: AnalysisResult | null;
  affirmationText?: string | null;
  affirmationCategory?: string | null;
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
      if (input.feelingIntensities !== undefined)
        patch.feeling_intensities = JSON.stringify(input.feelingIntensities);
      if (input.stressor !== undefined) patch.stressor = input.stressor;
      if (input.checkInState !== undefined)
        patch.check_in_state = input.checkInState;
      if (input.bodyRegions !== undefined)
        patch.body_regions = JSON.stringify(input.bodyRegions);
      if (input.sensations !== undefined)
        patch.sensations = JSON.stringify(input.sensations);
      if (input.analysisResult !== undefined)
        patch.analysis_result = input.analysisResult
          ? JSON.stringify(input.analysisResult)
          : null;
      if (input.affirmationText !== undefined)
        patch.affirmation_text = input.affirmationText;
      if (input.affirmationCategory !== undefined)
        patch.affirmation_category = input.affirmationCategory;
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
