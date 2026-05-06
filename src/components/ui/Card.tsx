import { accentFor, withAlpha, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { View, type ViewProps, type ViewStyle } from 'react-native';

export type CardVariant =
  | 'default'
  | 'elevated'
  | 'surface'
  | 'glass'
  | 'toned';

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
  ...rest
}: CardProps) {
  const scheme = useScheme();

  if (variant === 'toned') {
    const accent = accentFor(scheme, tone ?? 'pink');
    return (
      <View
        {...rest}
        style={[
          {
            borderRadius: 24,
            borderWidth: 1,
            borderColor: withAlpha(accent, 0.2),
            backgroundColor: withAlpha(accent, scheme === 'dark' ? 0.08 : 0.06),
            padding: 20,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      {...rest}
      className={clsx(VARIANT_CLASSES[variant], className)}
      style={style}
    >
      {children}
    </View>
  );
}
