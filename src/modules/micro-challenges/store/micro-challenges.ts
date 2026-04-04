import { storage } from '@/utils/jotai';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const mcStepAtom = atom<number>(0);

export const selectedBodyAreaAtom = atom<string | null>(null);

export const selectedSensationAttrsAtom = atom<Record<string, string>>({});

export const selectedEmotionAtom = atomWithStorage<string | null>(
  'mc:emotion',
  null,
  storage,
);

export const selectedNeedAtom = atomWithStorage<string | null>(
  'mc:need',
  null,
  storage,
);

export const reflectionTextAtom = atomWithStorage<string>(
  'mc:reflection',
  '',
  storage,
);

export const resetMicroChallengeAtom = atom(null, (_get, set) => {
  set(mcStepAtom, 0);
  set(selectedBodyAreaAtom, null);
  set(selectedSensationAttrsAtom, {});
  set(selectedEmotionAtom, null);
  set(selectedNeedAtom, null);
  set(reflectionTextAtom, '');
});
