import exhaleAudio from '@/assets/audio/practices/exhale.mp3';
import holdAudio from '@/assets/audio/practices/hold.mp3';
import inhaleAudio from '@/assets/audio/practices/inhale.mp3';
import tibetanBowlAudio from '@/assets/audio/practices/tibetan-bowl.mp3';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { useNow } from '@/hooks/useNow';
import { useScheme } from '@/hooks/useTheme';
import { useManagedAudioPlayer } from '@/lib/audio/useManagedAudioPlayer';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { BreathingCircle478 } from '../components/BreathingCircle478';
import { useInstructionAudio } from '../hooks/useInstructionAudio';
import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { breathing478SessionAtom } from '../store/session-atoms';

const INHALE = 4;
const HOLD = 7;
const EXHALE = 8;
const CYCLE_DURATION = INHALE + HOLD + EXHALE; // 19 seconds
const TOTAL_CYCLES = 4;
const TOTAL_DURATION = TOTAL_CYCLES * CYCLE_DURATION; // 76 seconds

const BREATHING_PHASES = [
  'Inhale Deeply',
  'Hold Breath',
  'Exhale Slowly',
] as const;
const PHASE_SUBTEXTS = [
  'Fill your lungs completely with air as the circle expands.',
  'Keep your breath held and stay relaxed.',
  'Release the air slowly and steadily through your mouth.',
] as const;

