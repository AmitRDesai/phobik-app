import { themeModeAtom, type ThemeMode } from '@/store/theme';
import { useAtom } from 'jotai';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ResolvedScheme = 'light' | 'dark';

/**
 * Single source of truth for the app's theme.
 *
 * Returns the user's preference (`mode` — light/dark/system) and the resolved
 * scheme (`scheme` — light/dark, accounting for system if mode === 'system').
 *
 * Also keeps NativeWind's internal colorScheme in sync, so `dark:` modifier
 * classes work without needing every component to wire it up.
 */
export function useTheme() {
  const [mode, setMode] = useAtom(themeModeAtom);
  const systemScheme = useRNColorScheme();
  const { setColorScheme } = useNativewindColorScheme();

  const scheme: ResolvedScheme =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  // Keep NativeWind's internal scheme in sync with our atom-driven mode.
  // This makes `dark:` modifier classes resolve correctly app-wide.
  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  return { mode, setMode, scheme };
}

export type { ThemeMode };
