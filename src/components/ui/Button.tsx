import { colors, withAlpha } from '@/constants/colors';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { EaseView } from 'react-native-ease';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'default' | 'compact';

export interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered before the label. */
  prefixIcon?: ReactNode;
  /** Icon rendered after the label. */
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  /** Suppress press haptics. Default: false. */
  noHaptic?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

const sizeStyles = {
  default: { px: 32, py: 16, minH: 56, text: 'text-lg', radius: 9999 },
  compact: {
    px: 20,
    py: 8,
    minH: 0,
    text: 'text-[10px] uppercase tracking-wider',
    radius: 9999,
  },
} as const;

const labelClass = (variant: ButtonVariant, size: ButtonSize): string => {
  const weight = variant === 'ghost' ? 'font-medium' : 'font-bold';
  const base = `text-center ${weight} ${sizeStyles[size].text}`;
  const color =
    variant === 'primary' || variant === 'destructive'
      ? 'text-white'
      : variant === 'ghost'
        ? 'text-foreground/70'
        : 'text-foreground';
  return `${base} ${color}`;
};

/**
 * Button primitive — replaces both `Button.tsx` (was a stub) and supersedes
 * `GradientButton`. The `primary` variant uses the brand pink→yellow gradient;
 * `secondary` is outlined; `ghost` is text-only; `destructive` is a red CTA.
 *
 * Press feedback is a scale-down via EaseView. Haptics fire on press unless
 * disabled. Loading shows a spinner and locks only the button (not the
 * surrounding screen) per spec sec 6.
 */
export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'default',
  prefixIcon,
  icon,
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

  const inner = loading ? (
    <ActivityIndicator
      color={
        variant === 'primary' || variant === 'destructive' ? 'white' : undefined
      }
      size="small"
    />
  ) : (
    <View className="flex-row items-center justify-center gap-2">
      {prefixIcon}
      <Text className={labelClass(variant, size)}>{children}</Text>
      {icon}
    </View>
  );

  const sharedStyle = {
    paddingHorizontal: s.px,
    paddingVertical: s.py,
    minHeight: s.minH || undefined,
    borderRadius: s.radius,
    justifyContent: 'center' as const,
  };

  let body: ReactNode;
  if (variant === 'primary') {
    const blur = size === 'compact' ? 15 : 12;
    const opacity = size === 'compact' ? 0.4 : 0.5;
    body = (
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...sharedStyle,
          boxShadow: `0 4px ${blur}px ${withAlpha(colors.primary.pink, opacity)}`,
        }}
      >
        {inner}
      </LinearGradient>
    );
  } else if (variant === 'destructive') {
    body = (
      <View
        style={{ ...sharedStyle, backgroundColor: colors.status.danger }}
        className="bg-status-danger"
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={blocked}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!blocked, busy: !!loading }}
      className={clsx(size === 'default' && 'w-full', className)}
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
