import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useDerivedValue,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
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

// All 10 vertices of the star path (5 outer tips + 5 inner points)
const VX = [100, 126, 190, 138, 158, 100, 42, 62, 10, 74];
const VY = [20, 80, 80, 118, 180, 142, 180, 118, 80, 80];
const NUM_VERTICES = VX.length;

// Duration for one full orbit around the star (ms)
const ORBIT_DURATION = 10000;

// Number of full orbits before the animation value needs to restart (~17 min at 10s/orbit)
const TOTAL_ORBITS = 100;

export function BreathingStar() {
  // Continuously increasing value (0→100) — no resets, no jumps
  const orbitProgress = useSharedValue(0);
  const orbPulse = useSharedValue(1);

  useEffect(() => {
    orbitProgress.value = withTiming(TOTAL_ORBITS, {
      duration: ORBIT_DURATION * TOTAL_ORBITS,
      easing: Easing.linear,
    });
    orbPulse.value = withRepeat(
      withTiming(1.5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [orbitProgress, orbPulse]);

  const orbX = useDerivedValue(() => {
    'worklet';
    const seg = (orbitProgress.value % 1) * NUM_VERTICES;
    const i = Math.floor(seg) % NUM_VERTICES;
    const next = (i + 1) % NUM_VERTICES;
    const t = seg - Math.floor(seg);
    return VX[i] + (VX[next] - VX[i]) * t;
  });

  const orbY = useDerivedValue(() => {
    'worklet';
    const seg = (orbitProgress.value % 1) * NUM_VERTICES;
    const i = Math.floor(seg) % NUM_VERTICES;
    const next = (i + 1) % NUM_VERTICES;
    const t = seg - Math.floor(seg);
    return VY[i] + (VY[next] - VY[i]) * t;
  });

  const orbProps = useAnimatedProps(() => ({
    cx: orbX.value,
    cy: orbY.value,
    r: 5 * orbPulse.value,
  }));

  const glowOuterProps = useAnimatedProps(() => ({
    cx: orbX.value,
    cy: orbY.value,
  }));

  const glowInnerProps = useAnimatedProps(() => ({
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
          stroke="rgba(255,255,255,0.1)"
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
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={0.5}
        />
        <Circle
          cx={100}
          cy={100}
          r={55}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={0.5}
        />
        {/* Orb outer glow */}
        <AnimatedCircle
          r={14}
          fill="rgba(255,255,255,0.08)"
          animatedProps={glowOuterProps}
        />
        {/* Orb inner glow */}
        <AnimatedCircle
          r={9}
          fill="rgba(236,72,153,0.25)"
          animatedProps={glowInnerProps}
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
            className="text-3xl font-bold tracking-tight text-white"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            72
          </Text>
        </View>
        <Text className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          BPM
        </Text>
      </View>
    </View>
  );
}
