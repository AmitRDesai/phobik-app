import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
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

import { muscleRelaxationSessionAtom } from '../store/muscle-relaxation';

// ── Constants ────────────────────────────────────────────────────────────────

const WAIT_DURATION = 10; // seconds of hold after each audio

interface MuscleGroup {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  instruction: string;
  audio: number;
  audioDuration: number;
  /** SVG glow position: [cx, cy] in the 200x400 viewBox */
  glowPosition: [number, number];
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    id: 'face',
    label: 'Face',
    icon: 'face',
    instruction: 'Squeeze your eyes shut and scrunch your face tightly.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/face.mp3'),
    audioDuration: 15,
    glowPosition: [100, 40],
  },
  {
    id: 'neck',
    label: 'Neck',
    icon: 'accessibility-new',
    instruction: 'Tilt your head back and tense your neck muscles.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/neck.mp3'),
    audioDuration: 9,
    glowPosition: [100, 55],
  },
  {
    id: 'chest',
    label: 'Chest',
    icon: 'favorite',
    instruction: 'Take a deep breath and tighten your chest muscles.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/chest.mp3'),
    audioDuration: 9,
    glowPosition: [100, 100],
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    icon: 'accessibility-new',
    instruction:
      'Pull your shoulders up toward your ears as tightly as you can.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/shoulders.mp3'),
    audioDuration: 12,
    glowPosition: [100, 75],
  },
  {
    id: 'upper-back',
    label: 'Upper Back',
    icon: 'airline-seat-flat',
    instruction:
      'Push your shoulder blades together and tense your upper back.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/upper-back.mp3'),
    audioDuration: 3,
    glowPosition: [100, 110],
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    icon: 'self-improvement',
    instruction: 'Tighten your abdominal muscles as hard as you can.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/abdomen.mp3'),
    audioDuration: 3,
    glowPosition: [100, 145],
  },
  {
    id: 'hands-and-arms',
    label: 'Hands & Arms',
    icon: 'back-hand',
    instruction: 'Make tight fists and tense your arms.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/hands-and-arms.mp3'),
    audioDuration: 18,
    glowPosition: [50, 165],
  },
  {
    id: 'right-leg',
    label: 'Right Leg',
    icon: 'directions-walk',
    instruction: 'Tense your right thigh, calf, and foot.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/right-leg.mp3'),
    audioDuration: 14,
    glowPosition: [120, 280],
  },
  {
    id: 'left-leg',
    label: 'Left Leg',
    icon: 'directions-walk',
    instruction: 'Tense your left thigh, calf, and foot.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/left-leg.mp3'),
    audioDuration: 18,
    glowPosition: [80, 280],
  },
  {
    id: 'feet',
    label: 'Feet',
    icon: 'do-not-step',
    instruction: 'Curl your toes tightly and tense your feet.',
    audio: require('@/assets/audio/practices/muscle-relaxation-session/feet.mp3'),
    audioDuration: 7,
    glowPosition: [100, 370],
  },
];

const TOTAL_DURATION = MUSCLE_GROUPS.reduce(
  (sum, g) => sum + g.audioDuration + WAIT_DURATION,
  0,
);

type StepPhase = 'audio' | 'wait';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ── Body Silhouette Component ────────────────────────────────────────────────

