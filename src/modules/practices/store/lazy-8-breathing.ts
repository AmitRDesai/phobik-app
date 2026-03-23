import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface Lazy8BreathingSessionState {
  timeRemaining: number;
}

export const lazy8BreathingSessionAtom =
  atomWithStorage<Lazy8BreathingSessionState | null>(
    'lazy-8-breathing-session-state',
    null,
    storage,
  );
