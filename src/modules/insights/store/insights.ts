import { atom } from 'jotai';

export type TimeRange = 'Day' | 'Week' | '2 Weeks' | 'Month';

export const timeRangeAtom = atom<TimeRange>('Week');

export const selectedStrengthsAtom = atom<string[]>([]);
