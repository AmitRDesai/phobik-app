import { useScheme } from '@/hooks/useTheme';
import { themeModeAtom } from '@/store/theme';
import { useAtomValue } from 'jotai';
import { useColorScheme as useNativewindColorScheme, vars } from 'nativewind';
import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';

const lightVars = vars({
  '--color-surface': '250 250 250',
  '--color-surface-elevated': '255 255 255',
  '--color-surface-input': '245 245 245',
  '--color-foreground': '10 10 10',
  '--color-border': '0 0 0',
  '--color-overlay': '0 0 0',
});

const darkVars = vars({
  '--color-surface': '5 5 5',
  '--color-surface-elevated': '26 19 24',
  '--color-surface-input': '26 26 26',
  '--color-foreground': '255 255 255',
  '--color-border': '255 255 255',
  '--color-overlay': '0 0 0',
});

/**
 * Applies theme tokens via NativeWind `vars()` and keeps NativeWind's
 * internal colorScheme in sync with our `themeMode` atom. Mounting this
 * once at the root means every `dark:` modifier class downstream resolves
 * correctly without each consumer wiring it up.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useAtomValue(themeModeAtom);
  const scheme = useScheme();
  const { setColorScheme } = useNativewindColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  return (
    <View style={[{ flex: 1 }, scheme === 'dark' ? darkVars : lightVars]}>
      {children}
    </View>
  );
}
