import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { useAnimatedTiming } from '@/hooks/useAnimatedTiming';
import { useNow } from '@/hooks/useNow';
import { usePulseAnimation } from '@/hooks/usePulseAnimation';
import { useScheme } from '@/hooks/useTheme';
import { useStreamedAudioPlayer } from '@/lib/audio/useStreamedAudioPlayer';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { useStressScore } from '@/modules/home/hooks/useStressScore';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import { formatTime } from '../lib/format';
import { muscleRelaxationSessionAtom } from '../store/muscle-relaxation';

// ── Constants ────────────────────────────────────────────────────────────────

const WAIT_DURATION = 10; // seconds of hold after each audio

interface MuscleGroup {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  instruction: string;
  audioKey: string;
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
    audioKey: 'muscle-relaxation-face',
    audioDuration: 15,
    glowPosition: [100, 40],
  },
  {
    id: 'neck',
    label: 'Neck',
    icon: 'accessibility-new',
    instruction: 'Tilt your head back and tense your neck muscles.',
    audioKey: 'muscle-relaxation-neck',
    audioDuration: 9,
    glowPosition: [100, 55],
  },
  {
    id: 'chest',
    label: 'Chest',
    icon: 'favorite',
    instruction: 'Take a deep breath and tighten your chest muscles.',
    audioKey: 'muscle-relaxation-chest',
    audioDuration: 9,
    glowPosition: [100, 100],
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    icon: 'accessibility-new',
    instruction:
      'Pull your shoulders up toward your ears as tightly as you can.',
    audioKey: 'muscle-relaxation-shoulders',
    audioDuration: 12,
    glowPosition: [100, 75],
  },
  {
    id: 'upper-back',
    label: 'Upper Back',
    icon: 'airline-seat-flat',
    instruction:
      'Push your shoulder blades together and tense your upper back.',
    audioKey: 'muscle-relaxation-upper-back',
    audioDuration: 3,
    glowPosition: [100, 110],
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    icon: 'self-improvement',
    instruction: 'Tighten your abdominal muscles as hard as you can.',
    audioKey: 'muscle-relaxation-abdomen',
    audioDuration: 3,
    glowPosition: [100, 145],
  },
  {
    id: 'hands-and-arms',
    label: 'Hands & Arms',
    icon: 'back-hand',
    instruction: 'Make tight fists and tense your arms.',
    audioKey: 'muscle-relaxation-hands-and-arms',
    audioDuration: 18,
    glowPosition: [50, 165],
  },
  {
    id: 'right-leg',
    label: 'Right Leg',
    icon: 'directions-walk',
    instruction: 'Tense your right thigh, calf, and foot.',
    audioKey: 'muscle-relaxation-right-leg',
    audioDuration: 14,
    glowPosition: [120, 280],
  },
  {
    id: 'left-leg',
    label: 'Left Leg',
    icon: 'directions-walk',
    instruction: 'Tense your left thigh, calf, and foot.',
    audioKey: 'muscle-relaxation-left-leg',
    audioDuration: 18,
    glowPosition: [80, 280],
  },
  {
    id: 'feet',
    label: 'Feet',
    icon: 'do-not-step',
    instruction: 'Curl your toes tightly and tense your feet.',
    audioKey: 'muscle-relaxation-feet',
    audioDuration: 7,
    glowPosition: [100, 370],
  },
];

const TOTAL_DURATION = MUSCLE_GROUPS.reduce(
  (sum, g) => sum + g.audioDuration + WAIT_DURATION,
  0,
);

type StepPhase = 'audio' | 'wait';

type SessionState = {
  currentStepIndex: number;
  stepPhase: StepPhase;
  waitTimeRemaining: number;
};

type SessionAction =
  | { type: 'START_WAIT' }
  | { type: 'TICK_WAIT' }
  | { type: 'ADVANCE_STEP' };

function sessionReducer(
  state: SessionState,
  action: SessionAction,
): SessionState {
  switch (action.type) {
    case 'START_WAIT':
      return { ...state, stepPhase: 'wait', waitTimeRemaining: WAIT_DURATION };
    case 'TICK_WAIT':
      return { ...state, waitTimeRemaining: state.waitTimeRemaining - 1 };
    case 'ADVANCE_STEP':
      return {
        currentStepIndex: state.currentStepIndex + 1,
        stepPhase: 'audio',
        waitTimeRemaining: WAIT_DURATION,
      };
  }
}

// ── Body Silhouette Component ────────────────────────────────────────────────

