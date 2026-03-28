import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { storage } from '@/utils/jotai';

/** Whether journal is currently unlocked (in-memory — resets on app restart) */
export const journalUnlockedAtom = atom(false);

/** Currently selected date on the calendar ("YYYY-MM-DD") */
export const selectedDateAtom = atom(new Date().toISOString().slice(0, 10));

/** Currently viewed month (1–12) */
export const selectedMonthAtom = atom(new Date().getMonth() + 1);

/** Currently viewed year */
export const selectedYearAtom = atom(new Date().getFullYear());

/** Draft entry persisted to AsyncStorage for crash recovery */
export const journalDraftAtom = atomWithStorage<{
  feeling: string | null;
  need: string | null;
  content: string;
  tags: string[];
} | null>('journal-draft', null, storage);
