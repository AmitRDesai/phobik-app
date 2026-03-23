import { colors } from '@/constants/colors';
import { useEffect, useRef } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Mask,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const VIEWBOX = 100;
const CENTER = VIEWBOX / 2;
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_WIDTH = 6;
const TRACK_STROKE_WIDTH = 5;

// 4-7-8 phase durations in seconds
const INHALE = 4;
const HOLD = 7;
const EXHALE = 8;
const CYCLE_DURATION = INHALE + HOLD + EXHALE; // 19 seconds

// Inner glow circle radius range (in viewBox units)
// Progress ring inner edge is at ~41 (RADIUS - STROKE_WIDTH/2)
const GLOW_R_MIN = 24;
const GLOW_R_MAX = 36; // leaves 5px gap from ring

interface BreathingCircle478Props {
  /** Current elapsed seconds in the session */
  elapsed: number;
  /** Whether the session is paused */
  isPaused: boolean;
  /** Whether the breathing session is active (after instruction + countdown) */
  isActive?: boolean;
  /** Current phase index: 0=inhale, 1=hold, 2=exhale */
  phaseIndex?: number;
}

export function BreathingCircle478({
  elapsed,
  isPaused,
  isActive = true,
  phaseIndex = 0,
}: BreathingCircle478Props) {
  const { height: screenHeight } = useWindowDimensions();
  const SIZE = screenHeight >= 800 ? 300 : 260;

  // Animated radius for the inner glow
  const glowR = useSharedValue(GLOW_R_MIN);

  useEffect(() => {
    if (isPaused || !isActive) return;

    if (phaseIndex === 0) {
      glowR.value = withTiming(GLOW_R_MAX, {
        duration: INHALE * 1000,
        easing: Easing.inOut(Easing.ease),
      });
    } else if (phaseIndex === 1) {
      glowR.value = GLOW_R_MAX;
    } else {
      glowR.value = withTiming(GLOW_R_MIN, {
        duration: EXHALE * 1000,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [phaseIndex, isPaused, isActive, glowR]);

  const glowProps = useAnimatedProps(() => ({
    r: glowR.value,
  }));

  // Animate progress ring smoothly — reverse animate on cycle change
  const animatedOffset = useSharedValue(CIRCUMFERENCE);
  const prevCycleRef = useRef(Math.floor(elapsed / CYCLE_DURATION));

  useEffect(() => {
    const currentCycle = Math.floor(elapsed / CYCLE_DURATION);
    const cyclePosition = elapsed % CYCLE_DURATION;
    const cycleProgress = cyclePosition / CYCLE_DURATION;
    const targetOffset = CIRCUMFERENCE * (1 - cycleProgress);

    if (currentCycle !== prevCycleRef.current) {
      // Cycle changed — animate ring to full first, then reset to empty
      prevCycleRef.current = currentCycle;
      animatedOffset.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      animatedOffset.value = withTiming(targetOffset, {
        duration: 1000,
        easing: Easing.linear,
      });
    }
  }, [elapsed, animatedOffset]);

  const progressProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  // Calculate current phase countdown
  const cyclePos = elapsed % CYCLE_DURATION;
  let phaseCountdown: number;
  if (cyclePos < INHALE) {
    phaseCountdown = Math.ceil(INHALE - cyclePos);
  } else if (cyclePos < INHALE + HOLD) {
    phaseCountdown = Math.ceil(INHALE + HOLD - cyclePos);
  } else {
    phaseCountdown = Math.ceil(CYCLE_DURATION - cyclePos);
  }

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
    >
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}>
        <Defs>
          {/* Progress ring gradient */}
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

          {/* Glow color — diagonal linear gradient matching GlowBg */}
          <LinearGradient id="breathGlowColor" x1="0" y1="0" x2="1" y2="1">
            <Stop
              offset="0%"
              stopColor={colors.primary.pink}
              stopOpacity={0.2}
            />
            <Stop
              offset="100%"
              stopColor={colors.accent.yellow}
              stopOpacity={0.12}
            />
          </LinearGradient>

          {/* Radial fade mask — solid center, fades to transparent */}
          <RadialGradient id="breathGlowMask" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="white" stopOpacity={1} />
            <Stop offset="35%" stopColor="white" stopOpacity={0.5} />
            <Stop offset="65%" stopColor="white" stopOpacity={0.15} />
            <Stop offset="100%" stopColor="white" stopOpacity={0} />
          </RadialGradient>

          <Mask id="breathFadeMask">
            <Rect x="0" y="0" width={VIEWBOX} height={VIEWBOX} fill="black" />
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={CENTER}
              fill="url(#breathGlowMask)"
            />
          </Mask>
        </Defs>

        {/* Breathing glow — circular, fades at edges */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          fill="url(#breathGlowColor)"
          mask="url(#breathFadeMask)"
          animatedProps={glowProps}
        />

        {/* Track circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={TRACK_STROKE_WIDTH}
        />

        {/* Progress circle — animated */}
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="transparent"
          stroke="url(#circleGrad478)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          rotation={-90}
          origin={`${CENTER}, ${CENTER}`}
          animatedProps={progressProps}
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
