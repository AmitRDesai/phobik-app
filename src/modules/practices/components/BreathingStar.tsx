import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const STAR_PATH =
  'M100,20 L126,80 L190,80 L138,118 L158,180 L100,142 L42,180 L62,118 L10,80 L74,80 Z';

// All 10 vertices: 5 outer tips (even indices) + 5 inner points (odd indices)
const VX = [100, 126, 190, 138, 158, 100, 42, 62, 10, 74];
const VY = [20, 80, 80, 118, 180, 142, 180, 118, 80, 80];

// Star breathing timing (seconds)
const INHALE_DURATION = 4;
const HOLD_DURATION = 2;
const EXHALE_DURATION = 4;
const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION; // 10s
const ORBIT_DURATION = CYCLE_DURATION * 5; // 50s per full star trace

interface BreathingStarProps {
  /** Whether the breathing animation should run */
  isActive?: boolean;
  /** Whether the animation is paused */
  isPaused?: boolean;
  /** Called on the JS thread when the breathing phase changes */
  onPhaseChange?: (phase: string) => void;
  /** Starting elapsed time in seconds (for resuming sessions) */
  initialElapsed?: number;
}

function easeInOutQuad(t: number): number {
  'worklet';
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) * (-2 * t + 2)) / 2;
}

/** Compute orb position along the star for a given elapsed time */
function getOrbCoord(elapsedTime: number, axis: readonly number[]): number {
  'worklet';
  const orbitTime = elapsedTime % ORBIT_DURATION;
  const breathCycle = Math.floor(orbitTime / CYCLE_DURATION);
  const cycleTime = orbitTime % CYCLE_DURATION;

  const inhaleFrom = (breathCycle * 2 + 9) % 10;
  const inhaleTo = (breathCycle * 2) % 10;
  const exhaleTo = (breathCycle * 2 + 1) % 10;

  if (cycleTime < INHALE_DURATION) {
    const t = easeInOutQuad(cycleTime / INHALE_DURATION);
    return axis[inhaleFrom] + (axis[inhaleTo] - axis[inhaleFrom]) * t;
  } else if (cycleTime < INHALE_DURATION + HOLD_DURATION) {
    return axis[inhaleTo];
  } else {
    const t = easeInOutQuad(
      (cycleTime - INHALE_DURATION - HOLD_DURATION) / EXHALE_DURATION,
    );
    return axis[inhaleTo] + (axis[exhaleTo] - axis[inhaleTo]) * t;
  }
}

export function BreathingStar({
  isActive = true,
  isPaused = false,
  onPhaseChange,
  initialElapsed = 0,
}: BreathingStarProps) {
  const scheme = useScheme();
  const elapsed = useSharedValue(initialElapsed);
  const orbPulse = useSharedValue(1);

  useEffect(() => {
    if (!isActive || isPaused) {
      cancelAnimation(elapsed);
      cancelAnimation(orbPulse);
      return;
    }

    const remaining = ORBIT_DURATION * 100 - elapsed.value;
    elapsed.value = withTiming(ORBIT_DURATION * 100, {
      duration: remaining * 1000,
      easing: Easing.linear,
    });

    orbPulse.value = withRepeat(
      withTiming(1.5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [isActive, isPaused]);

  // Derive breathing phase from the animation elapsed time
  const phase = useDerivedValue(() => {
    'worklet';
    const cycleTime = elapsed.value % CYCLE_DURATION;
    if (cycleTime < INHALE_DURATION) return 'Inhale';
    if (cycleTime < INHALE_DURATION + HOLD_DURATION) return 'Hold';
    return 'Exhale';
  });

  useAnimatedReaction(
    () => phase.value,
    (current, previous) => {
      if (current !== previous && onPhaseChange) {
        scheduleOnRN(onPhaseChange, current);
      }
    },
  );

  const orbX = useDerivedValue(() => {
    'worklet';
    return getOrbCoord(elapsed.value, VX);
  });

  const orbY = useDerivedValue(() => {
    'worklet';
    return getOrbCoord(elapsed.value, VY);
  });

  const orbProps = useAnimatedProps(() => ({
    cx: orbX.value,
    cy: orbY.value,
    r: 5 * orbPulse.value,
  }));

  const glowProps = useAnimatedProps(() => ({
    cx: orbX.value,
    cy: orbY.value,
  }));

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: 280, height: 280 }}
    >
      <Svg width={280} height={280} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.primary.pink} />
            <Stop offset="100%" stopColor={colors.accent.yellow} />
          </LinearGradient>
        </Defs>
        {/* Ghost track */}
        <Path
          d={STAR_PATH}
          fill="none"
          stroke={foregroundFor(scheme, 0.1)}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Gradient star */}
        <Path
          d={STAR_PATH}
          fill="none"
          stroke="url(#starGrad)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Concentric guide circles */}
        <Circle
          cx={100}
          cy={100}
          r={45}
          fill="none"
          stroke={foregroundFor(scheme, 0.05)}
          strokeWidth={0.5}
        />
        <Circle
          cx={100}
          cy={100}
          r={55}
          fill="none"
          stroke={foregroundFor(scheme, 0.03)}
          strokeWidth={0.5}
        />
        {/* Orb outer glow */}
        <AnimatedCircle
          r={14}
          fill={foregroundFor(scheme, 0.08)}
          animatedProps={glowProps}
        />
        {/* Orb inner glow */}
        <AnimatedCircle
          r={9}
          fill={withAlpha(colors.pink[400], 0.25)}
          animatedProps={glowProps}
        />
        {/* Breathing orb */}
        <AnimatedCircle fill="white" animatedProps={orbProps} />
      </Svg>

      {/* Center BPM display */}
      <View className="absolute items-center justify-center">
        <View className="mb-0.5 flex-row items-center justify-center gap-1">
          <MaterialIcons
            name="favorite"
            size={14}
            color={colors.primary.pink}
          />
          <Text
            className="text-3xl font-bold tracking-tight text-foreground"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            72
          </Text>
        </View>
        <Text variant="caption" className="text-foreground/30">
          BPM
        </Text>
      </View>
    </View>
  );
}
