import exhaleAudio from '@/assets/audio/practices/exhale.mp3';
import inhaleAudio from '@/assets/audio/practices/inhale.mp3';
import tibetanBowlAudio from '@/assets/audio/practices/tibetan-bowl.mp3';
import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { useManagedAudioPlayer } from '@/lib/audio/useManagedAudioPlayer';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
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
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

import { useInstructionAudio } from '../hooks/useInstructionAudio';
import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { doubleInhaleSessionAtom } from '../store/session-atoms';
import { formatTime } from '../lib/format';

// ── Extracted Presentational Components ─────────────────────────────────────

function InstructionCard() {
  return (
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
  );
}

function PlaybackControls({
  isPaused,
  onPauseToggle,
  isMuted,
  onMuteToggle,
  onRestart,
  sessionReady,
}: {
  isPaused: boolean;
  onPauseToggle: () => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  onRestart: () => void;
  sessionReady: boolean;
}) {
  return (
    <View className="z-20 flex-row items-center justify-between px-12 pb-10">
      {/* Mute button */}
      <Pressable
        onPress={onMuteToggle}
        className="h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] active:scale-90"
      >
        <MaterialIcons
          name={isMuted ? 'volume-off' : 'volume-up'}
          size={24}
          color={alpha.white60}
        />
      </Pressable>

      {/* Pause / Play button */}
      <Pressable
        onPress={onPauseToggle}
        className="h-20 w-20 items-center justify-center rounded-full bg-white active:scale-95"
        style={{
          boxShadow: [
            {
              offsetX: 0,
              offsetY: 0,
              blurRadius: 15,
              color: withAlpha(colors.primary.pink, 0.3),
            },
          ],
        }}
      >
        <MaterialIcons
          name={isPaused ? 'play-arrow' : 'pause'}
          size={36}
          color={colors.background.dark}
        />
      </Pressable>

      {/* Restart button */}
      <Pressable
        onPress={onRestart}
        className="h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] active:scale-90"
      >
        <MaterialIcons
          name={sessionReady ? 'replay' : 'skip-next'}
          size={24}
          color={alpha.white60}
        />
      </Pressable>
    </View>
  );
}

function BreathingVisualization({
  mainOrbStyle,
  pulse1Style,
  pulse2Style,
}: {
  mainOrbStyle: object;
  pulse1Style: object;
  pulse2Style: object;
}) {
  return (
    <View
      className="items-center justify-center"
      style={{ width: 300, height: 320 }}
    >
      {/* Outer pulse ring */}
      <Animated.View
        className="absolute items-center justify-center"
        style={[{ width: 280, height: 280, borderRadius: 140 }, pulse2Style]}
      >
        <Svg width={280} height={280}>
          <Defs>
            <SvgLinearGradient id="pulse2Grad" x1="0" y1="0" x2="1" y2="1">
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
        style={[{ width: 220, height: 220, borderRadius: 110 }, pulse1Style]}
      >
        <Svg width={220} height={220}>
          <Defs>
            <SvgLinearGradient id="pulse1Grad" x1="0" y1="0" x2="1" y2="1">
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
            <SvgLinearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 30,
                color: withAlpha(colors.primary.pink, 0.25),
              },
            ],
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
  );
}

function PhaseProgress({
  currentPhase,
  currentSubtext,
  currentStep,
  phaseIndex,
  sessionReady,
}: {
  currentPhase: string;
  currentSubtext: string;
  currentStep: { label: string; step: number };
  phaseIndex: number;
  sessionReady: boolean;
}) {
  return (
    <View className="mt-4 items-center gap-3 px-6" style={{ minHeight: 140 }}>
      <Text className="text-center text-5xl font-bold tracking-tight text-white">
        {currentPhase}
      </Text>
      <View style={{ height: 36 }} className="items-center justify-center">
        <Text className="mx-auto max-w-[280px] text-center text-sm leading-relaxed text-slate-400">
          {currentSubtext}
        </Text>
      </View>
      <View className="items-center gap-4">
        {/* Phase progress bars */}
        <View className="flex-row items-center justify-center gap-1.5">
          {PHASE_DURATIONS.map((duration, i) => (
            <View
              key={PHASE_STEPS[i].label}
              className={`h-1.5 rounded-full ${
                sessionReady && i === phaseIndex
                  ? 'bg-primary-pink'
                  : 'bg-white/10'
              }`}
              style={[
                { width: duration === 6 ? 56 : duration === 2 ? 40 : 24 },
                sessionReady &&
                  i === phaseIndex && {
                    boxShadow: [
                      {
                        offsetX: 0,
                        offsetY: 0,
                        blurRadius: 4,
                        color: withAlpha(colors.primary.pink, 0.6),
                      },
                    ],
                  },
              ]}
            />
          ))}
        </View>
        {sessionReady && (
          <Text className="text-sm font-bold uppercase tracking-widest text-primary-pink">
            Step {currentStep.step} of 3: {currentStep.label}
          </Text>
        )}
      </View>
    </View>
  );
}

