import {
  accentFor,
  readableTextOn,
  withAlpha,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { Text, View, type ViewProps } from 'react-native';

export type BadgeVariant = 'tinted' | 'outline' | 'solid';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends Omit<ViewProps, 'children'> {
  /**
   * Visual style.
   * - `tinted`  — tinted bg + accent text (e.g. "Cognitive" pill, "BEST MATCH FOR YOU")
   * - `outline` — accent border + accent text on transparent
   * - `solid`   — saturated bg + white text (e.g. selected day in calendar)
   */
  variant?: BadgeVariant;
  size?: BadgeSize;
  tone?: AccentHue;
  className?: string;
  /** Optional leading icon. Pass a function to receive the resolved text color. */
  icon?: ReactNode | ((color: string) => ReactNode);
  children: string;
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-0.5',
  md: 'px-3 py-1',
};

const TEXT_SIZE: Record<BadgeSize, string> = {
  sm: 'text-[10px] font-bold uppercase tracking-widest',
  md: 'text-xs font-bold uppercase tracking-wider',
};

export function Badge({
  variant = 'tinted',
  size = 'sm',
  tone = 'pink',
  className,
  icon,
  children,
  ...rest
}: BadgeProps) {
  const scheme = useScheme();
  const accent = accentFor(scheme, tone);

  const bg =
    variant === 'tinted'
      ? withAlpha(accent, 0.15)
      : variant === 'solid'
        ? accent
        : 'transparent';
  const borderColor =
    variant === 'tinted' || variant === 'outline'
      ? withAlpha(accent, 0.3)
      : undefined;
  // Solid badges: pick text color per accent luminance — bright accents like
  // dark-mode yellow/cyan/gold fail contrast with white text.
  const textColor = variant === 'solid' ? readableTextOn(accent) : accent;
  const resolvedIcon = typeof icon === 'function' ? icon(textColor) : icon;

  return (
    <View
      {...rest}
      className={clsx(
        'flex-row items-center rounded-full',
        icon ? 'gap-1.5' : null,
        SIZE_CLASSES[size],
        className,
      )}
      style={{
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: variant === 'solid' ? 'transparent' : borderColor,
      }}
    >
      {resolvedIcon}
      <Text className={TEXT_SIZE[size]} style={{ color: textColor }}>
        {children}
      </Text>
    </View>
  );
}
