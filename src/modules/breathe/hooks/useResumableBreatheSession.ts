import { useAtomValue } from 'jotai';

import { groundingSessionAtom } from '../store/grounding';
import {
  boxBreathingSessionAtom,
  breathing478SessionAtom,
  doubleInhaleSessionAtom,
  lazy8BreathingSessionAtom,
  starBreathingSessionAtom,
} from '../store/session-atoms';
import {
  BREATHE_EXERCISES,
  type BreatheExercise,
} from '../data/breathe-exercises';

const ATOM_BY_ID = {
  'box-breathing': boxBreathingSessionAtom,
  'breathing-478': breathing478SessionAtom,
  'star-breathing': starBreathingSessionAtom,
  'lazy-8': lazy8BreathingSessionAtom,
  'double-inhale': doubleInhaleSessionAtom,
  'grounding-54321': groundingSessionAtom,
} as const;

/** Returns the first Breathe exercise with a saved unfinished session, or null. */
export function useResumableBreatheSession(): BreatheExercise | null {
  const box = useAtomValue(boxBreathingSessionAtom);
  const breathing478 = useAtomValue(breathing478SessionAtom);
  const star = useAtomValue(starBreathingSessionAtom);
  const lazy8 = useAtomValue(lazy8BreathingSessionAtom);
  const doubleInhale = useAtomValue(doubleInhaleSessionAtom);
  const grounding = useAtomValue(groundingSessionAtom);

  const sessionsById: Record<keyof typeof ATOM_BY_ID, unknown> = {
    'box-breathing': box,
    'breathing-478': breathing478,
    'star-breathing': star,
    'lazy-8': lazy8,
    'double-inhale': doubleInhale,
    'grounding-54321': grounding,
  };

  for (const exercise of BREATHE_EXERCISES) {
    if (sessionsById[exercise.id as keyof typeof ATOM_BY_ID] != null) {
      return exercise;
    }
  }
  return null;
}
