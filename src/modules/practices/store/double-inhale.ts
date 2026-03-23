import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface DoubleInhaleSessionState {
  timeRemaining: number;
}

export const doubleInhaleSessionAtom =
  atomWithStorage<DoubleInhaleSessionState | null>(
    'double-inhale-session-state',
    null,
    storage,
  );
