import { uuid } from '@/lib/crypto';
import { useLocalMutation } from '@/lib/powersync/useLocalMutation';
import { useUserId } from '@/lib/powersync/useUserId';
import { parseJSON, toCamel, toJSON } from '@/lib/powersync/utils';
import { usePowerSync, useQuery } from '@powersync/react';
import { useCallback, useMemo } from 'react';

type AssessmentType = 'intimacy' | 'pivot-point' | 'stress-compass';

const ASSESSMENT_JSON = { answers: true } as const;

export function useAssessmentList() {
  const userId = useUserId();
  const { data, ...rest } = useQuery(
    'SELECT * FROM self_check_in WHERE user_id = ? ORDER BY updated_at DESC',
    [userId ?? ''],
  );

  const transformed = useMemo(
    () => data?.map((r) => toCamel(r, ASSESSMENT_JSON)),
    [data],
  );
  return { data: transformed, ...rest };
}

export function useStartAssessment() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: { type: AssessmentType }) => {
      if (!userId) throw new Error('Not authenticated');

      const existing = await powersync.getOptional<Record<string, unknown>>(
        'SELECT * FROM self_check_in WHERE user_id = ? AND type = ? AND status = ?',
        [userId, input.type, 'in_progress'],
      );

      if (existing) return toCamel(existing, ASSESSMENT_JSON);

      const id = uuid();
      const now = new Date().toISOString();

      await powersync.execute(
        `INSERT INTO self_check_in (id, user_id, type, status, current_question, answers, started_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, input.type, 'in_progress', 0, toJSON({}), now, now, now],
      );

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
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

export function useSaveAnswer() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: {
      id: string;
      questionId: number;
      answer: number;
      currentQuestion: number;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const row = await powersync.getOptional<Record<string, unknown>>(
        'SELECT * FROM self_check_in WHERE id = ? AND user_id = ?',
        [input.id, userId],
      );

      if (!row) throw new Error('Assessment not found');

      const currentAnswers =
        parseJSON<Record<string, number>>(row.answers as string) ?? {};
      const updatedAnswers = {
        ...currentAnswers,
        [String(input.questionId)]: input.answer,
      };

      await powersync.execute(
        'UPDATE self_check_in SET answers = ?, current_question = ?, updated_at = ? WHERE id = ?',
        [
          toJSON(updatedAnswers),
          input.currentQuestion,
          new Date().toISOString(),
          input.id,
        ],
      );
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
}

export function useCompleteAssessment() {
  const powersync = usePowerSync();

  const fn = useCallback(
    async (input: { id: string }) => {
      const now = new Date().toISOString();
      await powersync.execute(
        "UPDATE self_check_in SET status = 'completed', completed_at = ?, updated_at = ? WHERE id = ?",
        [now, now, input.id],
      );
    },
    [powersync],
  );

  return useLocalMutation(fn);
}

export function useAbandonAssessment() {
  const powersync = usePowerSync();
  const userId = useUserId();

  const fn = useCallback(
    async (input: { id: string }) => {
      if (!userId) throw new Error('Not authenticated');

      await powersync.execute(
        "DELETE FROM self_check_in WHERE id = ? AND user_id = ? AND status = 'in_progress'",
        [input.id, userId],
      );
    },
    [powersync, userId],
  );

  return useLocalMutation(fn);
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
