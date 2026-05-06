import { accentFor, withAlpha, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import {
  Pressable,
  View,
  type PressableProps,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

export type CardVariant =
  | 'default'
  | 'elevated'
  | 'surface'
  | 'glass'
  | 'toned';

/**
 * Centered colored glow descriptor. Resolves to a RN 0.83+ `boxShadow`
 * string via `withAlpha(color, opacity)`. Defaults give the soft "card glow"
 * we use for hero cards (pink/yellow halo at 0.2 alpha, 24px blur).
 */
export interface CardShadow {
  color: string;
  opacity?: number;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface CardProps extends Omit<ViewProps, 'style'> {
  /**
   * Visual variant.
   * - `default`  — rounded-2xl, foreground/10 border, foreground/5 bg, p-4
   * - `elevated` — rounded-3xl, foreground/[0.08] border, surface-elevated bg, p-6
   * - `surface`  — rounded-2xl, foreground/5 border, surface-elevated bg, p-4
   *   (softer alternative to `default` — for content cards that sit inside
   *   another card or on a heavier background)
   * - `glass`    — rounded-3xl, foreground/10 border, foreground/[0.04] bg, p-6
   * - `toned`    — rounded-3xl, accent border + tinted bg, p-5
   */
  variant?: CardVariant;
  /** Required when variant="toned". Sets the border + tinted-bg accent. */
  tone?: AccentHue;
  /** Override the default padding/border-radius. */
  className?: string;
  /** Inline style. Accepts compound shadow arrays / per-screen overrides. */
  style?: ViewStyle | ViewStyle[] | (ViewStyle | undefined | false)[];
  /** When set, the card renders as a Pressable with active:scale-[0.98]. */
  onPress?: PressableProps['onPress'];
  /** Forwarded to Pressable when onPress is set. */
  disabled?: boolean;
  /** Optional colored glow (boxShadow). Defaults: opacity 0.2, blur 24, offsets 0. */
  shadow?: CardShadow;
}

function buildBoxShadow({
  color,
  opacity = 0.2,
  blur = 24,
  offsetX = 0,
  offsetY = 0,
}: CardShadow): string {
  return `${offsetX}px ${offsetY}px ${blur}px ${withAlpha(color, opacity)}`;
}

const VARIANT_CLASSES: Record<Exclude<CardVariant, 'toned'>, string> = {
  default: 'rounded-2xl border border-foreground/10 bg-foreground/5 p-4',
  elevated:
    'rounded-3xl border border-foreground/[0.08] bg-surface-elevated p-6',
  surface: 'rounded-2xl border border-foreground/5 bg-surface-elevated p-4',
  glass: 'rounded-3xl border border-foreground/10 bg-foreground/[0.04] p-6',
};

export function Card({
  variant = 'default',
  tone,
  className,
  style,
  children,
  onPress,
  disabled,
  shadow,
  ...rest
}: CardProps) {
  const scheme = useScheme();
  const isPressable = onPress != null;
  const shadowStyle: ViewStyle | undefined = shadow
    ? { boxShadow: buildBoxShadow(shadow) }
    : undefined;

  if (variant === 'toned') {
    const accent = accentFor(scheme, tone ?? 'pink');
    const tonedStyle: ViewStyle = {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: withAlpha(accent, 0.2),
      backgroundColor: withAlpha(accent, scheme === 'dark' ? 0.08 : 0.06),
      padding: 20,
    };
    if (isPressable) {
      return (
        <Pressable
          {...rest}
          onPress={onPress}
          disabled={disabled}
          className={clsx('active:scale-[0.98]', className)}
          style={[tonedStyle, shadowStyle, style]}
        >
          {children}
        </Pressable>
      );
    }
    return (
      <View
        {...rest}
        className={className}
        style={[tonedStyle, shadowStyle, style]}
      >
        {children}
      </View>
    );
  }

  if (isPressable) {
    return (
      <Pressable
        {...rest}
        onPress={onPress}
        disabled={disabled}
        className={clsx(
          VARIANT_CLASSES[variant],
          'active:scale-[0.98]',
          className,
        )}
        style={[shadowStyle, style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      {...rest}
      className={clsx(VARIANT_CLASSES[variant], className)}
      style={[shadowStyle, style]}
    >
      {children}
    </View>
  );
}
