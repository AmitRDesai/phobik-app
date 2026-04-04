import { storage } from '@/utils/jotai';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const letterDraftAtom = atomWithStorage<Record<string, string>>(
  'gentle-letter:draft',
  {},
  storage,
);

export const letterCoreActAtom = atomWithStorage<string | null>(
  'gentle-letter:core-act',
  null,
  storage,
);

export const resetLetterDraftAtom = atom(null, (_get, set) => {
  set(letterDraftAtom, {});
  set(letterCoreActAtom, null);
});
