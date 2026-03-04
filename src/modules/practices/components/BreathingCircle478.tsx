import { colors } from '@/constants/colors';
import { useEffect } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const VIEWBOX = 100;
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_WIDTH = 6;
const TRACK_STROKE_WIDTH = 5;

// 4-7-8 phase durations in seconds
const INHALE = 4;
const HOLD = 7;
const EXHALE = 8;
const CYCLE_DURATION = INHALE + HOLD + EXHALE; // 19 seconds

interface BreathingCircle478Props {
  /** Current elapsed seconds in the session */
  elapsed: number;
  /** Whether the session is paused */
  isPaused: boolean;
}

export function BreathingCircle478({
  elapsed,
  isPaused,
}: BreathingCircle478Props) {
  const { height: screenHeight } = useWindowDimensions();
  // Responsive sizing: larger on taller screens
  const SIZE = screenHeight >= 800 ? 300 : 260;

  // Breathing scale animation: expands on inhale, holds, contracts on exhale
  const breathScale = useSharedValue(1);

  useEffect(() => {
    if (isPaused) return;

    const cyclePosition = elapsed % CYCLE_DURATION;

    if (cyclePosition < INHALE) {
      // Inhale phase: scale up
      const remaining = INHALE - cyclePosition;
      breathScale.value = withTiming(1.15, {
        duration: remaining * 1000,
        easing: Easing.inOut(Easing.ease),
      });
    } else if (cyclePosition < INHALE + HOLD) {
      // Hold phase: stay expanded
      breathScale.value = 1.15;
    } else {
      // Exhale phase: scale down
      const remaining = CYCLE_DURATION - cyclePosition;
      breathScale.value = withTiming(1, {
        duration: remaining * 1000,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [elapsed, isPaused, breathScale]);

  // Overall cycle progress (0 to 1 within one 19s cycle)
  const cyclePosition = elapsed % CYCLE_DURATION;
  const cycleProgress = cyclePosition / CYCLE_DURATION;
  const dashOffset = CIRCUMFERENCE * (1 - cycleProgress);

  // Calculate current phase countdown
  let phaseCountdown: number;
  if (cyclePosition < INHALE) {
    phaseCountdown = Math.ceil(INHALE - cyclePosition);
  } else if (cyclePosition < INHALE + HOLD) {
    phaseCountdown = Math.ceil(INHALE + HOLD - cyclePosition);
  } else {
    phaseCountdown = Math.ceil(CYCLE_DURATION - cyclePosition);
  }

  const innerGlowProps = useAnimatedProps(() => ({
    r: 30 * breathScale.value,
    opacity: 0.15 * breathScale.value,
  }));

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Background glow behind the ring */}
      <View
        className="absolute rounded-full"
        style={{
          top: SIZE * 0.1,
          left: SIZE * 0.1,
          right: SIZE * 0.1,
          bottom: SIZE * 0.1,
          backgroundColor: 'transparent',
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 60,
        }}
      />

      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
        <Defs>
          <LinearGradient
            id="circleGrad478"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={colors.primary.pink} />
            <Stop offset="100%" stopColor={colors.accent.yellow} />
          </LinearGradient>
        </Defs>

        {/* Track circle */}
        <Circle
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          r={RADIUS}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={TRACK_STROKE_WIDTH}
        />

        {/* Progress circle */}
        <Circle
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          r={RADIUS}
          fill="transparent"
          stroke="url(#circleGrad478)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          rotation={-90}
          origin={`${VIEWBOX / 2}, ${VIEWBOX / 2}`}
        />

        {/* Inner breathing glow */}
        <AnimatedCircle
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          fill={colors.primary.pink}
          animatedProps={innerGlowProps}
        />
      </Svg>

      {/* Center countdown */}
      <View className="absolute items-center justify-center">
        <Text
          className="text-7xl font-light tracking-tighter text-white"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {phaseCountdown.toString().padStart(2, '0')}
        </Text>
        <Text className="mt-1 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
          Seconds
        </Text>
      </View>
    </View>
  );
}
