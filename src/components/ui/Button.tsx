import { colors, withAlpha } from '@/constants/colors';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type Insets,
} from 'react-native';
import { EaseView } from 'react-native-ease';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

/**
 * Button size scale — names align with the Text scale so devs can intuit
 * pairings (a `lg` button label = a `lg` Text size, etc.).
 *
 *   xs — tiny pill / chip / inline link (~28px tall, 10px label uppercase)
 *   sm — small action / list-row inline (~36px tall, 13px label)
 *   md — medium card / form CTA (~44px tall, 15px label)
 *   lg — hero / sticky-bottom CTA (~56px tall, 17px label, auto full-width)
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps {
  onPress?: () => void;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered before the label. Ignored when `iconOnly` is true. */
  prefixIcon?: ReactNode;
  /** Icon rendered after the label. Ignored when `iconOnly` is true. */
  icon?: ReactNode;
  /**
   * Render as a square / circular icon-only button. `children` is treated as
   * the icon node. `accessibilityLabel` becomes required for screen readers.
   */
  iconOnly?: boolean;
  /** Stretch to the parent's width regardless of size. */
  fullWidth?: boolean;
  /** Replace the label with the spinner + this text while loading. */
  loadingText?: string;
  disabled?: boolean;
  loading?: boolean;
  /** Suppress press haptics. Default: false. */
  noHaptic?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

interface SizeStyle {
  px: number;
  py: number;
  minH: number;
  text: string;
  weight: string;
  radius: number;
  gap: number;
}

const sizeStyles: Record<ButtonSize, SizeStyle> = {
  xs: {
    px: 14,
    py: 6,
    minH: 28,
    text: 'text-[10px] uppercase tracking-wider',
    weight: 'font-bold',
    radius: 9999,
    gap: 4,
  },
  sm: {
    px: 18,
    py: 8,
    minH: 36,
    text: 'text-[13px]',
    weight: 'font-semibold',
    radius: 9999,
    gap: 6,
  },
  md: {
    px: 24,
    py: 12,
    minH: 44,
    text: 'text-[15px]',
    weight: 'font-bold',
    radius: 9999,
    gap: 8,
  },
  lg: {
    px: 32,
    py: 16,
    minH: 56,
    text: 'text-[17px]',
    weight: 'font-bold',
    radius: 9999,
    gap: 8,
  },
};

// hitSlop padding to bring sub-44pt sizes up to the Apple HIG accessibility
// minimum. The visual button stays compact while the tappable area expands.
const sizeHitSlop: Record<ButtonSize, Insets | undefined> = {
  xs: { top: 8, bottom: 8, left: 8, right: 8 }, // 28h → 44h
  sm: { top: 4, bottom: 4, left: 4, right: 4 }, // 36h → 44h
  md: undefined, // already 44
  lg: undefined,
};

const labelClass = (variant: ButtonVariant, size: ButtonSize): string => {
  const s = sizeStyles[size];
  // Ghost is always font-medium (lighter look for link-style actions)
  const weight = variant === 'ghost' ? 'font-medium' : s.weight;
  const color =
    variant === 'primary'
      ? 'text-white'
      : variant === 'destructive'
        ? 'text-status-danger'
        : variant === 'ghost'
          ? 'text-foreground/70'
          : 'text-foreground';
  return `text-center ${weight} ${s.text} ${color}`;
};

/**
 * Button primitive — the canonical CTA across the app.
 *
 *   <Button>Save</Button>                              // primary md
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="destructive">Delete</Button>
 *   <Button variant="ghost" size="xs">View All</Button>
 *   <Button iconOnly accessibilityLabel="Close">       // square / circular
 *     <MaterialIcons name="close" size={20} />
 *   </Button>
 *
 * Size scale (xs/sm/md/lg) mirrors the Text scale. `lg` auto-stretches to
 * full-width; smaller sizes size to content for inline / chip use. Pass
 * `fullWidth` to force any size to fill its parent.
 *
 * `xs` and `sm` ship with hitSlop padding so they hit the 44pt accessibility
 * minimum even though the visual is smaller.
 */
export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  prefixIcon,
  icon,
  iconOnly,
  fullWidth,
  loadingText,
  disabled,
  loading,
  noHaptic,
  className,
  accessibilityLabel,
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const blocked = disabled || loading;
  const s = sizeStyles[size];

  const handlePressIn = () => {
    if (loading) return;
    setPressed(true);
    if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const handlePressOut = () => {
    if (loading) return;
    setPressed(false);
  };

  const spinnerColor =
    variant === 'primary'
      ? 'white'
      : variant === 'destructive'
        ? colors.status.danger
        : undefined;

  const inner = loading ? (
    <View
      className="flex-row items-center justify-center"
      style={{ gap: s.gap }}
    >
      <ActivityIndicator color={spinnerColor} size="small" />
      {loadingText && !iconOnly ? (
        <Text className={labelClass(variant, size)}>{loadingText}</Text>
      ) : null}
    </View>
  ) : iconOnly ? (
    <View className="items-center justify-center">{children}</View>
  ) : (
    <View
      className="flex-row items-center justify-center"
      style={{ gap: s.gap }}
    >
      {prefixIcon}
      <Text className={labelClass(variant, size)}>{children}</Text>
      {icon}
    </View>
  );

  // Icon-only buttons render as a square with equal padding on all sides.
  // The square edge matches the size's normal vertical height.
  const sharedStyle = iconOnly
    ? {
        width: s.minH,
        height: s.minH,
        borderRadius: s.radius,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      }
    : {
        paddingHorizontal: s.px,
        paddingVertical: s.py,
        minHeight: s.minH || undefined,
        borderRadius: s.radius,
        justifyContent: 'center' as const,
      };

  let body: ReactNode;
  if (variant === 'primary') {
    // Glow scales with button prominence — bigger button, more glow.
    const glowBlur =
      size === 'lg' ? 12 : size === 'md' ? 10 : size === 'sm' ? 8 : 6;
    const glowOpacity =
      size === 'lg' ? 0.5 : size === 'md' ? 0.4 : size === 'sm' ? 0.35 : 0.3;
    body = (
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...sharedStyle,
          boxShadow: `0 4px ${glowBlur}px ${withAlpha(colors.primary.pink, glowOpacity)}`,
        }}
      >
        {inner}
      </LinearGradient>
    );
  } else if (variant === 'destructive') {
    // Soft red wash + red border + red text. Refined, signals "destructive"
    // unmistakably without resorting to a bright stop-sign red block.
    body = (
      <View
        style={sharedStyle}
        className="border border-status-danger/40 bg-status-danger/10"
      >
        {inner}
      </View>
    );
  } else if (variant === 'secondary') {
    body = (
      <View
        style={sharedStyle}
        className="border border-foreground/20 bg-transparent"
      >
        {inner}
      </View>
    );
  } else {
    // ghost
    body = (
      <View style={sharedStyle} className="bg-transparent">
        {inner}
      </View>
    );
  }

  // Full-width: explicit prop OR lg's default auto-stretch. Icon-only never
  // stretches.
  const stretches = !iconOnly && (fullWidth ?? size === 'lg');

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={blocked}
      hitSlop={sizeHitSlop[size]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!blocked, busy: !!loading }}
      className={clsx(stretches && 'w-full', className)}
    >
      <EaseView
        animate={{ scale: pressed ? 0.95 : 1, opacity: disabled ? 0.4 : 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      >
        {body}
      </EaseView>
    </Pressable>
  );
}