function BodySilhouette({ activeGlow }: { activeGlow: [number, number] }) {
  const scheme = useScheme();
  const glowOpacity = usePulseAnimation({
    active: true,
    from: 0.08,
    to: 0.15,
    duration: 1200,
  });

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
        stroke={foregroundFor(scheme, 0.2)}
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
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 35,
                color: withAlpha(colors.primary.pink, 0.6),
              },
            ],
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
    <View className="items-center rounded-2xl border border-foreground/10 bg-foreground/5 p-3">
      <MaterialIcons name={icon} size={14} color={iconColor} />
      <Text size="xs" className="mt-1 text-foreground/40">
        {label}
      </Text>
      <Text size="xs" weight="bold" style={{ color: valueColor }}>
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
  const scheme = useScheme();
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
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 4,
                blurRadius: 12,
                color: withAlpha(colors.primary.pink, 0.3),
              },
            ],
          }}
        >
          <MaterialIcons name={group.icon} size={24} color="white" />
        </LinearGradient>
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/5">
          <MaterialIcons
            name={state === 'completed' ? 'check-circle' : group.icon}
            size={24}
            color={
              state === 'completed'
                ? withAlpha(colors.rose[500], 0.5)
                : foregroundFor(scheme, 0.2)
            }
          />
        </View>
      )}
      <Text
        size="xs"
        treatment="caption"
        className={
          state === 'active'
            ? 'font-bold text-primary-pink'
            : 'font-medium text-foreground/30'
        }
      >
        {group.label}
      </Text>
    </View>
  );
}

// ── Instruction Display Component ───────────────────────────────────────────

function InstructionDisplay({
  groupLabel,
  phaseLabel,
  instructionText,
}: {
  groupLabel: string;
  phaseLabel: string;
  instructionText: string;
}) {
  return (
    <View className="z-20 items-center px-6 pb-4" style={{ minHeight: 150 }}>
      {/* Active focus badge — fixed width to prevent width jumps */}
      <View
        className="mb-4 flex-row items-center justify-center gap-2 rounded-full border border-primary-pink/20 bg-primary-pink/10 py-1"
        style={{ minWidth: 200, paddingHorizontal: 12 }}
      >
        <View
          className="h-2 w-2 rounded-full bg-primary-pink"
          style={{
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 8,
                color: colors.primary.pink,
              },
            ],
          }}
        />
        <Text size="xs" treatment="caption" tone="accent" weight="bold">
          Active Focus: {groupLabel}
        </Text>
      </View>

      {/* Phase title */}
      <Text size="h2" align="center" className="mb-2 leading-tight">
        {phaseLabel}
      </Text>

      {/* Phase instruction */}
      <Text
        size="sm"
        align="center"
        className="px-10 leading-relaxed text-foreground/50"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {instructionText}
      </Text>
    </View>
  );
}

// ── Session Controls Component ──────────────────────────────────────────────

function SessionControls({
  isPaused,
  onPauseToggle,
  timeLabel,
  progressBarStyle,
}: {
  isPaused: boolean;
  onPauseToggle: () => void;
  timeLabel: string;
  progressBarStyle: object;
}) {
  const scheme = useScheme();
  return (
    <View className="z-20 px-6 pb-12 pt-4">
      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={onPauseToggle}
          className="h-14 w-14 items-center justify-center rounded-2xl bg-foreground/5 active:scale-95"
        >
          <MaterialIcons
            name={isPaused ? 'play-arrow' : 'pause'}
            size={24}
            color={foregroundFor(scheme, 0.7)}
          />
        </Pressable>
        <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
          <Animated.View style={[{ height: '100%' }, progressBarStyle]}>
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 99,
                boxShadow: [
                  {
                    offsetX: 0,
                    offsetY: 0,
                    blurRadius: 10,
                    color: withAlpha(colors.primary.pink, 0.4),
                  },
                ],
              }}
            />
          </Animated.View>
        </View>
        <Text
          size="sm"
          className="text-foreground/40"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {timeLabel}
        </Text>
      </View>
    </View>
  );
}

// ── Main Session Screen ──────────────────────────────────────────────────────

