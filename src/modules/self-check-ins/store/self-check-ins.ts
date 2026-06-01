import { storage } from '@/utils/jotai';
import { atom } from 'jotai';
import { atomWithStorage, selectAtom } from 'jotai/utils';
import type { StressorKey } from '../data/stressors';

function topStressorsEqual(
  a: { key: StressorKey; rating: number }[],
  b: { key: StressorKey; rating: number }[],
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].key !== b[i].key || a[i].rating !== b[i].rating) return false;
  }
  return true;
}

// --- Intimacy & Connection ---
export const intimacyAnswersAtom = atomWithStorage<Record<number, number>>(
  'self-check-ins:intimacy-answers',
  {},
  storage,
);

// --- The Pivot Point ---
export const pivotPointAnswersAtom = atomWithStorage<Record<number, number>>(
  'self-check-ins:pivot-point-answers',
  {},
  storage,
);

// --- Reset actions ---
export const resetIntimacyAtom = atom(null, (_get, set) => {
  set(intimacyAnswersAtom, {});
});

export const resetPivotPointAtom = atom(null, (_get, set) => {
  set(pivotPointAnswersAtom, {});
});

// --- Stress Compass ---
const defaultStressorRatings: Record<StressorKey, number> = {
  work: 5,
  financial: 2,
  relationships: 2,
  'self-image': 5,
  time: 3,
  'inner-critic': 8,
  isolation: 5,
  fear: 3,
  purpose: 8,
  exhaustion: 7,
};

export const stressorRatingsAtom = atom<Record<StressorKey, number>>(
  defaultStressorRatings,
);

export const topStressorsAtom = selectAtom(
  stressorRatingsAtom,
  (ratings) =>
    (Object.entries(ratings) as [StressorKey, number][])
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([key, rating]) => ({ key, rating })),
  topStressorsEqual,
);

export const resetStressCompassAtom = atom(null, (_get, set) => {
  set(stressorRatingsAtom, defaultStressorRatings);
});
