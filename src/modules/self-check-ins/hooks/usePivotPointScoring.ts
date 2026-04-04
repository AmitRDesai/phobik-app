import { useAtomValue } from 'jotai';
import { useCallback } from 'react';

import { PATTERN_ARCHETYPES } from '../data/pivot-point-patterns';
import {
  PIVOT_QUESTIONS,
  TOTAL_PIVOT_QUESTIONS,
  type PivotPattern,
} from '../data/pivot-point-questions';
import { pivotPointAnswersAtom } from '../store/self-check-ins';

export interface PivotPointResults {
  scores: Record<PivotPattern, number>;
  percentages: Record<PivotPattern, number>;
  primaryPattern: PivotPattern;
  secondaryPattern: PivotPattern;
  regulationScore: number;
  archetypes: typeof PATTERN_ARCHETYPES;
}

const PATTERNS: PivotPattern[] = [
  'pusher',
  'escaper',
  'freezer',
  'pleaser',
  'regulator',
];

export function usePivotPointScoring() {
  const answers = useAtomValue(pivotPointAnswersAtom);

  const isComplete = Object.keys(answers).length >= TOTAL_PIVOT_QUESTIONS;

  const computeResults = useCallback((): PivotPointResults | null => {
    if (Object.keys(answers).length < TOTAL_PIVOT_QUESTIONS) return null;

    const scores = {} as Record<PivotPattern, number>;
    const percentages = {} as Record<PivotPattern, number>;

    for (const pattern of PATTERNS) {
      scores[pattern] = 0;
    }

    for (const q of PIVOT_QUESTIONS) {
      const answer = answers[q.id];
      if (answer !== undefined) {
        scores[q.pattern] += answer;
      }
    }

    // Convert to percentage: each pattern has 10 questions rated 1-5, max = 50
    for (const pattern of PATTERNS) {
      percentages[pattern] = scores[pattern] * 2;
    }

    // Sort by score descending
    const sorted = [...PATTERNS].sort((a, b) => scores[b] - scores[a]);

    return {
      scores,
      percentages,
      primaryPattern: sorted[0],
      secondaryPattern: sorted[1],
      regulationScore: percentages.regulator,
      archetypes: PATTERN_ARCHETYPES,
    };
  }, [answers]);

  return { isComplete, computeResults };
}
