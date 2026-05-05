import { themeModeAtom, type ThemeMode } from '@/store/theme';
import { useAtom, useAtomValue } from 'jotai';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ResolvedScheme = 'light' | 'dark';

function resolve(
  mode: ThemeMode,
  system: ReturnType<typeof useRNColorScheme>,
): ResolvedScheme {
  return mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
}

/**
 * Read-only access to the resolved scheme. Used by every `<Screen>` — keep
 * it minimal so a settings-screen `setMode` write doesn't re-render every
 * mounted Screen. Subscribes only to the atom value, not the setter.
 */
export function useScheme(): ResolvedScheme {
  const mode = useAtomValue(themeModeAtom);
  const system = useRNColorScheme();
  return resolve(mode, system);
}

/**
 * Read + write theme mode. Use this in settings screens where you need
 * `setMode`. Don't use in render-hot paths — `useScheme()` is cheaper.
 *
 * Returns the resolved scheme too as a convenience so settings UI can show
 * "(currently: dark)" alongside the toggle.
 */
export function useTheme() {
  const [mode, setMode] = useAtom(themeModeAtom);
  const system = useRNColorScheme();
  return { mode, setMode, scheme: resolve(mode, system) };
}

export type { ThemeMode };
