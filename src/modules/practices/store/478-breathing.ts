import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface Breathing478SessionState {
  timeRemaining: number;
}

export const breathing478SessionAtom =
  atomWithStorage<Breathing478SessionState | null>(
    '478-breathing-session-state',
    null,
    storage,
  );