function BodySilhouette({ activeGlow }: { activeGlow: [number, number] }) {
  const glowOpacity = useSharedValue(0.08);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
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

        {/* Active muscle group glow */}
        <Circle
          cx={activeGlow[0]}
          cy={activeGlow[1]}
          r={25}
          fill={colors.primary.pink}
          fillOpacity={0.15}
        />
        {/* Side glow circles for shoulder-like areas */}
        {activeGlow[1] < 100 && activeGlow[1] > 60 && (
          <>
            <Circle
              cx={activeGlow[0] - 25}
              cy={activeGlow[1] + 10}
              r={12}
              fill={colors.primary.pink}
              fillOpacity={0.1}
            />
            <Circle
              cx={activeGlow[0] + 25}
              cy={activeGlow[1] + 10}
              r={12}
              fill={colors.primary.pink}
              fillOpacity={0.1}
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
  const navigation = useNavigation();
  const savedState = useAtomValue(muscleRelaxationSessionAtom);
  const setSession = useSetAtom(muscleRelaxationSessionAtom);

  const initialStepRef = useRef(savedState?.currentStepIndex ?? 0);

  // Compute elapsed time for all completed steps (audio + wait for each)
  const initialElapsed = MUSCLE_GROUPS.slice(0, initialStepRef.current).reduce(
    (sum, g) => sum + g.audioDuration + WAIT_DURATION,
    0,
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialStepRef.current,
  );
  const [stepPhase, setStepPhase] = useState<StepPhase>('audio');
  const [waitTimeRemaining, setWaitTimeRemaining] = useState(WAIT_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTotal, setElapsedTotal] = useState(initialElapsed);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioElapsedRef = useRef(0);
  const scrollRef = useRef<ScrollView>(null);

  const currentGroup = MUSCLE_GROUPS[currentStepIndex];
  const overallProgress = Math.min(elapsedTotal / TOTAL_DURATION, 1);

  // Animated progress bar
  const animatedProgress = useSharedValue(overallProgress);
  useEffect(() => {
    animatedProgress.value = withTiming(overallProgress, {
      duration: 1000,
      easing: Easing.linear,
    });
  }, [overallProgress, animatedProgress]);
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));
  const timeRemaining = Math.max(TOTAL_DURATION - elapsedTotal, 0);

  // Audio player — start with the correct step's audio
  const player = useAudioPlayer(MUSCLE_GROUPS[initialStepRef.current].audio);

  // Start audio on mount
  useEffect(() => {
    player.play();
  }, [player]);

  // Switch audio when step changes
  const prevStepRef = useRef(initialStepRef.current);
  useEffect(() => {
    if (prevStepRef.current !== currentStepIndex) {
      prevStepRef.current = currentStepIndex;
      player.replace(MUSCLE_GROUPS[currentStepIndex].audio);
      player.play();
    }
  }, [currentStepIndex, player]);

  // Audio phase countdown — ticks each second, transitions to wait when audio duration elapsed
  useEffect(() => {
    if (stepPhase !== 'audio' || isPaused) return;

    phaseIntervalRef.current = setInterval(() => {
      audioElapsedRef.current += 1;
      if (audioElapsedRef.current >= currentGroup.audioDuration) {
        clearInterval(phaseIntervalRef.current!);
        setStepPhase('wait');
        setWaitTimeRemaining(WAIT_DURATION);
      }
    }, 1000);

    return () => {
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    };
  }, [stepPhase, isPaused, currentGroup.audioDuration]);

  // Wait countdown
  useEffect(() => {
    if (stepPhase !== 'wait' || isPaused) return;

    phaseIntervalRef.current = setInterval(() => {
      setWaitTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(phaseIntervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    };
  }, [stepPhase, isPaused]);

  // Advance step when wait finishes
  useEffect(() => {
    if (stepPhase === 'wait' && waitTimeRemaining === 0) {
      if (currentStepIndex < MUSCLE_GROUPS.length - 1) {
        audioElapsedRef.current = 0;
        setCurrentStepIndex((prev) => prev + 1);
        setStepPhase('audio');
        setWaitTimeRemaining(WAIT_DURATION);
      }
    }
  }, [stepPhase, waitTimeRemaining, currentStepIndex]);

  // Save state on back navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (timeRemaining > 0) {
        setSession({ currentStepIndex });
      }
    });
    return unsubscribe;
  }, [currentStepIndex, timeRemaining, navigation, setSession]);

  // Completion — last step wait finishes
  useEffect(() => {
    if (
      stepPhase === 'wait' &&
      waitTimeRemaining === 0 &&
      currentStepIndex === MUSCLE_GROUPS.length - 1
    ) {
      setSession(null);
      router.replace('/practices/completion');
    }
  }, [stepPhase, waitTimeRemaining, currentStepIndex, router, setSession]);

  // Elapsed counter
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setElapsedTotal((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  // Sync audio with pause state
  useEffect(() => {
    if (stepPhase !== 'audio') return;
    if (isPaused) {
      player.pause();
    } else {
      player.play();
    }
  }, [isPaused, player, stepPhase]);

  // Auto-scroll to active muscle group
  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: currentStepIndex * 86 - 120,
      animated: true,
    });
  }, [currentStepIndex]);

  const instructionText =
    stepPhase === 'audio'
      ? currentGroup.instruction
      : `Hold and relax for ${waitTimeRemaining}s`;

  const phaseLabel =
    stepPhase === 'audio' ? 'Listen to the instructions...' : 'Hold and relax';

  return (
    <Container safeAreaClass="bg-background-dark">
      <View className="flex-1 bg-background-dark">
        <GlowBg
          bgClassName="bg-background-dark"
          centerX={0.5}
          centerY={0.35}
          intensity={stepPhase === 'audio' ? 0.15 : 0.25}
          radius={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-20 flex-row items-center justify-between px-4 py-3">
          <BackButton icon="close" />

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

          <View className="h-10 w-10" />
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
            {instructionText}
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
              if (index < currentStepIndex) {
                state = 'completed';
              } else if (index === currentStepIndex) {
                state = 'active';
              } else {
                state = 'upcoming';
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
              <Animated.View style={[{ height: '100%' }, progressBarStyle]}>
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 99,
                    shadowColor: colors.primary.pink,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                  }}
                />
              </Animated.View>
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
