import { IconChip } from '@/components/ui/IconChip';
import { foregroundFor } from '@/constants/colors';
import { useScheme, useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Scheme toggle for the Design System catalog headers — flips between
 * Light and Dark. Icon (light-mode / dark-mode) reflects the current
 * mode so the toggle is self-documenting.
 *
 * Dev-only — never use outside the Design System catalog. End-user
 * scheme switching lives in Settings.
 */
export function SchemeToggle() {
  const { setMode } = useTheme();
  const scheme = useScheme();
  const isDark = scheme === 'dark';
  const iconColor = foregroundFor(scheme, 0.7);

  return (
    <IconChip
      size="md"
      shape="circle"
      onPress={() => setMode(isDark ? 'light' : 'dark')}
      accessibilityLabel={
        isDark ? 'Scheme: Dark (tap for Light)' : 'Scheme: Light (tap for Dark)'
      }
    >
      <MaterialIcons
        name={isDark ? 'dark-mode' : 'light-mode'}
        size={20}
        color={iconColor}
      />
    </IconChip>
  );
}
