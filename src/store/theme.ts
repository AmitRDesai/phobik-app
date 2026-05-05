import { storage } from '@/utils/jotai';
import { atomWithStorage } from 'jotai/utils';

export type ThemeMode = 'light' | 'dark' | 'system';

export const themeModeAtom = atomWithStorage<ThemeMode>(
  'theme-mode',
  'system',
  storage,
);