// Animation hook for the breathing visualization. Animation builders are
// pure factories so the effect body has the same shape on every render —
// just three `.value =` lines. React Compiler accepts this single-shape
// pattern even though reanimated's API is mutation-based.
function buildBreathScaleAnim(active: boolean) {
  if (!active) return withTiming(1, { duration: 300 });
  return withRepeat(
    withSequence(
      withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      withTiming(1.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
    ),
    -1,
    false,
  );
}

function buildPulse1Anim(active: boolean) {
  if (!active) return withTiming(0.2, { duration: 300 });
  return withRepeat(
    withSequence(
      withTiming(0.35, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
    ),
    -1,
    false,
  );
}

function buildPulse2Anim(active: boolean) {
  if (!active) return withTiming(0.1, { duration: 300 });
  return withRepeat(
    withSequence(
      withTiming(0.2, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.05, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
    ),
    -1,
    false,
  );
}

/**
 * Drives a single shared value with `withTiming`/`withRepeat` builders.
 * Encapsulating one mutation per hook lets React Compiler analyze each
 * individually rather than tripping on a 3-mutation effect body.
 */
function useDrivenSharedValue(
  initial: number,
  active: boolean,
  build: (active: boolean) => number,
) {
  const value = useSharedValue(initial);
  useEffect(() => {
    value.value = build(active);
    // build is a stable module-level function reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, value]);
  return value;
}

function useBreathingPulse(active: boolean) {
  // Casts: builders return reanimated animation primitives at runtime, but
  // the type system sees `number` since SharedValue<number>'s setter accepts
  // animations interchangeably.
  const breathScale = useDrivenSharedValue(
    1,
    active,
    buildBreathScaleAnim as (a: boolean) => number,
  );
  const pulse1Opacity = useDrivenSharedValue(
    0.2,
    active,
    buildPulse1Anim as (a: boolean) => number,
  );
  const pulse2Opacity = useDrivenSharedValue(
    0.1,
    active,
    buildPulse2Anim as (a: boolean) => number,
  );
  return { breathScale, pulse1Opacity, pulse2Opacity };
}

// Double inhale pattern: short inhale 2s, second inhale 2s, long exhale 6s
const BREATHING_PHASES = [
  'Deep Inhale',
  'Second Inhale',
  'Long Exhale',
] as const;
const PHASE_DURATIONS = [2, 2, 6]; // seconds per phase
const PHASE_TOTAL = PHASE_DURATIONS.reduce((a, b) => a + b, 0); // 10s cycle

const TOTAL_CYCLES = 3;
const TOTAL_DURATION = TOTAL_CYCLES * PHASE_TOTAL; // 3 cycles = 30s

const PHASE_SUBTEXTS = [
  'Expanding your lungs with a deep breath in.',
  'Filling your lungs completely with a second breath.',
  'Releasing all tension slowly through your mouth.',
] as const;

const PHASE_STEPS = [
  { label: 'Expanding Lungs', step: 1 },
  { label: 'Filling Completely', step: 2 },
  { label: 'Releasing Tension', step: 3 },
] as const;

export default function DoubleInhaleSession() {
  const savedState = useAtomValue(doubleInhaleSessionAtom);
  const setSession = useSetAtom(doubleInhaleSessionAtom);

  const [initialTimeRemaining] = useState(
    () => savedState?.timeRemaining ?? TOTAL_DURATION,
  );

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const {
    sessionReady,
    countdown,
    instructionDone,
    skipToReady,
    skipToCountdown,
  } = useInstructionAudio({
    audioKey: 'breathing-double-inhale-instructions',
    skipInstruction: savedState !== null,
    isPaused,
    isMuted,
  });

  const { timeRemaining, setTimeRemaining, elapsed } = useSessionTimer({
    totalDuration: TOTAL_DURATION,
    initialTimeRemaining,
    isPaused,
    sessionReady,
    practiceType: 'double-inhale',
    onComplete: () => setSession(null),
  });

  // Breathing phase calculation
  const cyclePosition = elapsed % PHASE_TOTAL;
  let accumulated = 0;
  let phaseIndex = 0;
  for (let i = 0; i < PHASE_DURATIONS.length; i++) {
    accumulated += PHASE_DURATIONS[i];
    if (cyclePosition < accumulated) {
      phaseIndex = i;
      break;
    }
  }

  // Phase text (instruction → countdown → breathing phase)
  const currentPhase = !instructionDone
    ? 'Listen'
    : countdown !== undefined && countdown > 0
      ? `Starting in ${countdown}s`
      : BREATHING_PHASES[phaseIndex];

  const currentSubtext = !instructionDone
    ? 'Follow the guided instructions'
    : countdown !== undefined && countdown > 0
      ? 'Get ready...'
      : PHASE_SUBTEXTS[phaseIndex];

  const currentStep = PHASE_STEPS[phaseIndex];

  // Phase audio players (volume managed declaratively by the wrapper hook)
  const inhalePlayer = useManagedAudioPlayer(inhaleAudio, {
    volume: isMuted ? 0 : 1,
  });
  const exhalePlayer = useManagedAudioPlayer(exhaleAudio, {
    volume: isMuted ? 0 : 1,
  });
  const bowlPlayer = useManagedAudioPlayer(tibetanBowlAudio, {
    volume: isMuted ? 0 : 0.8,
  });

  // Play phase audio on phase changes + tibetan bowl at cycle start
  useEffect(() => {
    if (!sessionReady || isPaused) return;

    // Play inhale only on first inhale (phase 0), exhale on phase 2
    if (phaseIndex === 0) {
      inhalePlayer.seekTo(0);
      inhalePlayer.play();
    } else if (phaseIndex === 2) {
      exhalePlayer.seekTo(0);
      exhalePlayer.play();
    }

    // Play tibetan bowl at the start of each cycle
    if (phaseIndex === 0) {
      bowlPlayer.seekTo(0);
      bowlPlayer.play();
    }
  }, [phaseIndex, sessionReady, isPaused]);

  // Save state on back navigation (only if session has started)
  useSaveOnLeave({
    save: () => setSession({ timeRemaining }),
    canSave: sessionReady && timeRemaining > 0,
  });

  // Skip instruction or restart the session
  const handleRestart = () => {
    if (sessionReady) {
      setTimeRemaining(TOTAL_DURATION);
      setIsPaused(false);
      skipToReady();
      setSession(null);
    } else {
      skipToCountdown();
    }
  };

  // Animated values for breathing visualization
  const { breathScale, pulse1Opacity, pulse2Opacity } = useBreathingPulse(
    sessionReady && !isPaused,
  );

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

        {/* Header: Close / Timer Pill / Spacer */}
        <View className="z-20 flex-row items-center justify-between px-6 pb-4 pt-3.5">
          <BackButton icon="close" />

          {/* Timer pill */}
          <View className="rounded-full border border-white/10 bg-white/5 px-4 py-1">
            <Text
              className="text-sm font-bold text-accent-yellow"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatTime(timeRemaining)}
            </Text>
          </View>

          <View className="h-11 w-11" />
        </View>

        {/* Breathing visualization + phase text */}
        <View className="z-10 flex-1 items-center justify-center">
          <BreathingVisualization
            mainOrbStyle={mainOrbStyle}
            pulse1Style={pulse1Style}
            pulse2Style={pulse2Style}
          />
          <PhaseProgress
            currentPhase={currentPhase}
            currentSubtext={currentSubtext}
            currentStep={currentStep}
            phaseIndex={phaseIndex}
            sessionReady={sessionReady}
          />
        </View>

        {/* Glass instruction card */}
        <InstructionCard />

        {/* Controls: mute / pause / restart */}
        <PlaybackControls
          isPaused={isPaused}
          onPauseToggle={() => {
            setIsPaused((p) => {
              if (!p) {
                inhalePlayer.pause();
                exhalePlayer.pause();
                bowlPlayer.pause();
              }
              return !p;
            });
          }}
          isMuted={isMuted}
          onMuteToggle={() => setIsMuted((m) => !m)}
          onRestart={handleRestart}
          sessionReady={sessionReady}
        />
      </View>
    </Container>
  );
}
