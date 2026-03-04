import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export const dailyRemindersAtom = atomWithStorage<boolean>(
  'notifications:dailyReminders',
  true,
  storage,
);

export const checkInRemindersAtom = atomWithStorage<boolean>(
  'notifications:checkInReminders',
  true,
  storage,
);

export const challengeNotificationsAtom = atomWithStorage<boolean>(
  'notifications:challengeNotifications',
  true,
  storage,
);