export default function Breathing478Session() {
  const scheme = useScheme();
  const savedState = useAtomValue(breathing478SessionAtom);
  const setSession = useSetAtom(breathing478SessionAtom);

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
    audioKey: 'breathing-478-instructions',
    skipInstruction: savedState !== null,
    isPaused,
    isMuted,
  });

  const { timeRemaining, setTimeRemaining, elapsed } = useSessionTimer({
    totalDuration: TOTAL_DURATION,
    initialTimeRemaining,
    isPaused,
    sessionReady,
    practiceType: '478-breathing',
    onComplete: () => setSession(null),
  });

  // Derive phase index from elapsed time
  const cyclePosition = elapsed % CYCLE_DURATION;
  const phaseIndex =
    cyclePosition < INHALE ? 0 : cyclePosition < INHALE + HOLD ? 1 : 2;

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

  // Phase audio players (volume managed declaratively by the wrapper hook)
  const inhalePlayer = useManagedAudioPlayer(inhaleAudio, {
    volume: isMuted ? 0 : 1,
  });
  const holdPlayer = useManagedAudioPlayer(holdAudio, {
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

    const players = [inhalePlayer, holdPlayer, exhalePlayer];
    const player = players[phaseIndex];
    player.seekTo(0);
    player.play();

    // Play tibetan bowl at the start of each cycle
    if (phaseIndex === 0) {
      bowlPlayer.seekTo(0);
      bowlPlayer.play();
    }
  }, [phaseIndex, sessionReady, isPaused]);

  // Pause phase audio when session is paused
  useEffect(() => {
    if (isPaused) {
      inhalePlayer.pause();
      holdPlayer.pause();
      exhalePlayer.pause();
      bowlPlayer.pause();
    }
  }, [isPaused, inhalePlayer, holdPlayer, exhalePlayer, bowlPlayer]);

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

  // Live HR / HRV from connected wearable (Apple Health / Health Connect).
  const { heartRate, hrv, heartRateAt, hrvAt } = useLatestBiometrics();
  const FRESH_MS = 30 * 60 * 1000;
  const now = useNow();
  const isFresh = (at: Date | null) =>
    at != null && now - at.getTime() < FRESH_MS;
  const liveHr = isFresh(heartRateAt) ? heartRate : null;
  const liveHrv = isFresh(hrvAt) ? hrv : null;

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          left={<BackButton />}
          center={
            <Text size="lg" weight="bold">
              4-7-8 Breathing
            </Text>
          }
        />
      }
      className="px-0"
    >
      {/* Breathing instruction text — fixed height to prevent layout shifts */}
      <View className="mt-2 items-center px-8" style={{ height: 100 }}>
        <Text size="display" align="center" className="mb-2 font-light">
          {currentPhase}
        </Text>
        <Text
          size="sm"
          tone="secondary"
          align="center"
          className="mx-auto max-w-[280px] leading-relaxed"
        >
          {currentSubtext}
        </Text>
      </View>

      {/* Circular visualization - flex to fill available space */}
      <View className="flex-1 items-center justify-center">
        <BreathingCircle478
          elapsed={elapsed}
          isPaused={isPaused}
          isActive={sessionReady}
          phaseIndex={phaseIndex}
        />
      </View>

      {/* Bottom section */}
      <View className="px-screen-x pt-6">
        {/* Instruction card */}
        <View className="mb-6 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.04] p-4">
          <Text
            size="sm"
            align="center"
            weight="medium"
            className="leading-relaxed text-foreground/80"
          >
            Inhale for 4 seconds, hold your breath for 7 seconds, and exhale for
            8 seconds. Repeat this cycle 4 times.
          </Text>
        </View>

        {/* Controls row: mute, pause, restart */}
        <View className="mb-8 flex-row items-center justify-between px-6">
          {/* Mute button */}
          <Pressable
            onPress={() => setIsMuted((m) => !m)}
            className="h-14 w-14 items-center justify-center rounded-full border border-foreground/[0.08] bg-foreground/[0.04] active:scale-90"
          >
            <MaterialIcons
              name={isMuted ? 'volume-off' : 'volume-up'}
              size={24}
              color={foregroundFor(scheme, 0.6)}
            />
          </Pressable>

          {/* Pause / Play button */}
          <Pressable
            onPress={() => setIsPaused((p) => !p)}
            style={{
              borderRadius: 32,
              boxShadow: `0 0 24px ${withAlpha(colors.primary.pink, 0.5)}`,
            }}
          >
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons
                name={isPaused ? 'play-arrow' : 'pause'}
                size={32}
                color="white"
              />
            </LinearGradient>
          </Pressable>

          {/* Restart button */}
          <Pressable
            onPress={handleRestart}
            className="h-14 w-14 items-center justify-center rounded-full border border-foreground/[0.08] bg-foreground/[0.04] active:scale-90"
          >
            <MaterialIcons
              name={sessionReady ? 'replay' : 'skip-next'}
              size={24}
              color={foregroundFor(scheme, 0.6)}
            />
          </Pressable>
        </View>

        {/* Stats cards row */}
        <View className="mb-4 flex-row gap-4">
          {/* Heart Rate card */}
          <View className="flex-1 rounded-[32px] border border-foreground/[0.08] bg-foreground/[0.04] p-5">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="favorite"
                size={18}
                color={colors.primary.pink}
                style={{
                  textShadowColor: withAlpha(colors.rose[500], 0.5),
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10,
                }}
              />
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="tracking-[0.2em] text-foreground/50"
                style={{ paddingRight: 1.8 }}
              >
                Heart Rate
              </Text>
            </View>
            <View className="mt-1 flex-row items-baseline gap-1">
              <Text
                size="h2"
                weight="semibold"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {liveHr != null ? liveHr : '—'}
              </Text>
              <Text
                size="xs"
                treatment="caption"
                tone="secondary"
                weight="bold"
              >
                BPM
              </Text>
            </View>
          </View>

          {/* HRV card */}
          <View className="flex-1 rounded-[32px] border border-foreground/[0.08] bg-foreground/[0.04] p-5">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="monitor-heart"
                size={18}
                color={colors.accent.yellow}
                style={{
                  textShadowColor: withAlpha(colors.yellow[500], 0.5),
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10,
                }}
              />
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="tracking-[0.2em] text-foreground/50"
                style={{ paddingRight: 1.8 }}
              >
                HRV
              </Text>
            </View>
            <View className="mt-1 flex-row items-baseline gap-1">
              <Text
                size="h2"
                weight="semibold"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {liveHrv != null ? Math.round(liveHrv) : '—'}
              </Text>
              <Text
                size="xs"
                treatment="caption"
                tone="secondary"
                weight="bold"
              >
                MS
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}
