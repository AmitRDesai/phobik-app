import exhaleAudio from '@/assets/audio/practices/exhale.mp3';
import inhaleAudio from '@/assets/audio/practices/inhale.mp3';
import tibetanBowlAudio from '@/assets/audio/practices/tibetan-bowl.mp3';
import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import { useManagedAudioPlayer } from '@/lib/audio/useManagedAudioPlayer';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';
import { useAnimatedTiming } from '@/hooks/useAnimatedTiming';

import { BreathingInfinity } from '../components/BreathingInfinity';
import { useInstructionAudio } from '../hooks/useInstructionAudio';
import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { lazy8BreathingSessionAtom } from '../store/session-atoms';
import { formatTime } from '../lib/format';
import { SafeAreaView } from 'react-native-safe-area-context';

const CYCLE_DURATION = 8; // 4s inhale + 4s exhale
const TOTAL_DURATION = CYCLE_DURATION * 5; // 5 cycles = 40s
const INHALE_END = 4;

function StatsCard() {
  const scheme = useScheme();
  return (
    <View className="w-full max-w-sm rounded-3xl border border-foreground/10 bg-foreground/5 p-4">
      <View className="flex-row items-center justify-between px-1">
        {/* Heart Rate */}
        <View className="flex-row items-center gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: withAlpha(colors.rose[500], 0.2),
              borderWidth: 1,
              borderColor: withAlpha(colors.rose[500], 0.3),
            }}
          >
            <MaterialIcons name="favorite" size={20} color={colors.rose[400]} />
          </View>
          <View>
            <Text className="text-[9px] font-bold uppercase tracking-wider text-foreground/60">
              Heart Rate
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-xl font-bold tracking-tighter text-foreground">
                72
              </Text>
              <Text className="text-[9px] font-bold uppercase text-pink-400">
                BPM
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View className="h-8 w-px bg-foreground/10" />

        {/* HRV */}
        <View className="flex-row items-center gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: withAlpha(colors.yellow[500], 0.2),
              borderWidth: 1,
              borderColor: withAlpha(colors.yellow[500], 0.3),
            }}
          >
            <MaterialIcons name="waves" size={20} color={colors.yellow[400]} />
          </View>
          <View>
            <Text className="text-[9px] font-bold uppercase tracking-wider text-foreground/60">
              HRV
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-xl font-bold tracking-tighter text-foreground">
                74
              </Text>
              <Text className="text-[9px] font-bold uppercase text-yellow-400">
                MS
              </Text>
            </View>
          </View>
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
  const scheme = useScheme();
  return (
    <View className="mb-8 flex-row items-center justify-center gap-8">
      <Pressable
        onPress={onMuteToggle}
        className="h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 active:scale-95"
      >
        <MaterialIcons
          name={isMuted ? 'volume-off' : 'volume-up'}
          size={24}
          color={foregroundFor(scheme, 0.7)}
        />
      </Pressable>
      <Pressable
        onPress={onPauseToggle}
        className="h-14 w-14 items-center justify-center rounded-full bg-white active:scale-95"
        style={{
          boxShadow: [
            {
              offsetX: 0,
              offsetY: 2,
              blurRadius: 8,
              color: 'rgba(255, 255, 255, 0.3)',
            },
          ],
        }}
      >
        <MaterialIcons
          name={isPaused ? 'play-arrow' : 'pause'}
          size={28}
          color={colors.background.dark}
        />
      </Pressable>
      <Pressable
        onPress={onRestart}
        className="h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 active:scale-95"
      >
        <MaterialIcons
          name={sessionReady ? 'replay' : 'skip-next'}
          size={24}
          color={foregroundFor(scheme, 0.7)}
        />
      </Pressable>
    </View>
  );
}

