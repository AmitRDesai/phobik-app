import { IconChip } from '@/components/ui/IconChip';
import { foregroundFor } from '@/constants/colors';
import { useScheme, useTheme, type ThemeMode } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

const NEXT: Record<ThemeMode, ThemeMode> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const ICON: Record<ThemeMode, keyof typeof MaterialIcons.glyphMap> = {
  system: 'brightness-auto',
  light: 'light-mode',
  dark: 'dark-mode',
};

const LABEL: Record<ThemeMode, string> = {
  system: 'Scheme: System (tap for Light)',
  light: 'Scheme: Light (tap for Dark)',
  dark: 'Scheme: Dark (tap for System)',
};

/**
 * Cycling scheme toggle for the Design System catalog headers.
 * Tap cycles System → Light → Dark → System. The icon reflects the
 * current mode so the toggle is self-documenting.
 *
 * Dev-only — never use outside the Design System catalog. End-user
 * scheme switching lives in Settings.
 */
export function SchemeToggle() {
  const { mode, setMode } = useTheme();
  const scheme = useScheme();
  const iconColor = foregroundFor(scheme, 0.7);

  return (
    <IconChip
      size="md"
      shape="circle"
      onPress={() => setMode(NEXT[mode])}
      accessibilityLabel={LABEL[mode]}
    >
      <MaterialIcons name={ICON[mode]} size={20} color={iconColor} />
    </IconChip>
  );
}
