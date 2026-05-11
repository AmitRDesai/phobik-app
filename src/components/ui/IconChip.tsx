import {
  accentFor,
  foregroundFor,
  withAlpha,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

export type IconChipSize = 'sm' | 'md' | 'lg';
export type IconChipShape = 'rounded' | 'circle' | 'square';

const SIZE_PX: Record<IconChipSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

const SHAPE_RADIUS: Record<IconChipShape, number> = {
  rounded: 12,
  circle: 9999,
  square: 8,
};

export interface IconChipProps {
  size?: IconChipSize | number;
  shape?: IconChipShape;
  /** Tinted accent. Resolves bg = withAlpha(accent, 0.15) and supplies the
   * color to the children render-prop. Skip for a neutral foreground/10 bg. */
  tone?: AccentHue;
  /** Override the bg color (takes precedence over tone). */
  bg?: string;
  /** Optional border color. Width is 1px when set. */
  border?: string;
  /** Outer container className for spacing/margins. */
  className?: string;
  /**
   * When set, the chip renders as a Pressable with built-in light haptic +
   * active:opacity-70 feedback. `accessibilityLabel` becomes required for
   * screen readers.
   */
  onPress?: () => void;
  /** Required when `onPress` is set. */
  accessibilityLabel?: string;
  /** When true, the chip rejects taps and renders at 40% opacity. */
  disabled?: boolean;
  /** Suppress press haptic. Default: false. */
  noHaptic?: boolean;
  /** Inner icon. Pass a function to receive the resolved tone color. */
  children: ReactNode | ((color: string) => ReactNode);
}

/**
 * Icon chip — small square / rounded / circular container with a centered
 * icon. Display-only by default; pass `onPress` + `accessibilityLabel` to
 * turn it into a tappable icon button (header close button, settings row
 * action, etc.).
 */
export function IconChip({
  size = 'md',
  shape = 'rounded',
  tone,
  bg,
  border,
  className,
  onPress,
  accessibilityLabel,
  disabled,
  noHaptic,
  children,
}: IconChipProps) {
  const scheme = useScheme();
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  const accent = tone ? accentFor(scheme, tone) : foregroundFor(scheme, 0.85);
  const backgroundColor =
    bg ?? (tone ? withAlpha(accent, 0.15) : foregroundFor(scheme, 0.08));

  const containerStyle: ViewStyle = {
    width: px,
    height: px,
    borderRadius: SHAPE_RADIUS[shape],
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...(border ? { borderWidth: 1, borderColor: border } : null),
    ...(disabled ? { opacity: 0.4 } : null),
  };

  const content = typeof children === 'function' ? children(accent) : children;

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          if (disabled) return;
          if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !!disabled }}
        className={clsx('active:opacity-70', className)}
        style={containerStyle}
        hitSlop={px < 44 ? 8 : undefined}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={clsx(className)} style={containerStyle}>
      {content}
    </View>
  );
}