export default function MuscleRelaxationSession() {
  useKeepAwake();
  const router = useRouter();
  const savedState = useAtomValue(muscleRelaxationSessionAtom);
  const setSession = useSetAtom(muscleRelaxationSessionAtom);

  // Live biometrics for the header HRV badge + side stress badge.
  const { hrv, hrvAt, hasAccess } = useLatestBiometrics();
  const stress = useStressScore();
  const FRESH_MS = 30 * 60 * 1000;
  const now = useNow();
  const liveHrv =
    hrvAt != null && now - hrvAt.getTime() < FRESH_MS ? hrv : null;
  const isLive = hasAccess && liveHrv != null;
  const breathLabel = (() => {
    // Approximate from stress label — we do not poll respiratory rate here;
    // a higher stress state usually correlates with quicker breathing.
    if (stress.label === 'Stressed') return 'Quick';
    if (stress.label === 'Balanced') return 'Stable';
    if (stress.label === 'Calm') return 'Slow';
    return '—';
  })();

  const [initialStepIndex] = useState(() => savedState?.currentStepIndex ?? 0);
  // Compute elapsed time for all completed steps (audio + wait for each)
  const [initialElapsed] = useState(() =>
    MUSCLE_GROUPS.slice(0, initialStepIndex).reduce(
      (sum, g) => sum + g.audioDuration + WAIT_DURATION,
      0,
    ),
  );

  const [session, dispatch] = useReducer(sessionReducer, {
    currentStepIndex: initialStepIndex,
    stepPhase: 'audio',
    waitTimeRemaining: WAIT_DURATION,
  });
  const { currentStepIndex, stepPhase, waitTimeRemaining } = session;
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTotal, setElapsedTotal] = useState(initialElapsed);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioElapsedRef = useRef(0);
  const scrollRef = useRef<ScrollView>(null);

  const currentGroup = MUSCLE_GROUPS[currentStepIndex];
  const overallProgress = Math.min(elapsedTotal / TOTAL_DURATION, 1);

  // Animated progress bar
  const animatedProgress = useAnimatedTiming(overallProgress, {
    duration: 1000,
    easing: Easing.linear,
  });
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));
  const timeRemaining = Math.max(TOTAL_DURATION - elapsedTotal, 0);

  // Audio player — source resolves async per step (cached on disk).
  // `useStreamedAudioPlayer` handles `player.replace()` automatically when
  // the muscle group's `audioKey` changes.
  const { player, status: audioStatus } = useStreamedAudioPlayer(
    MUSCLE_GROUPS[currentStepIndex].audioKey,
  );

  // Play audio once the source finishes loading (handles both initial mount and step changes)
  useEffect(() => {
    if (
      audioStatus.isLoaded &&
      stepPhase === 'audio' &&
      !isPaused &&
      !audioStatus.playing
    ) {
      player.play();
    }
  }, [audioStatus.isLoaded, audioStatus.playing, stepPhase, isPaused, player]);

  // Audio phase countdown — ticks each second, transitions to wait when audio duration elapsed
  useEffect(() => {
    if (stepPhase !== 'audio' || isPaused) return;

    phaseIntervalRef.current = setInterval(() => {
      audioElapsedRef.current += 1;
      if (audioElapsedRef.current >= currentGroup.audioDuration) {
        clearInterval(phaseIntervalRef.current!);
        dispatch({ type: 'START_WAIT' });
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
      dispatch({ type: 'TICK_WAIT' });
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
        dispatch({ type: 'ADVANCE_STEP' });
      }
    }
  }, [stepPhase, waitTimeRemaining, currentStepIndex]);

  // Save state on back navigation
  useSaveOnLeave({
    save: () => setSession({ currentStepIndex }),
    canSave: timeRemaining > 0,
  });

  // Completion — last step wait finishes
  useEffect(() => {
    if (
      stepPhase === 'wait' &&
      waitTimeRemaining === 0 &&
      currentStepIndex === MUSCLE_GROUPS.length - 1
    ) {
      setSession(null);
      router.replace({
        pathname: '/practices/completion',
        params: {
          practiceType: 'muscle-relaxation',
          durationSeconds: String(elapsedTotal),
        },
      });
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
    } else if (audioStatus.isLoaded) {
      player.play();
    }
  }, [isPaused, player, stepPhase, audioStatus.isLoaded]);

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
    <Screen
      variant="default"
      header={
        <Header
          left={<BackButton icon="close" />}
          center={
            <View className="items-center">
              <Text size="sm" weight="bold" className="text-foreground/90">
                Muscle Relaxation
              </Text>
              <View className="mt-0.5 flex-row items-center gap-1.5">
                <View
                  className="h-1.5 w-1.5 rounded-full bg-primary-pink"
                  style={{
                    boxShadow: [
                      {
                        offsetX: 0,
                        offsetY: 0,
                        blurRadius: 8,
                        color: withAlpha(colors.primary.pink, 0.6),
                      },
                    ],
                  }}
                />
                <Text
                  size="xs"
                  treatment="caption"
                  tone="accent"
                  weight="medium"
                  className="tracking-wider"
                >
                  {isLive
                    ? `HRV Live: ${Math.round(liveHrv)}ms`
                    : hasAccess
                      ? 'HRV: No recent data'
                      : 'HRV: Not connected'}
                </Text>
              </View>
            </View>
          }
        />
      }
      className="flex-1"
    >
      {/* Body visualization area */}
      <View className="flex-1 items-center justify-center">
        {/* Biometric badges - positioned on the left */}
        <View className="absolute left-4 top-1/2 z-20 -translate-y-1/2 gap-4">
          <BiometricBadge
            icon="monitor-heart"
            iconColor={colors.accent.yellow}
            label="Stress"
            value={stress.label ?? '—'}
            valueColor={colors.accent.yellow}
          />
          <BiometricBadge
            icon="air"
            iconColor={colors.primary.pink}
            label="Breath"
            value={breathLabel}
            valueColor={colors.primary.pink}
          />
        </View>

        {/* Body silhouette */}
        <BodySilhouette activeGlow={currentGroup.glowPosition} />
      </View>

      {/* Instruction area */}
      <InstructionDisplay
        groupLabel={currentGroup.label}
        phaseLabel={phaseLabel}
        instructionText={instructionText}
      />

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
      <SessionControls
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused((p) => !p)}
        timeLabel={formatTime(timeRemaining)}
        progressBarStyle={progressBarStyle}
      />
    </Screen>
  );
}
