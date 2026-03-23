import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export type SleepMeditationDuration = '15min' | '30min' | '45min' | 'full';

export interface SleepMeditationSessionState {
  selectedDuration: SleepMeditationDuration;
  currentTime: number;
}

export const sleepMeditationSessionAtom =
  atomWithStorage<SleepMeditationSessionState | null>(
    'sleep-meditation-session-state',
    null,
    storage,
  );
