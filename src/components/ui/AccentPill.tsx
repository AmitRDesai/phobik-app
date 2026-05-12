import { Text } from '@/components/themed/Text';
import { accentFor, withAlpha, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { Pressable, View, type ViewStyle } from 'react-native';

export type AccentPillVariant = 'neutral' | 'tinted' | 'solid';
export type AccentPillSize = 'sm' | 'md';

export interface AccentPillProps {
  label: string;
  variant?: AccentPillVariant;
  /**
   * Required for `tinted` / `solid` variants. For `neutral`, optionally tints
   * the icon and label color while leaving the chrome neutral.
   */
  tone?: AccentHue;
  /** Render-prop leading icon — receives the resolved color. */
  icon?: (color: string) => React.ReactNode;
  /** Render-prop trailing icon — same color as the leading icon. */
  trailingIcon?: (color: string) => React.ReactNode;
  size?: AccentPillSize;
  onPress?: () => void;
  accessibilityLabel?: string;
  className?: string;
}

const SIZE_STYLES: Record<
  AccentPillSize,
  { container: string; gap: string; iconSize: number }
> = {
  sm: { container: 'px-3 py-1', gap: 'gap-1.5', iconSize: 12 },
  md: { container: 'px-3.5 py-1.5', gap: 'gap-2', iconSize: 14 },
};

export function AccentPill({
  label,
  variant = 'neutral',
  tone,
  icon,
  trailingIcon,
  size = 'sm',
  onPress,
  accessibilityLabel,
  className,
}: AccentPillProps) {
  const scheme = useScheme();
  const sizeStyles = SIZE_STYLES[size];

  const accent = tone ? accentFor(scheme, tone) : undefined;

  // All variants reserve 1px of border space so toggling between them
  // doesn't shift outer dimensions. Solid uses a transparent border.
  const containerStyle: ViewStyle | undefined =
    variant === 'tinted' && accent
      ? {
          backgroundColor: withAlpha(accent, 0.1),
          borderColor: withAlpha(accent, 0.25),
          borderWidth: 1,
        }
      : variant === 'solid' && accent
        ? {
            backgroundColor: accent,
            borderColor: 'transparent',
            borderWidth: 1,
          }
        : undefined;

  const containerClass = clsx(
    'flex-row items-center rounded-full border',
    sizeStyles.container,
    sizeStyles.gap,
    variant === 'neutral' && 'border-foreground/10 bg-foreground/5',
    onPress && 'active:opacity-70',
    className,
  );

  // Solid bg uses the saturated accent (dark mode) or its dark contrast-safe sibling (light mode).
  // Foreground on solid = opposite-of-bg: dark text in dark mode (bg is bright), light text in light mode (bg is dark).
  const solidForeground =
    scheme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.92)';

  const iconColor =
    variant === 'solid'
      ? solidForeground
      : (accent ??
        (scheme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'));

  // Label color:
  //  - solid:    follows solidForeground (dark text on bright bg, light text on dark bg)
  //  - tinted:   accent text (resolved via accentFor — theme-safe contrast on tone/10 bg)
  //  - neutral:  tone-tinted if tone given, otherwise foreground/55 via tone="secondary"
  const labelTone: 'secondary' | undefined =
    variant === 'neutral' && !accent ? 'secondary' : undefined;
  const labelStyle =
    variant === 'solid'
      ? { color: solidForeground }
      : accent
        ? { color: accent }
        : undefined;

  const content = (
    <>
      {icon ? icon(iconColor) : null}
      <Text
        size="xs"
        treatment="caption"
        weight="bold"
        tone={labelTone}
        style={labelStyle}
        numberOfLines={1}
      >
        {label}
      </Text>
      {trailingIcon ? trailingIcon(iconColor) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        className={containerClass}
        style={containerStyle}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={containerClass} style={containerStyle}>
      {content}
    </View>
  );
}
