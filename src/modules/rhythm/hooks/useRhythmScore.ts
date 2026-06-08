import dayjs from 'dayjs';

import {
  levelForRhythm,
  rhythmScore,
  type PillarScores,
  type RhythmLevel,
} from '../lib/scoring';
import { useMovementScore } from './useMovementScore';
import { useRecoveryScore } from './useRecoveryScore';
import { useRegulationScore } from './useRegulationScore';
import { useResilienceScore } from './useResilienceScore';

export type RhythmScore = {
  /** Composite My Rhythm score 0–100, or null if no pillars have data. */
  score: number | null;
  level: RhythmLevel;
  pillars: PillarScores;
  isLoading: boolean;
};

/** Composes the four pillar scores into the headline My Rhythm score. */
export function useRhythmScore(
  date: string = dayjs().format('YYYY-MM-DD'),
): RhythmScore {
  const recovery = useRecoveryScore(date);
  const regulation = useRegulationScore(date);
  const movement = useMovementScore(date);
  const resilience = useResilienceScore(date);

  const pillars: PillarScores = {
    recovery: recovery.score,
    regulation: regulation.score,
    movement: movement.score,
    resilience: resilience.score,
  };

  const score = rhythmScore(pillars);

  return {
    score,
    level: levelForRhythm(score),
    pillars,
    isLoading:
      recovery.isLoading ||
      regulation.isLoading ||
      movement.isLoading ||
      resilience.isLoading,
  };
}
