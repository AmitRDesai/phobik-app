import {
  accentFor,
  foregroundFor,
  withAlpha,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

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
  /** Inner icon. Pass a function to receive the resolved tone color. */
  children: ReactNode | ((color: string) => ReactNode);
}

export function IconChip({
  size = 'md',
  shape = 'rounded',
  tone,
  bg,
  border,
  className,
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
  };

  return (
    <View className={clsx(className)} style={containerStyle}>
      {typeof children === 'function' ? children(accent) : children}
    </View>
  );
}
