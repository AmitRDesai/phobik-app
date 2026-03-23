import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface GroundingSessionState {
  currentStepIndex: number;
  timeRemaining: number;
}

export const groundingSessionAtom =
  atomWithStorage<GroundingSessionState | null>(
    'grounding-session-state',
    null,
    storage,
  );
