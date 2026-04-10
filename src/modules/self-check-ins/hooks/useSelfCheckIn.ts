import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { parseJSON, toCamel, toJSON } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';

type AssessmentType = 'intimacy' | 'pivot-point' | 'stress-compass';

const ASSESSMENT_JSON = { answers: true } as const;

export function useAssessmentList() {
  const userId = useUserId();

  const { data, ...rest } = useQuery({
    queryKey: ['self-check-in-list', userId],
    query: db
      .selectFrom('self_check_in')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .orderBy('updated_at', 'desc'),
    enabled: !!userId,
  });

  const transformed = useMemo(
    () => data?.map((r) => toCamel(r, ASSESSMENT_JSON)),
    [data],
  );
  return { data: transformed, ...rest };
}

export function useStartAssessment() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: { type: AssessmentType }) => {
      if (!userId) throw new Error('Not authenticated');

      const existing = await db
        .selectFrom('self_check_in')
        .selectAll()
        .where('user_id', '=', userId)
        .where('type', '=', input.type)
        .where('status', '=', 'in_progress')
        .executeTakeFirst();

      if (existing) return toCamel(existing, ASSESSMENT_JSON);

      const id = uuid();
      const now = new Date().toISOString();

      await db
        .insertInto('self_check_in')
        .values({
          id,
          user_id: userId,
          type: input.type,
          status: 'in_progress',
          current_question: 0,
          answers: toJSON({}),
          started_at: now,
          created_at: now,
          updated_at: now,
        })
        .execute();

      return {
        id,
        userId,
        type: input.type,
        status: 'in_progress',
        currentQuestion: 0,
        answers: {},
        startedAt: now,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      };
    },
  });
}

export function useSaveAnswer() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      questionId: number;
      answer: number;
      currentQuestion: number;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const row = await db
        .selectFrom('self_check_in')
        .select('answers')
        .where('id', '=', input.id)
        .where('user_id', '=', userId)
        .executeTakeFirst();

      if (!row) throw new Error('Assessment not found');

      const currentAnswers =
        parseJSON<Record<string, number>>(row.answers) ?? {};
      const updatedAnswers = {
        ...currentAnswers,
        [String(input.questionId)]: input.answer,
      };

      await db
        .updateTable('self_check_in')
        .set({
          answers: toJSON(updatedAnswers),
          current_question: input.currentQuestion,
          updated_at: new Date().toISOString(),
        })
        .where('id', '=', input.id)
        .execute();
    },
  });
}

export function useCompleteAssessment() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const now = new Date().toISOString();
      await db
        .updateTable('self_check_in')
        .set({ status: 'completed', completed_at: now, updated_at: now })
        .where('id', '=', input.id)
        .execute();
    },
  });
}

export function useAbandonAssessment() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: { id: string }) => {
      if (!userId) throw new Error('Not authenticated');

      await db
        .deleteFrom('self_check_in')
        .where('id', '=', input.id)
        .where('user_id', '=', userId)
        .where('status', '=', 'in_progress')
        .execute();
    },
  });
}

/** Helper: find the latest in-progress assessment of a given type */
export function useInProgressAssessment(type: AssessmentType) {
  const { data: assessments } = useAssessmentList();
  return assessments?.find(
    (a) =>
      (a as Record<string, unknown>).type === type &&
      (a as Record<string, unknown>).status === 'in_progress',
  );
}
