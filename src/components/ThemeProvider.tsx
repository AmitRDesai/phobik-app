import { useTheme } from '@/hooks/useTheme';
import { vars } from 'nativewind';
import { type ReactNode } from 'react';
import { View } from 'react-native';

// Token values are RGB triplets so Tailwind's `<alpha-value>` placeholder
// resolves opacity at the className site (e.g. `text-foreground/55`).
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { scheme } = useTheme();
  return (
    <View style={[{ flex: 1 }, scheme === 'dark' ? darkVars : lightVars]}>
      {children}
    </View>
  );
}
