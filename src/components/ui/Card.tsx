import { accentFor, withAlpha, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  Pressable,
  View,
  type PressableProps,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

/**
 * Card variants — visual style only. Physical size (padding + radius) is
 * controlled independently via `size`.
 *
 *   flat   — minimal in-flow card; foreground/5 bg + neutral border. Use
 *            inside other surfaces or as list rows.
 *   raised — surface-elevated bg + neutral border + DEFAULT subtle drop
 *            shadow. Use for hero cards, panels on plain bg, primary
 *            content.
 *   toned  — accent-tinted card. Requires `tone`. Use for callouts that
 *            should carry a category color (e.g. yellow info, pink warning).
 */
export type CardVariant = 'flat' | 'raised' | 'toned';

/**
 * Padding + corner radius. Decoupled from variant so any variant can be
 * tight (sm) or roomy (lg).
 *   sm — 12px / rounded-xl  (list rows, compact panels)
 *   md — 16px / rounded-2xl (default)
 *   lg — 24px / rounded-3xl (hero, panel, settings sections)
 */
export type CardSize = 'sm' | 'md' | 'lg';

/**
 * Colored shadow descriptor. Resolves to a RN 0.83+ `boxShadow` value via
 * `withAlpha(color, opacity)`. When passed on a `raised` card, this
 * overrides the default neutral drop shadow.
 *
 * `spread` is opt-in — when set, the shadow is emitted as the array form
 * (`[{ offsetX, offsetY, blurRadius, spreadDistance, color }]`) instead of
 * the string form, which does not support spread.
 */
export interface CardShadow {
  color: string;
  opacity?: number;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
  spread?: number;
}

export interface CardProps extends Omit<ViewProps, 'style'> {
  /** Visual variant. Default: `flat`. */
  variant?: CardVariant;
  /** Padding + radius. Default: `md`. */
  size?: CardSize;
  /**
   * Accent hue. Required for `variant="toned"` (drives border + bg).
   * Optional on `flat` / `raised` — tints the border without filling the bg.
   */
  tone?: AccentHue;
  /** Override the variant/size defaults. */
  className?: string;
  /** Inline style. Accepts compound shadow arrays / per-screen overrides. */
  style?: ViewStyle | ViewStyle[] | (ViewStyle | undefined | false)[];
  /** When set, the card renders as a Pressable with scale animation + haptic. */
  onPress?: PressableProps['onPress'];
  /**
   * Forwarded to Pressable. Disabled pressable cards render at 40% opacity
   * so users can see why they can't be tapped.
   */
  disabled?: boolean;
  /**
   * Optional colored glow (boxShadow). On `raised`, overrides the neutral
   * default. On `flat` / `toned`, adds a glow on top of the variant.
   * Defaults: opacity 0.2, blur 24, offsets 0.
   */
  shadow?: CardShadow;
  /** Suppress press haptics. Default: false. */
  noHaptic?: boolean;
}

interface SizeStyle {
  padding: number;
  radius: number;
}

const sizeStyles: Record<CardSize, SizeStyle> = {
  sm: { padding: 12, radius: 12 },
  md: { padding: 16, radius: 16 },
  lg: { padding: 24, radius: 24 },
};

function buildBoxShadow({
  color,
  opacity = 0.2,
  blur = 24,
  offsetX = 0,
  offsetY = 0,
  spread,
}: CardShadow): ViewStyle['boxShadow'] {
  const rgba = withAlpha(color, opacity);
  if (spread != null) {
    return [
      {
        offsetX,
        offsetY,
        blurRadius: blur,
        spreadDistance: spread,
        color: rgba,
      },
    ];
  }
  return `${offsetX}px ${offsetY}px ${blur}px ${rgba}`;
}

export function Card({
  variant = 'flat',
  size = 'md',
  tone,
  className,
  style,
  children,
  onPress,
  disabled,
  shadow,
  noHaptic,
  ...rest
}: CardProps) {
  const scheme = useScheme();
  const isPressable = onPress != null;
  const s = sizeStyles[size];

  // Base geometry: every variant gets the same padding + radius for the
  // chosen size, and a 1px border. Color of border/bg/shadow is per-variant.
  const baseStyle: ViewStyle = {
    borderRadius: s.radius,
    padding: s.padding,
    borderWidth: 1,
  };

  // Neutral border color (theme-aware) shared by flat and raised.
  const neutralBorder = `rgba(${scheme === 'dark' ? '255,255,255' : '0,0,0'},${variant === 'raised' ? '0.08' : '0.1'})`;

  if (variant === 'toned') {
    const accent = accentFor(scheme, tone ?? 'pink');
    baseStyle.borderColor = withAlpha(accent, 0.2);
    baseStyle.backgroundColor = withAlpha(
      accent,
      scheme === 'dark' ? 0.08 : 0.06,
    );
  } else {
    baseStyle.borderColor = neutralBorder;
    // `raised` gets a default subtle neutral drop shadow so it actually
    // elevates. Caller-passed `shadow` overrides this below.
    if (variant === 'raised' && !shadow) {
      const shadowAlpha = scheme === 'dark' ? 0.35 : 0.08;
      baseStyle.boxShadow = `0px 2px 10px rgba(0,0,0,${shadowAlpha})`;
    }
  }

  // Optional accent tint on the border for flat/raised (without filling bg).
  if (tone && variant !== 'toned') {
    const accent = accentFor(scheme, tone);
    baseStyle.borderColor = withAlpha(accent, 0.3);
  }

  // Background tokens — use className for theme-aware bg-surface-elevated /
  // bg-foreground/5 (NativeWind handles theme vars). Toned sets bg inline.
  const bgClass =
    variant === 'raised'
      ? 'bg-surface-elevated'
      : variant === 'flat'
        ? 'bg-foreground/5'
        : ''; // toned: bg comes from inline style

  const shadowOverride: ViewStyle | undefined = shadow
    ? { boxShadow: buildBoxShadow(shadow) }
    : undefined;

  const disabledStyle: ViewStyle | undefined =
    disabled && isPressable ? { opacity: 0.4 } : undefined;

  const composedClassName = clsx(
    bgClass,
    isPressable && !disabled && 'active:scale-[0.98]',
    className,
  );

  // Haptic-wrapped onPress for parity with Button.
  const handlePress: PressableProps['onPress'] = onPress
    ? (e) => {
        if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(e);
      }
    : undefined;

  if (isPressable) {
    return (
      <Pressable
        {...rest}
        onPress={handlePress}
        disabled={disabled}
        className={composedClassName}
        style={[baseStyle, shadowOverride, disabledStyle, style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      {...rest}
      className={composedClassName}
      style={[baseStyle, shadowOverride, style]}
    >
      {children}
    </View>
  );
}
