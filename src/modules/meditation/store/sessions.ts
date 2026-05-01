import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface MeditationSessionState {
  currentTime: number;
  updatedAt: number;
}

// Keyed by meditation id (e.g. 'body-scan', 'loving-kindness'). A user can
// have multiple in-progress meditations simultaneously — opening a new one
// doesn't clobber the others. Cleared per-meditation on auto-completion.
export const meditationSessionsAtom = atomWithStorage<
  Record<string, MeditationSessionState>
>('meditation-sessions-state', {}, storage);
