import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface StarBreathingSessionState {
  timeRemaining: number;
}

export const starBreathingSessionAtom =
  atomWithStorage<StarBreathingSessionState | null>(
    'star-breathing-session-state',
    null,
    storage,
  );
