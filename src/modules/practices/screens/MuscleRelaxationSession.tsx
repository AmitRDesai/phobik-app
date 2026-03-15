import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

// ── Constants ────────────────────────────────────────────────────────────────

const TOTAL_DURATION = 15 * 60; // 15 minutes = 900 seconds

const TENSE_DURATION = 5; // seconds
const RELEASE_DURATION = 10; // seconds
const PHASE_CYCLE = TENSE_DURATION + RELEASE_DURATION; // 15 seconds per muscle group cycle

type MusclePhase = 'tense' | 'release';

interface MuscleGroup {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  tenseInstruction: string;
  releaseInstruction: string;
  /** SVG glow position: [cx, cy] in the 200x400 viewBox */
  glowPosition: [number, number];
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    id: 'feet',
    label: 'Feet',
    icon: 'do-not-step',
    tenseInstruction: 'Curl your toes tightly and tense your feet.',
    releaseInstruction: 'Release and let your feet go completely limp.',
    glowPosition: [100, 370],
  },
  {
    id: 'calves',
    label: 'Calves',
    icon: 'directions-walk',
    tenseInstruction: 'Tighten your calf muscles as hard as you can.',
    releaseInstruction: 'Release and feel the tension melt from your calves.',
    glowPosition: [100, 300],
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    icon: 'accessibility-new',
    tenseInstruction:
      'Pull your shoulders up toward your ears as tightly as you can.',
    releaseInstruction: 'Drop your shoulders down and let them relax.',
    glowPosition: [100, 75],
  },
  {
    id: 'hands',
    label: 'Hands',
    icon: 'back-hand',
    tenseInstruction: 'Make tight fists with both hands.',
    releaseInstruction: 'Open your hands and let them relax completely.',
    glowPosition: [50, 165],
  },
  {
    id: 'face',
    label: 'Face',
    icon: 'face',
    tenseInstruction: 'Squeeze your eyes shut and scrunch your face tightly.',
    releaseInstruction: 'Relax all your facial muscles and let your jaw drop.',
    glowPosition: [100, 40],
  },
];

// Each muscle group gets one full tense+release cycle (15s).
const TOTAL_CYCLES = Math.ceil(TOTAL_DURATION / PHASE_CYCLE);

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ── Body Silhouette Component ────────────────────────────────────────────────

function BodySilhouette({ activeGlow }: { activeGlow: [number, number] }) {
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [glowOpacity]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View className="h-[340px] w-full items-center justify-center">
      <Svg
        width={160}
        height={340}
        viewBox="0 0 200 400"
        fill="none"
        strokeWidth={1.5}
        stroke="rgba(255,255,255,0.2)"
      >
        {/* Head */}
        <Circle cx={100} cy={40} r={25} />
        {/* Torso */}
        <Path d="M75,65 Q100,65 125,65 L130,180 Q100,190 70,180 Z" />
        {/* Left arm */}
        <Path d="M75,70 L40,150 Q35,160 45,165" />
        {/* Right arm */}
        <Path d="M125,70 L160,150 Q165,160 155,165" />
        {/* Left leg */}
        <Path d="M80,185 L70,360 Q70,375 90,375" />
        {/* Right leg */}
        <Path d="M120,185 L130,360 Q130,375 110,375" />

        {/* Active muscle group glow layers */}
        <Circle
          cx={activeGlow[0]}
          cy={activeGlow[1]}
          r={45}
          fill={colors.accent.yellow}
          fillOpacity={0.15}
        />
        <Circle
          cx={activeGlow[0]}
          cy={activeGlow[1]}
          r={25}
          fill={colors.primary.pink}
          fillOpacity={0.3}
        />
        {/* Side glow circles for shoulder-like areas */}
        {activeGlow[1] < 100 && activeGlow[1] > 60 && (
          <>
            <Circle
              cx={activeGlow[0] - 25}
              cy={activeGlow[1] + 10}
              r={12}
              fill={colors.primary.pink}
              fillOpacity={0.2}
            />
            <Circle
              cx={activeGlow[0] + 25}
              cy={activeGlow[1] + 10}
              r={12}
              fill={colors.primary.pink}
              fillOpacity={0.2}
            />
          </>
        )}
      </Svg>

      {/* Animated outer glow overlay */}
      <Animated.View
        className="absolute"
        style={[
          animatedGlowStyle,
          {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.primary.pink,
            top: (activeGlow[1] / 400) * 340 - 50,
            left: '50%',
            marginLeft: ((activeGlow[0] - 100) / 200) * 160 - 50,
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 35,
          },
        ]}
      />
    </View>
  );
}

