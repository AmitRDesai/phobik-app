import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface BoxBreathingSessionState {
  timeRemaining: number;
}

export const boxBreathingSessionAtom =
  atomWithStorage<BoxBreathingSessionState | null>(
    'box-breathing-session-state',
    null,
    storage,
  );
