import { colors, foregroundFor } from '@/constants/colors';
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

const SIZE = 256;
const STROKE_WIDTH = 4;
const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ProgressRingProps {
  /** Progress from 0 to 1 */
  progress: number;
}

export function ProgressRing({ progress }: ProgressRingProps) {
  const scheme = useScheme();
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.linear,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - animatedProgress.value),
  }));

  return (
    <Svg
      width={SIZE}
      height={SIZE}
      style={{ transform: [{ rotate: '-90deg' }] }}
    >
      <Defs>
        <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={colors.primary.pink} />
          <Stop offset="100%" stopColor={colors.accent.yellow} />
        </LinearGradient>
      </Defs>
      {/* Background track */}
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="transparent"
        stroke={foregroundFor(scheme, 0.05)}
        strokeWidth={STROKE_WIDTH}
      />
      {/* Animated progress arc */}
      <AnimatedCircle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="transparent"
        stroke="url(#progressGradient)"
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={CIRCUMFERENCE}
        strokeLinecap="round"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
