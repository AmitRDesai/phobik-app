import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export const isReturningUserAtom = atomWithStorage<boolean>(
  'returning-user',
  false,
  storage,
);
