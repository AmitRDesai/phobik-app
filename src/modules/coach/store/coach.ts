import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export const activeThreadIdAtom = atomWithStorage<string | null>(
  'coach-active-thread-id',
  null,
  storage,
);
