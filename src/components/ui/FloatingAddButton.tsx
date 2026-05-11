import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable } from 'react-native';

export interface FloatingAddButtonProps {
  onPress: () => void;
  /**
   * Icon node. Default: `<MaterialIcons name="add" size={28} color="white" />`.
   * Pass a different icon for compose / edit / search variants.
   */
  icon?: ReactNode;
  /** Required for screen readers when the icon isn't the default "+". Default: 'Add'. */
  accessibilityLabel?: string;
  /** Suppress the light haptic on press. Default: false. */
  noHaptic?: boolean;
  /**
   * Outer container className. Override the default `absolute bottom-8 right-6 z-40`
   * positioning if you need to anchor differently (e.g. inside a sticky footer).
   */
  className?: string;
  disabled?: boolean;
}

/**
 * Floating action button — circular gradient with a centered icon, pinned to
 * the bottom-right of the screen. The brand pink→yellow gradient + drop
 * shadow signal "primary action."
 *
 * Default placement (`absolute bottom-8 right-6 z-40`) sits above tab bars
 * and the home indicator. Override `className` for non-standard positions
 * (e.g. inside a sticky footer or above a custom safe-area).
 *
 * Use sparingly — one per screen. For secondary actions reach for an
 * inline Button.
 */
export function FloatingAddButton({
  onPress,
  icon,
  accessibilityLabel = 'Add',
  noHaptic,
  className,
  disabled,
}: FloatingAddButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      className={clsx(
        'absolute bottom-8 right-6 z-40 active:opacity-80',
        className,
      )}
      style={disabled ? { opacity: 0.4 } : undefined}
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${withAlpha(colors.primary.pink, 0.4)}`,
        }}
      >
        {icon ?? <MaterialIcons name="add" size={28} color="white" />}
      </LinearGradient>
    </Pressable>
  );
}
