import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Switch as RNSwitch } from 'react-native';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  /** Required when the switch isn't accompanied by a visible text label. */
  accessibilityLabel?: string;
}

/**
 * Themed binary toggle — wraps RN's Switch with the brand pink track-on
 * color, theme-aware track-off color (foreground/10), and a white thumb.
 *
 * Use for settings toggles, "anonymous post" flags, biometric enable —
 * any independent on/off choice. For mutually-exclusive options use
 * SegmentedControl; for selecting from a set use SelectionCard.
 */
export function Switch({
  value,
  onValueChange,
  disabled,
  accessibilityLabel,
}: SwitchProps) {
  const scheme = useScheme();
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      trackColor={{
        false: foregroundFor(scheme, 0.1),
        true: colors.primary.pink,
      }}
      thumbColor="white"
    />
  );
}
