import { accentFor, withAlpha, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
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
  const textColor = variant === 'solid' ? 'white' : accent;

  return (
    <View
      {...rest}
      className={clsx('rounded-full', SIZE_CLASSES[size], className)}
      style={{
        backgroundColor: bg,
        borderWidth: variant === 'solid' ? 0 : 1,
        borderColor,
      }}
    >
      <Text className={TEXT_SIZE[size]} style={{ color: textColor }}>
        {children}
      </Text>
    </View>
  );
}
