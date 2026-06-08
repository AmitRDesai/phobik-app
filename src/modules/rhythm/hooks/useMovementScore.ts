import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import { sql } from 'kysely';
import dayjs from 'dayjs';

import { activeMinutesScore, movementScore, stepsScore } from '../lib/scoring';

export type MovementScore = {
  /** Movement 0–100, or null if no activity data. */
  score: number | null;
  steps: number | null;
  baselineSteps: number | null;
  exerciseMinutes: number | null;
  isLoading: boolean;
};

/**
 * Reads `steps` + `exercise_minutes` daily-total readings from
 * `biometric_reading`. These metrics are populated by the HealthKit reader
 * added in the schema/plumbing phase — until then this degrades to null and
 * the Movement pillar shows a connect prompt.
 */
export function useMovementScore(
  date: string = dayjs().format('YYYY-MM-DD'),
): MovementScore {
  const userId = useUserId();
  const startOfDay = dayjs(date).startOf('day').toISOString();
  const startOfNextDay = dayjs(date).add(1, 'day').startOf('day').toISOString();

  const { data: today, isLoading } = useQuery({
    queryKey: ['movement-today', userId, date],
    query: db
      .selectFrom('biometric_reading')
      .select(['metric', 'value'])
      .where('user_id', '=', userId ?? '')
      .where('metric', 'in', ['steps', 'exercise_minutes'])
      .where('recorded_at', '>=', startOfDay)
      .where('recorded_at', '<', startOfNextDay),
    enabled: !!userId,
  });

  const { data: baseline, isLoading: baselineLoading } = useQuery({
    queryKey: ['movement-baseline', userId, date],
    query: db
      .selectFrom('biometric_reading')
      .select([sql<number>`AVG(value)`.as('avg_value')])
      .where('user_id', '=', userId ?? '')
      .where('metric', '=', 'steps')
      .where('recorded_at', '>=', dayjs(date).subtract(30, 'day').toISOString())
      .where('recorded_at', '<', startOfDay),
    enabled: !!userId,
  });

  const steps = today?.find((r) => r.metric === 'steps')?.value ?? null;
  const exerciseMinutes =
    today?.find((r) => r.metric === 'exercise_minutes')?.value ?? null;
  const baselineSteps = baseline?.[0]?.avg_value ?? null;

  const stepsSub = steps != null ? stepsScore(steps, baselineSteps) : null;
  const activeSub =
    exerciseMinutes != null ? activeMinutesScore(exerciseMinutes) : null;

  return {
    score: movementScore(stepsSub, activeSub),
    steps,
    baselineSteps,
    exerciseMinutes,
    isLoading: isLoading || baselineLoading,
  };
}