// ── Biometric Badge Component ────────────────────────────────────────────────

function BiometricBadge({
  icon,
  iconColor,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <View className="items-center rounded-2xl border border-white/10 bg-white/5 p-3">
      <MaterialIcons name={icon} size={14} color={iconColor} />
      <Text className="mt-1 text-[10px] text-white/40">{label}</Text>
      <Text className="text-xs font-bold" style={{ color: valueColor }}>
        {value}
      </Text>
    </View>
  );
}

// ── Muscle Group Step Indicator ──────────────────────────────────────────────

function MuscleGroupStep({
  group,
  state,
}: {
  group: MuscleGroup;
  state: 'completed' | 'active' | 'upcoming';
}) {
  return (
    <View className="items-center gap-2" style={{ minWidth: 70 }}>
      {state === 'active' ? (
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          }}
        >
          <MaterialIcons
            name={group.icon}
            size={24}
            color={colors.background.dark}
          />
        </LinearGradient>
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <MaterialIcons
            name={state === 'completed' ? 'check-circle' : group.icon}
            size={24}
            color={
              state === 'completed'
                ? 'rgba(244,63,94,0.5)'
                : 'rgba(255,255,255,0.2)'
            }
          />
        </View>
      )}
      <Text
        className={`text-[10px] ${
          state === 'active'
            ? 'font-bold text-primary-pink'
            : 'font-medium text-white/30'
        }`}
      >
        {group.label}
      </Text>
    </View>
  );
}

// ── Main Session Screen ──────────────────────────────────────────────────────

