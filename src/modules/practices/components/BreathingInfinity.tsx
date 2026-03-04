import { colors } from '@/constants/colors';
import { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// The infinity/lemniscate SVG path from the design
// viewBox is "-25 0 115 80" — the path spans roughly x: -16..80, y: 10..70
const INFINITY_PATH =
  'M32 40 C32 10, 80 10, 80 40 C80 70, 32 70, 32 40 C32 10, -16 10, -16 40 C-16 70, 32 70, 32 40';

// Bezier segment control points: [startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY]
// Segment 1 (right-top):    M32,40 -> C32,10 80,10 80,40   (inhale half 1)
// Segment 2 (right-bottom): 80,40  -> C80,70 32,70 32,40   (inhale half 2)
// Segment 3 (left-top):     32,40  -> C32,10 -16,10 -16,40 (exhale half 1)
// Segment 4 (left-bottom):  -16,40 -> C-16,70 32,70 32,40  (exhale half 2)
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

// Duration for one full orbit: 8 seconds (4s inhale right loop + 4s exhale left loop)
const ORBIT_DURATION = 8000;
const TOTAL_ORBITS = 100;

interface BreathingInfinityProps {
  isPaused?: boolean;
}

export function BreathingInfinity({ isPaused }: BreathingInfinityProps) {
  const { width: screenWidth } = useWindowDimensions();
  const svgWidth = Math.min(screenWidth - 48, 400);
  const svgHeight = svgWidth * 0.5; // 2:1 aspect ratio per design

  const orbitProgress = useSharedValue(0);
  const orbPulse = useSharedValue(1);

  useEffect(() => {
    if (isPaused) return;

    orbitProgress.value = withTiming(TOTAL_ORBITS, {
      duration: ORBIT_DURATION * TOTAL_ORBITS,
      easing: Easing.linear,
    });
    orbPulse.value = withRepeat(
      withTiming(1.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [isPaused, orbitProgress, orbPulse]);

  const orbX = useDerivedValue(() => {
    'worklet';
    const progress = (orbitProgress.value % 1) * TOTAL_SAMPLES;
    const i = Math.floor(progress) % TOTAL_SAMPLES;
    const next = (i + 1) % TOTAL_SAMPLES;
    const t = progress - Math.floor(progress);
    return PX[i] + (PX[next] - PX[i]) * t;
  });

  const orbY = useDerivedValue(() => {
    'worklet';
    const progress = (orbitProgress.value % 1) * TOTAL_SAMPLES;
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

  // Outer glow ring
  const glowOuterProps = useAnimatedProps(() => ({
    cx: orbX.value,
    cy: orbY.value,
  }));

  // Inner glow ring
  const glowMidProps = useAnimatedProps(() => ({
    cx: orbX.value,
    cy: orbY.value,
  }));

  return (
    <View
      className="items-center justify-center"
      style={{ width: svgWidth, height: svgHeight }}
    >
      <Svg width={svgWidth} height={svgHeight} viewBox="-25 0 115 80">
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

          {/* Orb fill gradient — yellow center to pink edge */}
          <RadialGradient id="orbFill" cx="50%" cy="50%" r="50%">
            <Stop
              offset="0%"
              stopColor={colors.accent['yellow-light']}
              stopOpacity={1}
            />
            <Stop
              offset="100%"
              stopColor={colors.primary.pink}
              stopOpacity={1}
            />
          </RadialGradient>
        </Defs>

        {/* Infinity path stroke */}
        <Path
          d={INFINITY_PATH}
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Outermost orb glow */}
        <AnimatedCircle
          r={16}
          fill="rgba(244,63,94,0.12)"
          animatedProps={glowOuterProps}
        />

        {/* Mid orb glow */}
        <AnimatedCircle
          r={10}
          fill="rgba(250,204,21,0.18)"
          animatedProps={glowMidProps}
        />

        {/* Breathing orb — bright gradient center */}
        <AnimatedCircle fill="url(#orbFill)" animatedProps={orbProps} />
      </Svg>
    </View>
  );
}
