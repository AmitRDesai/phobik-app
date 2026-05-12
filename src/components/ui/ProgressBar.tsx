import { accentFor, colors, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export type ProgressBarSize = 'sm' | 'md' | 'lg';

const SIZE_HEIGHT: Record<ProgressBarSize, number> = {
  sm: 4,
  md: 6,
  lg: 10,
};

export interface ProgressBarProps {
  /** Normalized 0..1 progress. Clamped if out of range. */
  progress: number;
  /** Bar thickness. Default: `md` (6px). */
  size?: ProgressBarSize;
  /**
   * Fill tone (single-color mode). Default: `pink`. Ignored when
   * `gradient` is true.
   */
  tone?: AccentHue;
  /** When true, the filled portion uses the brand pink→yellow gradient. */
  gradient?: boolean;
  /**
   * Animate width changes via reanimated. Default false (snap-to-value).
   * Set true for slow progress updates (question N of M, upload progress).
   */
  animated?: boolean;
  /** Animation duration in ms. Default 400. */
  animationDuration?: number;
  /** Outer container className for layout (width, margins). */
  className?: string;
}

/**
 * Horizontal continuous progress indicator. For step-based progress (1 of 5),
 * use ProgressDots instead — ProgressBar is for continuous values like audio
 * playback, upload progress, breathing-flow countdowns.
 *
 * Pass `animated` for smooth width transitions when the progress value
 * changes (e.g. question-by-question assessments). Default is snap-to-value
 * for high-frequency updates (audio scrubbers) where animation would lag.
 */
export function ProgressBar({
  progress,
  size = 'md',
  tone = 'pink',
  gradient,
  animated,
  animationDuration = 400,
  className,
}: ProgressBarProps) {
  const scheme = useScheme();
  const clamped = Math.max(0, Math.min(1, isFinite(progress) ? progress : 0));
  const height = SIZE_HEIGHT[size];
  const widthPct = `${clamped * 100}%` as const;

  const animatedWidth = useSharedValue(animated ? 0 : clamped);

  useEffect(() => {
    if (!animated) return;
    animatedWidth.value = withTiming(clamped, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, animated, animationDuration]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%` as `${number}%`,
    height: '100%',
    borderRadius: 9999,
  }));

  return (
    <View
      className={clsx(
        'w-full overflow-hidden rounded-full bg-foreground/10',
        className,
      )}
      style={{ height }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      {animated ? (
        gradient ? (
          <AnimatedLinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={animatedStyle}
          />
        ) : (
          <Animated.View
            style={[
              animatedStyle,
              { backgroundColor: accentFor(scheme, tone) },
            ]}
          />
        )
      ) : gradient ? (
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ height: '100%', width: widthPct, borderRadius: 9999 }}
        />
      ) : (
        <View
          style={{
            height: '100%',
            width: widthPct,
            borderRadius: 9999,
            backgroundColor: accentFor(scheme, tone),
          }}
        />
      )}
    </View>
  );
}
