import { colors } from '@/constants/colors';
import { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
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

// The infinity/lemniscate SVG path from the design
// viewBox is "-25 0 115 80" — the path spans roughly x: -16..80, y: 10..70
const INFINITY_PATH =
  'M32 40 C32 10, 80 10, 80 40 C80 70, 32 70, 32 40 C32 10, -16 10, -16 40 C-16 70, 32 70, 32 40';

// Bezier segment control points: [startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY]
type BezierSegment = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

const SEGMENTS: BezierSegment[] = [
  [32, 40, 32, 10, 80, 10, 80, 40], // right top half
  [80, 40, 80, 70, 32, 70, 32, 40], // right bottom half
  [32, 40, 32, 10, -16, 10, -16, 40], // left top half
  [-16, 40, -16, 70, 32, 70, 32, 40], // left bottom half
];

function cubicBezier(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
) {
  'worklet';
  const u = 1 - t;
  return (
    u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  );
}

const NUM_SEGMENTS = SEGMENTS.length;
const SAMPLES_PER_SEGMENT = 20;
const TOTAL_SAMPLES = NUM_SEGMENTS * SAMPLES_PER_SEGMENT;

// Pre-compute sample points for worklet interpolation
const PX: number[] = [];
const PY: number[] = [];

for (let s = 0; s < NUM_SEGMENTS; s++) {
  const seg = SEGMENTS[s];
  for (let i = 0; i < SAMPLES_PER_SEGMENT; i++) {
    const t = i / SAMPLES_PER_SEGMENT;
    PX.push(cubicBezier(t, seg[0], seg[2], seg[4], seg[6]));
    PY.push(cubicBezier(t, seg[1], seg[3], seg[5], seg[7]));
  }
}

// Lazy 8 timing: 4s inhale (right loop) + 4s exhale (left loop) = 8s cycle
const CYCLE_DURATION = 8;
const INHALE_DURATION = 4;

interface BreathingInfinityProps {
  /** Whether the breathing animation should run */
  isActive?: boolean;
  /** Whether the animation is paused */
  isPaused?: boolean;
  /** Called on the JS thread when the breathing phase changes */
  onPhaseChange?: (phase: string) => void;
  /** Starting elapsed time in seconds (for resuming sessions) */
  initialElapsed?: number;
}

export function BreathingInfinity({
  isActive = true,
  isPaused = false,
  onPhaseChange,
  initialElapsed = 0,
}: BreathingInfinityProps) {
  const { width: screenWidth } = useWindowDimensions();
  const svgWidth = Math.min(screenWidth - 48, 400);
  // Match viewBox aspect ratio (124:88) so the path is perfectly centered
  const svgHeight = svgWidth * (88 / 124);

  const elapsed = useSharedValue(initialElapsed);
  const orbPulse = useSharedValue(1);

  useEffect(() => {
    if (!isActive || isPaused) {
      cancelAnimation(elapsed);
      cancelAnimation(orbPulse);
      return;
    }

    const remaining = CYCLE_DURATION * 100 - elapsed.value;
    elapsed.value = withTiming(CYCLE_DURATION * 100, {
      duration: remaining * 1000,
      easing: Easing.linear,
    });

    orbPulse.value = withRepeat(
      withTiming(1.5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [isActive, isPaused, elapsed, orbPulse]);

  // Derive breathing phase from elapsed time
  const phase = useDerivedValue(() => {
    'worklet';
    const cycleTime = elapsed.value % CYCLE_DURATION;
    return cycleTime < INHALE_DURATION ? 'Inhale' : 'Exhale';
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
    // Convert elapsed seconds to progress along the path (0..1 per cycle)
    const cycleProgress = (elapsed.value % CYCLE_DURATION) / CYCLE_DURATION;
    const progress = cycleProgress * TOTAL_SAMPLES;
    const i = Math.floor(progress) % TOTAL_SAMPLES;
    const next = (i + 1) % TOTAL_SAMPLES;
    const t = progress - Math.floor(progress);
    return PX[i] + (PX[next] - PX[i]) * t;
  });

  const orbY = useDerivedValue(() => {
    'worklet';
    const cycleProgress = (elapsed.value % CYCLE_DURATION) / CYCLE_DURATION;
    const progress = cycleProgress * TOTAL_SAMPLES;
    const i = Math.floor(progress) % TOTAL_SAMPLES;
    const next = (i + 1) % TOTAL_SAMPLES;
    const t = progress - Math.floor(progress);
    return PY[i] + (PY[next] - PY[i]) * t;
  });

  // Main orb (pulsing)
  const orbProps = useAnimatedProps(() => ({
    cx: orbX.value,
    cy: orbY.value,
    r: 5 * orbPulse.value,
  }));

  // Glow ring positions
  const glowProps = useAnimatedProps(() => ({
    cx: orbX.value,
    cy: orbY.value,
  }));

  return (
    <View
      className="items-center justify-center"
      style={{ width: svgWidth, height: svgHeight }}
    >
      <Svg width={svgWidth} height={svgHeight} viewBox="-30 -4 124 88">
        <Defs>
          {/* Path gradient — subtle, semi-transparent */}
          <LinearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop
              offset="0%"
              stopColor={colors.primary.pink}
              stopOpacity={0.2}
            />
            <Stop
              offset="50%"
              stopColor={colors.accent.yellow}
              stopOpacity={0.6}
            />
            <Stop
              offset="100%"
              stopColor={colors.primary.pink}
              stopOpacity={0.2}
            />
          </LinearGradient>
        </Defs>

        {/* Infinity path stroke */}
        <Path
          d={INFINITY_PATH}
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Orb outer glow */}
        <AnimatedCircle
          r={14}
          fill="rgba(255,255,255,0.08)"
          animatedProps={glowProps}
        />

        {/* Orb inner glow */}
        <AnimatedCircle
          r={9}
          fill="rgba(236,72,153,0.25)"
          animatedProps={glowProps}
        />

        {/* Breathing orb — solid white */}
        <AnimatedCircle fill="white" animatedProps={orbProps} />
      </Svg>
    </View>
  );
}
