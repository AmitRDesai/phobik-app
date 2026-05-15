import exhaleAudio from '@/assets/audio/practices/exhale.mp3';
import holdAudio from '@/assets/audio/practices/hold.mp3';
import inhaleAudio from '@/assets/audio/practices/inhale.mp3';
import restAudio from '@/assets/audio/practices/rest.mp3';
import tibetanBowlAudio from '@/assets/audio/practices/tibetan-bowl.mp3';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { Screen } from '@/components/ui/Screen';
import { useNow } from '@/hooks/useNow';
import { useManagedAudioPlayer } from '@/lib/audio/useManagedAudioPlayer';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { BreathingBox } from '../components/BreathingBox';
import { useInstructionAudio } from '@/modules/practices/hooks/useInstructionAudio';
import { useSaveOnLeave } from '@/modules/practices/hooks/useSaveOnLeave';
import { useSessionTimer } from '@/modules/practices/hooks/useSessionTimer';
import { formatTime } from '@/modules/practices/lib/format';
import { boxBreathingSessionAtom } from '../store/session-atoms';

const PHASE_DURATION = 4;
const CYCLE_DURATION = PHASE_DURATION * 4; // 16s
const TOTAL_DURATION = CYCLE_DURATION * 5; // 5 cycles = 80 seconds

