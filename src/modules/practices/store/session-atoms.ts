import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export interface TimerSessionState {
  timeRemaining: number;
}

function createTimerSessionAtom(key: string) {
  return atomWithStorage<TimerSessionState | null>(key, null, storage);
}

export type TimerSessionAtom = ReturnType<typeof createTimerSessionAtom>;

export const boxBreathingSessionAtom = createTimerSessionAtom(
  'box-breathing-session-state',
);

export const starBreathingSessionAtom = createTimerSessionAtom(
  'star-breathing-session-state',
);

export const breathing478SessionAtom = createTimerSessionAtom(
  '478-breathing-session-state',
);

export const doubleInhaleSessionAtom = createTimerSessionAtom(
  'double-inhale-session-state',
);

export const lazy8BreathingSessionAtom = createTimerSessionAtom(
  'lazy-8-breathing-session-state',
);
