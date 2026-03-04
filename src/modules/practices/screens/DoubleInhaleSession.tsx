import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

// Double inhale pattern: short inhale 2s, second inhale 2s, long exhale 6s
const BREATHING_PHASES = [
  'Deep Inhale',
  'Second Inhale',
  'Long Exhale',
] as const;
const PHASE_DURATIONS = [2, 2, 6]; // seconds per phase
const PHASE_TOTAL = PHASE_DURATIONS.reduce((a, b) => a + b, 0); // 10s cycle

const TOTAL_DURATION = 2 * 60; // 2 minutes

const PHASE_STEPS = [
  { label: 'Expanding Lungs', step: 1 },
  { label: 'Filling Completely', step: 2 },
  { label: 'Releasing Tension', step: 3 },
] as const;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function DoubleInhaleSession() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = TOTAL_DURATION - timeRemaining;

  // Breathing phase calculation
  const cyclePosition = elapsed % PHASE_TOTAL;
  let accumulated = 0;
  let currentPhaseIndex = 0;
  for (let i = 0; i < PHASE_DURATIONS.length; i++) {
    accumulated += PHASE_DURATIONS[i];
    if (cyclePosition < accumulated) {
      currentPhaseIndex = i;
      break;
    }
  }
  const currentPhase = BREATHING_PHASES[currentPhaseIndex];
  const currentStep = PHASE_STEPS[currentPhaseIndex];

  // Animated values for breathing visualization
  const breathScale = useSharedValue(1);
  const pulse1Opacity = useSharedValue(0.2);
  const pulse2Opacity = useSharedValue(0.1);

  useEffect(() => {
    if (isPaused) return;

    // Breathing animation: inhale -> second inhale -> exhale
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.15, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1.3, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );

    pulse1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    pulse2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.05, {
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );

    return () => {
      breathScale.value = 1;
    };
  }, [isPaused, breathScale, pulse1Opacity, pulse2Opacity]);

  const mainOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
  }));

  const pulse1Style = useAnimatedStyle(() => ({
    opacity: pulse1Opacity.value,
    transform: [{ scale: breathScale.value * 1.1 }],
  }));

  const pulse2Style = useAnimatedStyle(() => ({
    opacity: pulse2Opacity.value,
    transform: [{ scale: breathScale.value * 1.2 }],
  }));

  const handleComplete = useCallback(() => {
    router.replace('/practices/completion');
  }, [router]);

  // Skip forward/backward 10 seconds
  const handleSkipBack = useCallback(() => {
    setTimeRemaining((prev) => Math.min(prev + 10, TOTAL_DURATION));
  }, []);

  const handleSkipForward = useCallback(() => {
    setTimeRemaining((prev) => {
      if (prev <= 10) {
        handleComplete();
        return 0;
      }
      return prev - 10;
    });
  }, [handleComplete]);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, handleComplete]);

  return (
    <Container safeAreaClass="bg-background-dark">
      <View className="flex-1 bg-background-dark">
        <GlowBg
          bgClassName="bg-background-dark"
          centerX={0.5}
          centerY={0.35}
          intensity={0.6}
          radius={0.35}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header: Close / Timer Pill / Settings */}
        <View className="z-20 flex-row items-center justify-between px-6 pb-4 pt-3.5">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
          >
            <MaterialIcons name="close" size={20} color="white" />
          </Pressable>

          {/* Timer pill */}
          <View className="rounded-full border border-white/10 bg-white/5 px-4 py-1">
            <Text
              className="text-sm font-bold text-accent-yellow"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatTime(timeRemaining)}
            </Text>
          </View>

          <Pressable className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95">
            <MaterialIcons name="settings" size={20} color="white" />
          </Pressable>
        </View>

        {/* Breathing visualization + phase text */}
        <View className="z-10 flex-1 items-center justify-center">
          {/* Concentric rings container */}
          <View
            className="items-center justify-center"
            style={{ width: 300, height: 320 }}
          >
            {/* Outer pulse ring */}
            <Animated.View
              className="absolute items-center justify-center"
              style={[
                { width: 280, height: 280, borderRadius: 140 },
                pulse2Style,
              ]}
            >
              <Svg width={280} height={280}>
                <Defs>
                  <SvgLinearGradient
                    id="pulse2Grad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <Stop offset="0%" stopColor={colors.primary.pink} />
                    <Stop offset="100%" stopColor={colors.accent.yellow} />
                  </SvgLinearGradient>
                </Defs>
                <Circle
                  cx={140}
                  cy={140}
                  r={139}
                  fill="none"
                  stroke="url(#pulse2Grad)"
                  strokeWidth={1}
                />
              </Svg>
            </Animated.View>

            {/* Inner pulse ring */}
            <Animated.View
              className="absolute items-center justify-center"
              style={[
                { width: 220, height: 220, borderRadius: 110 },
                pulse1Style,
              ]}
            >
              <Svg width={220} height={220}>
                <Defs>
                  <SvgLinearGradient
                    id="pulse1Grad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <Stop offset="0%" stopColor={colors.primary.pink} />
                    <Stop offset="100%" stopColor={colors.accent.yellow} />
                  </SvgLinearGradient>
                </Defs>
                <Circle
                  cx={110}
                  cy={110}
                  r={109}
                  fill="none"
                  stroke="url(#pulse1Grad)"
                  strokeWidth={1}
                />
              </Svg>
            </Animated.View>

            {/* Decorative wave SVG overlay */}
            <View className="absolute inset-0 items-center justify-center opacity-30">
              <Svg width={300} height={300} viewBox="0 0 400 300">
                <Defs>
                  <SvgLinearGradient
                    id="waveGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <Stop offset="0%" stopColor={colors.primary.pink} />
                    <Stop offset="100%" stopColor={colors.accent.yellow} />
                  </SvgLinearGradient>
                </Defs>
                <Path
                  d="M50,150 Q100,80 150,150 T250,150 T350,150"
                  fill="none"
                  stroke="url(#waveGrad)"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            {/* Main breathing orb */}
            <Animated.View
              className="items-center justify-center"
              style={[
                {
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.25,
                  shadowRadius: 30,
                },
                mainOrbStyle,
              ]}
            >
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="air" size={48} color="white" />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Phase text + progress indicators — fixed height to prevent layout shifts */}
          <View
            className="mt-4 items-center gap-3 px-6"
            style={{ minHeight: 140 }}
          >
            <Text className="text-center text-5xl font-bold tracking-tight text-white">
              {currentPhase}
            </Text>
            <View className="items-center gap-4">
              {/* Phase progress bars */}
              <View className="flex-row items-center justify-center gap-1.5">
                {PHASE_DURATIONS.map((duration, i) => (
                  <View
                    key={i}
                    className={`h-1.5 rounded-full ${
                      i === currentPhaseIndex
                        ? 'bg-primary-pink'
                        : 'bg-white/10'
                    }`}
                    style={[
                      { width: duration === 6 ? 56 : duration === 2 ? 40 : 24 },
                      i === currentPhaseIndex && {
                        shadowColor: colors.primary.pink,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 4,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text className="text-sm font-bold uppercase tracking-widest text-primary-pink">
                Step {currentStep.step} of 3: {currentStep.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Glass instruction card */}
        <View className="z-20 px-6 pb-6">
          <View className="rounded-3xl border border-white/10 bg-[#0a0a0a]/80 p-5">
            <View className="flex-row items-start gap-4">
              <View className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-pink/10">
                <MaterialIcons
                  name="record-voice-over"
                  size={18}
                  color={colors.primary.pink}
                />
              </View>
              <Text className="flex-1 text-base font-medium leading-relaxed text-white/80">
                Take two quick inhales through your nose, then one long exhale
                through your mouth.
              </Text>
            </View>
          </View>
        </View>

        {/* Playback controls: rewind / pause / forward */}
        <View className="z-20 flex-row items-center justify-center gap-10 px-6 pb-10">
          <Pressable
            onPress={handleSkipBack}
            className="h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 active:opacity-70"
          >
            <MaterialIcons
              name="replay-10"
              size={24}
              color="rgba(255,255,255,0.5)"
            />
          </Pressable>

          <Pressable
            onPress={() => setIsPaused((p) => !p)}
            className="h-20 w-20 items-center justify-center rounded-full bg-white active:scale-95"
            style={{
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
            }}
          >
            <MaterialIcons
              name={isPaused ? 'play-arrow' : 'pause'}
              size={36}
              color={colors.background.dark}
            />
          </Pressable>

          <Pressable
            onPress={handleSkipForward}
            className="h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 active:opacity-70"
          >
            <MaterialIcons
              name="forward-10"
              size={24}
              color="rgba(255,255,255,0.5)"
            />
          </Pressable>
        </View>
      </View>
    </Container>
  );
}
