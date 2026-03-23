import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface MuscleRelaxationSessionState {
  currentStepIndex: number;
}

export const muscleRelaxationSessionAtom =
  atomWithStorage<MuscleRelaxationSessionState | null>(
    'muscle-relaxation-session-state',
    null,
    storage,
  );
