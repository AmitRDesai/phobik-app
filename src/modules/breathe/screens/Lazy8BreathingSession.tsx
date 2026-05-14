import exhaleAudio from '@/assets/audio/practices/exhale.mp3';
import inhaleAudio from '@/assets/audio/practices/inhale.mp3';
import tibetanBowlAudio from '@/assets/audio/practices/tibetan-bowl.mp3';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { Screen } from '@/components/ui/Screen';
import { useAnimatedTiming } from '@/hooks/useAnimatedTiming';
import { useNow } from '@/hooks/useNow';
import { useScheme } from '@/hooks/useTheme';
import { useManagedAudioPlayer } from '@/lib/audio/useManagedAudioPlayer';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';

import { BreathingInfinity } from '../components/BreathingInfinity';
import { useInstructionAudio } from '@/modules/practices/hooks/useInstructionAudio';
import { useSaveOnLeave } from '@/modules/practices/hooks/useSaveOnLeave';
import { useSessionTimer } from '@/modules/practices/hooks/useSessionTimer';
import { formatTime } from '@/modules/practices/lib/format';
import { lazy8BreathingSessionAtom } from '../store/session-atoms';

const CYCLE_DURATION = 8; // 4s inhale + 4s exhale
const TOTAL_DURATION = CYCLE_DURATION * 5; // 5 cycles = 40s
const INHALE_END = 4;

function StatsCard() {
  const { heartRate, hrv, heartRateAt, hrvAt } = useLatestBiometrics();
  const FRESH_MS = 30 * 60 * 1000;
  const now = useNow();
  const isFresh = (at: Date | null) =>
    at != null && now - at.getTime() < FRESH_MS;
  const liveHr = isFresh(heartRateAt) ? heartRate : null;
  const liveHrv = isFresh(hrvAt) ? hrv : null;

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
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              className="tracking-wider text-foreground/60"
            >
              Heart Rate
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text size="lg" weight="bold" className="tracking-tighter">
                {liveHr != null ? liveHr : '—'}
              </Text>
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="text-pink-400"
              >
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
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              className="tracking-wider text-foreground/60"
            >
              HRV
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text size="lg" weight="bold" className="tracking-tighter">
                {liveHrv != null ? Math.round(liveHrv) : '—'}
              </Text>
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="text-yellow-400"
              >
                MS
              </Text>
            </View>
          </View>
        </View>
      </View>
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
    <Screen
      scroll
      header={
        <Header
          left={<BackButton icon="close" />}
          center={
            <Text size="lg" weight="bold">
              Lazy 8 Breathing
            </Text>
          }
        />
      }
      className="px-6"
      contentClassName="items-center pb-6"
    >
      {/* Breathing instruction — fixed height to prevent scroll jumps */}
      <View className="mb-6 mt-8 items-center" style={{ height: 90 }}>
        <Text size="display" weight="semibold" className="tracking-wider">
          {currentPhase}
        </Text>
        <Text size="xs" weight="medium" className="mt-3 text-foreground/60">
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
        size="xs"
        tone="secondary"
        weight="bold"
        className="mb-6 mt-3"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}
      </Text>

      {/* Instruction card */}
      <View className="mb-6 w-full max-w-sm rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
        <Text
          size="sm"
          align="center"
          weight="medium"
          className="leading-relaxed text-foreground/90"
        >
          Follow the path with your eyes, inhale as it moves right, exhale as it
          moves left. Relax, breathe slowly, and repeat the loop.
        </Text>
      </View>

      {/* Playback controls */}
      <PlaybackControls
        className="mb-8 justify-center gap-8"
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
    </Screen>
  );
}