export default function BoxBreathingSession() {
  const savedState = useAtomValue(boxBreathingSessionAtom);
  const setSession = useSetAtom(boxBreathingSessionAtom);

  const [initialTimeRemaining] = useState(
    () => savedState?.timeRemaining ?? TOTAL_DURATION,
  );

  const [isPaused, setIsPaused] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const { sessionReady, countdown, skipToReady, skipToCountdown } =
    useInstructionAudio({
      audioKey: 'breathing-box-instructions',
      skipInstruction: savedState !== null,
      isPaused,
      isMuted,
    });

  const { timeRemaining, setTimeRemaining, elapsed } = useSessionTimer({
    totalDuration: TOTAL_DURATION,
    initialTimeRemaining,
    isPaused,
    sessionReady,
    practiceType: 'box-breathing',
    onComplete: () => setSession(null),
  });

  // Breathing phase (derived from elapsed)
  const cyclePosition = elapsed % CYCLE_DURATION;
  const phaseIndex = Math.floor(cyclePosition / PHASE_DURATION);

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
  const restPlayer = useManagedAudioPlayer(restAudio, {
    volume: isMuted ? 0 : 1,
  });
  const bowlPlayer = useManagedAudioPlayer(tibetanBowlAudio, {
    volume: isMuted ? 0 : 0.8,
  });

  // Play phase audio on phase changes + tibetan bowl at cycle start
  useEffect(() => {
    if (!sessionReady || isPaused) return;

    const players = [inhalePlayer, holdPlayer, exhalePlayer, restPlayer];
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
      restPlayer.pause();
      bowlPlayer.pause();
    }
  }, [
    isPaused,
    inhalePlayer,
    holdPlayer,
    exhalePlayer,
    restPlayer,
    bowlPlayer,
  ]);

  // Save state on back navigation (only if session has started)
  useSaveOnLeave({
    save: () => setSession({ timeRemaining }),
    canSave: sessionReady && timeRemaining > 0,
  });

  // Live HR / HRV from Apple Health / Health Connect via the wearable hook.
  const { heartRate, hrv, hasAccess, heartRateAt, hrvAt } =
    useLatestBiometrics();
  const FRESH_MS = 30 * 60 * 1000;
  const now = useNow();
  const isFresh = (at: Date | null) =>
    at != null && now - at.getTime() < FRESH_MS;
  const hrvLive = isFresh(hrvAt) ? hrv : null;
  const hrLive = isFresh(heartRateAt) ? heartRate : null;
  const hrvMs = hrvLive != null ? Math.round(hrvLive) : null;
  const heartRateBpm = hrLive;
  const hasLiveData = hasAccess && (hrvMs != null || heartRateBpm != null);

  return (
    <Screen
      header={
        <Header
          left={<BackButton />}
          center={
            <Text size="lg" weight="bold">
              Box Breathing
            </Text>
          }
        />
      }
      className="flex-1"
    >
      {/* Breathing Visualization - centered */}
      <View className="flex-1 items-center justify-center">
        <BreathingBox
          elapsed={elapsed}
          isPaused={isPaused}
          isActive={sessionReady}
          countdown={countdown}
        />

        {/* Instruction text */}
        <View className="mt-8 items-center">
          <Text
            size="xs"
            treatment="caption"
            weight="medium"
            className="mb-4 text-foreground/40"
            style={{ paddingRight: 1.1 }}
          >
            MATCH YOUR BREATH TO THE SQUARE
          </Text>

          {/* Time cards */}
          <View className="flex-row gap-4">
            <View className="items-center rounded-2xl border border-foreground/5 bg-surface px-6 py-3">
              <Text
                size="xs"
                treatment="caption"
                tone="accent"
                weight="bold"
                className="mb-1 tracking-wider"
                style={{ paddingRight: 1.1 }}
              >
                Completed
              </Text>
              <Text
                size="lg"
                weight="bold"
                className="text-foreground/90"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatTime(elapsed)}
              </Text>
            </View>
            <View className="items-center rounded-2xl border border-foreground/5 bg-surface px-6 py-3">
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="mb-1 tracking-wider text-accent-yellow"
                style={{ paddingRight: 1.1 }}
              >
                Goal
              </Text>
              <Text
                size="lg"
                weight="bold"
                className="text-foreground/90"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatTime(TOTAL_DURATION)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom HRV Card + Controls */}
      <View className="px-screen-x pb-6">
        <Card variant="raised" size="lg">
          {hasAccess ? (
            <>
              {/* HRV Header */}
              <View className="mb-6 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                  <View
                    className="h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: withAlpha(colors.pink[400], 0.1),
                    }}
                  >
                    <MaterialIcons
                      name="monitor-heart"
                      size={18}
                      color={colors.primary.pink}
                    />
                  </View>
                  <View>
                    <Text size="sm" weight="bold">
                      HRV Tracking
                    </Text>
                    <Text
                      size="xs"
                      treatment="caption"
                      className="leading-none text-foreground/40"
                      style={{ paddingRight: 1.1 }}
                    >
                      {hasLiveData ? 'Wearable Streaming' : 'No recent samples'}
                    </Text>
                  </View>
                </View>
                <View
                  className={`flex-row items-center gap-2 rounded-full border px-2.5 py-1 ${
                    hasLiveData
                      ? 'border-green-500/20 bg-green-500/10'
                      : 'border-foreground/10 bg-foreground/5'
                  }`}
                >
                  <View
                    className={`h-1.5 w-1.5 rounded-full ${
                      hasLiveData ? 'bg-green-500' : 'bg-foreground/30'
                    }`}
                  />
                  <Text
                    size="xs"
                    treatment="caption"
                    className={`font-bold ${
                      hasLiveData ? 'text-green-500' : 'text-foreground/40'
                    }`}
                    style={{ paddingRight: 1.1 }}
                  >
                    {hasLiveData ? 'Synced' : 'Idle'}
                  </Text>
                </View>
              </View>

              {/* HRV Stats Grid */}
              <View className="flex-row gap-6">
                {/* Variability */}
                <View className="flex-1 gap-2">
                  <View className="flex-row items-baseline gap-1.5">
                    <Text size="h1">{hrvMs != null ? hrvMs : '—'}</Text>
                    <Text
                      size="xs"
                      treatment="caption"
                      tone="accent"
                      weight="medium"
                      className="tracking-tighter"
                    >
                      ms
                    </Text>
                  </View>
                  <View className="h-1.5 overflow-hidden rounded-full bg-foreground/5">
                    <LinearGradient
                      colors={[colors.primary.pink, colors.accent.yellow]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        height: '100%',
                        width: `${Math.min(100, hrvMs ?? 0)}%`,
                        borderRadius: 99,
                      }}
                    />
                  </View>
                  <Text size="xs" treatment="caption" tone="tertiary">
                    Variability
                  </Text>
                </View>

                {/* Heart Rate */}
                <View className="flex-1 items-end gap-2">
                  <View className="flex-row items-baseline gap-1.5">
                    <Text size="h1">
                      {heartRateBpm != null ? heartRateBpm : '—'}
                    </Text>
                    <Text
                      size="xs"
                      treatment="caption"
                      weight="medium"
                      className="tracking-tighter text-accent-yellow"
                    >
                      bpm
                    </Text>
                  </View>
                  <View className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/5">
                    <View className="flex-1 flex-row justify-end">
                      <LinearGradient
                        colors={[colors.primary.pink, colors.accent.yellow]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={{
                          height: '100%',
                          width: `${Math.min(100, heartRateBpm ?? 0)}%`,
                          borderRadius: 99,
                        }}
                      />
                    </View>
                  </View>
                  <Text size="xs" treatment="caption" tone="tertiary">
                    Heart Rate
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          <PlaybackControls
            className={clsx(
              'justify-between px-6',
              hasAccess && 'mt-8 border-t border-foreground/5 pt-6',
            )}
            size="md"
            isPaused={isPaused}
            onPauseToggle={() => setIsPaused((p) => !p)}
            isMuted={isMuted}
            onMuteToggle={() => setIsMuted((m) => !m)}
            onRestart={handleRestart}
            sessionReady={sessionReady}
          />
        </Card>
      </View>
    </Screen>
  );
}