export default function Lazy8BreathingSession() {
  const savedState = useAtomValue(lazy8BreathingSessionAtom);
  const setSession = useSetAtom(lazy8BreathingSessionAtom);

  const [initialTimeRemaining] = useState(
    () => savedState?.timeRemaining ?? TOTAL_DURATION,
  );

  const [isPaused, setIsPaused] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');

  const [isMuted, setIsMuted] = useState(false);

  const {
    sessionReady,
    countdown,
    instructionDone,
    skipToReady,
    skipToCountdown,
  } = useInstructionAudio({
    audioKey: 'breathing-lazy-8-instructions',
    skipInstruction: savedState !== null,
    isPaused,
    isMuted,
  });

  const {
    timeRemaining,
    setTimeRemaining,
    elapsed,
    progress: overallProgress,
  } = useSessionTimer({
    totalDuration: TOTAL_DURATION,
    initialTimeRemaining,
    isPaused,
    sessionReady,
    practiceType: 'lazy8-breathing',
    onComplete: () => setSession(null),
  });

  // Animated progress bar
  const animatedProgress = useAnimatedTiming(overallProgress, {
    duration: 1000,
    easing: Easing.linear,
  });
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  // Derive phase index from elapsed time for phase audio
  const cyclePosition = elapsed % CYCLE_DURATION;
  const phaseIndex = cyclePosition < INHALE_END ? 0 : 1;

  // Phase text driven by BreathingInfinity animation callback
  const currentPhase = !instructionDone
    ? 'Listen'
    : countdown !== undefined && countdown > 0
      ? `Starting in ${countdown}s`
      : breathPhase;

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

    const players = [inhalePlayer, exhalePlayer];
    const currentPlayer = players[phaseIndex];
    currentPlayer.seekTo(0);
    currentPlayer.play();

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

  const [restartKey, setRestartKey] = useState(0);

  // Skip instruction or restart the session
  const handleRestart = () => {
    if (sessionReady) {
      setRestartKey((k) => k + 1);
      setTimeRemaining(TOTAL_DURATION);
      setIsPaused(false);
      skipToReady();
      setSession(null);
    } else {
      skipToCountdown();
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface">
      <View className="flex-1 bg-surface">
        <GlowBg
          bgClassName="bg-surface"
          centerX={0.5}
          centerY={0.35}
          intensity={0.7}
          radius={0.35}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-50 flex-row items-center justify-between px-4 pb-2 pt-4">
          <BackButton icon="close" />
          <Text className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-foreground">
            Lazy 8 Breathing
          </Text>
          <View className="h-12 w-12" />
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="z-10 flex-1"
          contentContainerClassName="items-center px-6 pb-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Breathing instruction — fixed height to prevent scroll jumps */}
          <View className="mb-6 mt-8 items-center" style={{ height: 90 }}>
            <Text className="text-5xl font-semibold tracking-wider text-foreground">
              {currentPhase}
            </Text>
            <Text className="mt-3 text-sm font-medium uppercase tracking-widest text-foreground/60">
              Focus on the light
            </Text>
          </View>

          {/* Infinity visualization */}
          <View className="mb-8 w-full items-center">
            <BreathingInfinity
              key={restartKey}
              isActive={sessionReady}
              isPaused={isPaused}
              onPhaseChange={setBreathPhase}
              initialElapsed={
                savedState ? TOTAL_DURATION - initialTimeRemaining : 0
              }
            />
          </View>

          {/* Progress bar — star breathing gradient style */}
          <View
            className="mb-0 w-full max-w-xs overflow-hidden rounded-full bg-foreground/[0.08]"
            style={{ height: 4 }}
          >
            <Animated.View style={[{ height: '100%' }, progressBarStyle]}>
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 99,
                }}
              />
            </Animated.View>
          </View>

          {/* Timer */}
          <Text
            className="mb-6 mt-3 text-[10px] font-bold uppercase tracking-widest text-foreground/55"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}
          </Text>

          {/* Instruction card */}
          <View className="mb-6 w-full max-w-sm rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
            <Text className="text-center text-sm font-medium leading-relaxed text-foreground/90">
              Follow the path with your eyes, inhale as it moves right, exhale
              as it moves left. Relax, breathe slowly, and repeat the loop.
            </Text>
          </View>

          {/* Playback controls */}
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

          {/* Bottom stats card */}
          <StatsCard />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
