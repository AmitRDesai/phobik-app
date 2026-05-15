import exhaleAudio from '@/assets/audio/practices/exhale.mp3';
import holdAudio from '@/assets/audio/practices/hold.mp3';
import inhaleAudio from '@/assets/audio/practices/inhale.mp3';
import tibetanBowlAudio from '@/assets/audio/practices/tibetan-bowl.mp3';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { BiometricStatCard } from '@/components/ui/BiometricStatCard';
import { Header } from '@/components/ui/Header';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { Screen } from '@/components/ui/Screen';
import { useNow } from '@/hooks/useNow';
import { useManagedAudioPlayer } from '@/lib/audio/useManagedAudioPlayer';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { BreathingCircle478 } from '../components/BreathingCircle478';
import { useInstructionAudio } from '@/modules/practices/hooks/useInstructionAudio';
import { useSaveOnLeave } from '@/modules/practices/hooks/useSaveOnLeave';
import { useSessionTimer } from '@/modules/practices/hooks/useSessionTimer';
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
  const { heartRate, hrv, hasAccess, heartRateAt, hrvAt } =
    useLatestBiometrics();
  const FRESH_MS = 30 * 60 * 1000;
  const now = useNow();
  const isFresh = (at: Date | null) =>
    at != null && now - at.getTime() < FRESH_MS;
  const liveHr = isFresh(heartRateAt) ? heartRate : null;
  const liveHrv = isFresh(hrvAt) ? hrv : null;

  return (
    <Screen
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

        <PlaybackControls
          className="mb-8 justify-between px-6"
          size="md"
          isPaused={isPaused}
          onPauseToggle={() => setIsPaused((p) => !p)}
          isMuted={isMuted}
          onMuteToggle={() => setIsMuted((m) => !m)}
          onRestart={handleRestart}
          sessionReady={sessionReady}
        />

        {/* Stats cards row */}
        {hasAccess ? (
          <View className="mb-4 flex-row gap-4">
            <BiometricStatCard
              className="flex-1"
              size="md"
              tone="pink"
              label="Heart Rate"
              value={liveHr != null ? String(liveHr) : '—'}
              unit="BPM"
              isStale={liveHr == null}
              icon={(color) => (
                <MaterialIcons
                  name="favorite"
                  size={18}
                  color={color}
                  style={{
                    textShadowColor: withAlpha(colors.rose[500], 0.5),
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10,
                  }}
                />
              )}
            />
            <BiometricStatCard
              className="flex-1"
              size="md"
              tone="yellow"
              label="HRV"
              value={liveHrv != null ? String(Math.round(liveHrv)) : '—'}
              unit="MS"
              isStale={liveHrv == null}
              icon={(color) => (
                <MaterialIcons
                  name="monitor-heart"
                  size={18}
                  color={color}
                  style={{
                    textShadowColor: withAlpha(colors.yellow[500], 0.5),
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10,
                  }}
                />
              )}
            />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
