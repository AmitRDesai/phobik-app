import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';
import type { CheckInTiming, SupportTone } from '../types';

export const calendarConnectedAtom = atomWithStorage<boolean>(
  'calendar:connected',
  false,
  storage,
);

export const selectedCalendarIdsAtom = atomWithStorage<string[]>(
  'calendar:stableIds',
  [],
  storage,
);

export const checkInTimingAtom = atomWithStorage<CheckInTiming | null>(
  'calendar:checkInTiming',
  null,
  storage,
);

export const supportToneAtom = atomWithStorage<SupportTone | null>(
  'calendar:supportTone',
  null,
  storage,
);
