import {
  accentFor,
  colors,
  foregroundFor,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressRingProps {
  /** Normalized 0–1 progress. Clamped if out of range. */
  progress: number;
  /** Outer SVG size in pixels. Default 256. */
  size?: number;
  /** Track + arc stroke width. Default 4. */
  strokeWidth?: number;
  /** Single-color arc tone. Ignored when `gradient` is true. Default `pink`. */
  tone?: AccentHue;
  /** Use the brand pink→yellow gradient for the arc. Default false. */
  gradient?: boolean;
  /**
   * Animate width changes via reanimated. Default true.
   * Set false for a snap-to-value render (e.g. SSR / static contexts).
   */
  animated?: boolean;
  /** Animation duration in ms. Default 1000. */
  animationDuration?: number;
}

/**
 * Circular progress ring. SVG-based, smoothly animates value changes via
 * reanimated. Use as a hero progress visualization (grounding session
 * countdown, timer rings) where the linear ProgressBar would be lost.
 */
export function ProgressRing({
  progress,
  size = 256,
  strokeWidth = 4,
  tone = 'pink',
  gradient,
  animated = true,
  animationDuration = 1000,
}: ProgressRingProps) {
  const scheme = useScheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const clamped = Math.max(0, Math.min(1, isFinite(progress) ? progress : 0));
  const animatedProgress = useSharedValue(animated ? clamped : clamped);

  useEffect(() => {
    if (!animated) {
      animatedProgress.value = clamped;
      return;
    }
    animatedProgress.value = withTiming(clamped, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, animated, animationDuration]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const trackColor = foregroundFor(scheme, 0.05);
  const arcColor = gradient
    ? 'url(#progressRingGradient)'
    : accentFor(scheme, tone);

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: '-90deg' }] }}
    >
      {gradient ? (
        <Defs>
          <LinearGradient
            id="progressRingGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={colors.primary.pink} />
            <Stop offset="100%" stopColor={colors.accent.yellow} />
          </LinearGradient>
        </Defs>
      ) : null}
      {/* Background track */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Animated progress arc */}
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={arcColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeLinecap="round"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
