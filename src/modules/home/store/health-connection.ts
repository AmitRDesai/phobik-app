import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export const hasConnectedHealthAtom = atomWithStorage<boolean>(
  'has-connected-health',
  false,
  storage,
);