export default function MuscleRelaxationSession() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const elapsed = TOTAL_DURATION - timeRemaining;
  const overallProgress = elapsed / TOTAL_DURATION;

  // Determine current muscle group and phase
  const currentCycleIndex = Math.min(
    Math.floor(elapsed / PHASE_CYCLE),
    TOTAL_CYCLES - 1,
  );
  const currentGroupIndex = currentCycleIndex % MUSCLE_GROUPS.length;
  const cycleElapsed = elapsed % PHASE_CYCLE;
  const currentPhase: MusclePhase =
    cycleElapsed < TENSE_DURATION ? 'tense' : 'release';
  const currentGroup = MUSCLE_GROUPS[currentGroupIndex];

  // Phase countdown within the current tense or release phase
  const phaseTimeRemaining =
    currentPhase === 'tense'
      ? TENSE_DURATION - cycleElapsed
      : RELEASE_DURATION - (cycleElapsed - TENSE_DURATION);

  const handleComplete = useCallback(() => {
    router.replace('/practices/completion');
  }, [router]);

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

  // Auto-scroll to active muscle group
  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: currentGroupIndex * 86 - 120,
      animated: true,
    });
  }, [currentGroupIndex]);

  const phaseInstruction =
    currentPhase === 'tense'
      ? currentGroup.tenseInstruction
      : currentGroup.releaseInstruction;

  const phaseLabel =
    currentPhase === 'tense'
      ? `Tense your ${currentGroup.label.toLowerCase()}...`
      : 'Release and relax';

  return (
    <Container safeAreaClass="bg-background-dark">
      <View className="flex-1 bg-background-dark">
        <GlowBg
          bgClassName="bg-background-dark"
          centerX={0.5}
          centerY={0.35}
          intensity={0.6}
          radius={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-20 flex-row items-center justify-between px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
          >
            <MaterialIcons name="close" size={22} color={alpha.white70} />
          </Pressable>

          {/* Center title + HRV badge */}
          <View className="items-center">
            <Text className="text-sm font-bold tracking-tight text-white/90">
              Muscle Relaxation
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1.5">
              <View
                className="h-1.5 w-1.5 rounded-full bg-primary-pink"
                style={{
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                }}
              />
              <Text className="text-[10px] font-medium uppercase tracking-wider text-primary-pink">
                HRV Live: 74ms
              </Text>
            </View>
          </View>

          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/5 active:bg-white/10">
            <MaterialIcons name="graphic-eq" size={22} color={alpha.white70} />
          </Pressable>
        </View>

        {/* Body visualization area */}
        <View className="z-10 flex-1 items-center justify-center">
          {/* Biometric badges - positioned on the left */}
          <View className="absolute left-4 top-1/2 z-20 -translate-y-1/2 gap-4">
            <BiometricBadge
              icon="monitor-heart"
              iconColor={colors.accent.yellow}
              label="Stress"
              value="Low"
              valueColor={colors.accent.yellow}
            />
            <BiometricBadge
              icon="air"
              iconColor={colors.primary.pink}
              label="Breath"
              value="Stable"
              valueColor={colors.primary.pink}
            />
          </View>

          {/* Body silhouette */}
          <BodySilhouette activeGlow={currentGroup.glowPosition} />
        </View>

        {/* Instruction area — fixed height to prevent layout shifts */}
        <View
          className="z-20 items-center px-6 pb-4"
          style={{ minHeight: 150 }}
        >
          {/* Active focus badge — fixed width to prevent width jumps */}
          <View
            className="mb-4 flex-row items-center justify-center gap-2 rounded-full border border-primary-pink/20 bg-primary-pink/10 py-1"
            style={{ minWidth: 200, paddingHorizontal: 12 }}
          >
            <View
              className="h-2 w-2 rounded-full bg-primary-pink"
              style={{
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 8,
              }}
            />
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
              Active Focus: {currentGroup.label}
            </Text>
          </View>

          {/* Phase title */}
          <Text className="mb-2 text-center text-2xl font-bold leading-tight text-white">
            {phaseLabel}
          </Text>

          {/* Phase instruction */}
          <Text
            className="px-10 text-center text-sm leading-relaxed text-white/50"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {phaseInstruction} Hold for {Math.ceil(phaseTimeRemaining)} seconds.
          </Text>
        </View>

        {/* Muscle group step navigator */}
        <View className="z-20 pb-4 pt-2">
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-6 gap-4 pb-2"
          >
            {MUSCLE_GROUPS.map((group, index) => {
              let state: 'completed' | 'active' | 'upcoming';
              if (index < currentGroupIndex) {
                state = 'completed';
              } else if (index === currentGroupIndex) {
                state = 'active';
              } else {
                state = 'upcoming';
              }
              // If we've cycled past all groups, earlier groups may also be completed
              if (
                currentCycleIndex >= MUSCLE_GROUPS.length &&
                index <= currentGroupIndex
              ) {
                state = index === currentGroupIndex ? 'active' : 'completed';
              }
              return (
                <MuscleGroupStep key={group.id} group={group} state={state} />
              );
            })}
          </ScrollView>
        </View>

        {/* Bottom controls: pause + progress bar + timer */}
        <View className="z-20 px-6 pb-12 pt-4">
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => setIsPaused((p) => !p)}
              className="h-14 w-14 items-center justify-center rounded-2xl bg-white/5 active:scale-95"
            >
              <MaterialIcons
                name={isPaused ? 'play-arrow' : 'pause'}
                size={24}
                color="white"
              />
            </Pressable>
            <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: '100%',
                  width: `${overallProgress * 100}%`,
                  borderRadius: 99,
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                }}
              />
            </View>
            <Text
              className="text-xs text-white/40"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatTime(timeRemaining)}
            </Text>
          </View>
        </View>
      </View>
    </Container>
  );
}
