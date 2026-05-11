import exhaleAudio from '@/assets/audio/practices/exhale.mp3';
import holdAudio from '@/assets/audio/practices/hold.mp3';
import inhaleAudio from '@/assets/audio/practices/inhale.mp3';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { useAnimatedTiming } from '@/hooks/useAnimatedTiming';
import { useNow } from '@/hooks/useNow';
import { useScheme } from '@/hooks/useTheme';
import { useManagedAudioPlayer } from '@/lib/audio/useManagedAudioPlayer';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { useStressScore } from '@/modules/home/hooks/useStressScore';
import { useBiometricHistory } from '@/modules/insights/hooks/useBiometricHistory';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { Easing, useAnimatedStyle } from 'react-native-reanimated';

import { BreathingStar } from '../components/BreathingStar';
import { useInstructionAudio } from '../hooks/useInstructionAudio';
import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { formatTime } from '../lib/format';
import { starBreathingSessionAtom } from '../store/session-atoms';

const TOTAL_DURATION = 50; // one full star orbit (5 breathing cycles)

// Star breathing phase boundaries (must match BreathingStar.tsx)
const INHALE_END = 4;
const HOLD_END = 6;
const CYCLE_DURATION = 10;

function StatsCard() {
  const scheme = useScheme();
  const { hrv, hasAccess, hrvAt } = useLatestBiometrics();
  const baseline = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], 'Month');
  const stress = useStressScore();
  const FRESH_MS = 30 * 60 * 1000;
  const now = useNow();
  const isFresh = hrvAt != null && now - hrvAt.getTime() < FRESH_MS;
  const liveHrv = isFresh ? hrv : null;
  const baselineHrv = baseline.avg;
  const deltaPct =
    liveHrv != null && baselineHrv != null && baselineHrv > 0
      ? ((liveHrv - baselineHrv) / baselineHrv) * 100
      : null;
  const isLive = hasAccess && liveHrv != null;

  return (
    <View className="mb-6 w-full rounded-[32px] border border-foreground/[0.08] bg-foreground/[0.03] p-6">
      {/* HRV header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <LinearGradient
            colors={[
              withAlpha(colors.gradient['hot-pink'], 0.2),
              withAlpha(colors.yellow[400], 0.2),
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: foregroundFor(scheme, 0.05),
            }}
          >
            <MaterialIcons
              name="favorite"
              size={24}
              color={colors.primary.pink}
            />
          </LinearGradient>
          <View>
            <Text size="xs" tone="tertiary" weight="bold" className="mb-0.5">
              Heart Rate Variability
            </Text>
            <View className="flex-row items-baseline gap-2">
              <Text size="lg" weight="semibold">
                {liveHrv != null ? `${Math.round(liveHrv)}ms` : '—'}
              </Text>
              {deltaPct != null ? (
                <View className="flex-row items-center">
                  <MaterialIcons
                    name={deltaPct >= 0 ? 'arrow-upward' : 'arrow-downward'}
                    size={14}
                    color={
                      deltaPct >= 0 ? colors.emerald[400] : colors.primary.pink
                    }
                  />
                  <Text
                    size="xs"
                    treatment="caption"
                    className={`font-bold ${
                      deltaPct >= 0 ? 'text-emerald-400' : 'text-primary-pink'
                    }`}
                  >
                    {Math.abs(Math.round(deltaPct))}%
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        {/* Mini chart bars */}
        <View className="h-10 flex-row items-end gap-1.5 pr-2">
          {[
            { key: 'p1', h: 0.4, color: 'rgba(244,37,106,0.2)' },
            { key: 'p2', h: 0.6, color: 'rgba(244,37,106,0.5)' },
            { key: 'p3', h: 1, color: 'rgba(244,37,106,0.8)' },
            { key: 'y1', h: 0.8, color: 'rgba(250,204,21,1)' },
            { key: 'y2', h: 0.6, color: 'rgba(250,204,21,0.7)' },
            { key: 'y3', h: 0.4, color: 'rgba(250,204,21,0.4)' },
          ].map((bar) => (
            <View
              key={bar.key}
              className="w-1.5 rounded-full"
              style={{
                height: `${bar.h * 100}%`,
                backgroundColor: bar.color,
              }}
            />
          ))}
        </View>
      </View>

      {/* Stats grid */}
      <View className="flex-row gap-4">
        <View className="flex-1 rounded-2xl border border-foreground/5 bg-foreground/[0.04] p-4">
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="mb-1.5 text-accent-yellow/50"
          >
            Stress Level
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              className={`h-2 w-2 rounded-full ${
                stress.label === 'Stressed'
                  ? 'bg-primary-pink'
                  : stress.label === 'Balanced'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
              }`}
            />
            <Text size="sm" weight="semibold">
              {stress.label ?? '—'}
            </Text>
          </View>
        </View>
        <View className="flex-1 rounded-2xl border border-foreground/5 bg-foreground/[0.04] p-4">
          <Text
            size="xs"
            treatment="caption"
            tone="accent"
            weight="bold"
            className="mb-1.5 /50"
          >
            Sync Status
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              className={`h-2 w-2 rounded-full ${
                isLive ? 'bg-emerald-400' : 'bg-foreground/30'
              }`}
              style={
                isLive
                  ? {
                      boxShadow: [
                        {
                          offsetX: 0,
                          offsetY: 0,
                          blurRadius: 8,
                          color: colors.emerald[400],
                        },
                      ],
                    }
                  : undefined
              }
            />
            <Text size="sm" weight="semibold">
              {isLive ? 'Live Tracking' : hasAccess ? 'Idle' : 'Not Connected'}
            </Text>
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

export default function StarBreathingSession() {
  const savedState = useAtomValue(starBreathingSessionAtom);
  const setSession = useSetAtom(starBreathingSessionAtom);

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
    audioKey: 'breathing-star-instructions',
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
    practiceType: 'star-breathing',
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
  const phaseIndex =
    cyclePosition < INHALE_END ? 0 : cyclePosition < HOLD_END ? 1 : 2;

  // Phase text driven by BreathingStar animation callback
  const currentPhase = !instructionDone
    ? 'Listen'
    : countdown !== undefined && countdown > 0
      ? `Starting in ${countdown}s`
      : breathPhase;

  const subText = !instructionDone
    ? 'Follow the guided instructions'
    : countdown !== undefined && countdown > 0
      ? 'Get ready...'
      : 'Follow the light around the star';

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

  // Play phase audio on phase changes
  useEffect(() => {
    if (!sessionReady || isPaused) return;

    const players = [inhalePlayer, holdPlayer, exhalePlayer];
    const currentPlayer = players[phaseIndex];
    currentPlayer.seekTo(0);
    currentPlayer.play();
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
      variant="default"
      scroll
      header={
        <Header
          left={<BackButton icon="close" />}
          center={
            <View className="items-center">
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="mb-1 text-foreground/40"
              >
                Star Breathing
              </Text>
              <Text
                size="lg"
                weight="medium"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatTime(timeRemaining)}
              </Text>
            </View>
          }
        />
      }
      className="px-6"
      contentClassName="items-center pb-6"
    >
      {/* Breathing instruction — fixed height to prevent layout shifts */}
      <View className="items-center px-2 pt-4" style={{ height: 100 }}>
        <Text size="display" align="center" weight="semibold" className="mb-3">
          {currentPhase}
        </Text>
        <Text
          size="sm"
          align="center"
          weight="medium"
          className="text-foreground/40"
        >
          {subText}
        </Text>
      </View>

      {/* Star visualization */}
      <View className="mb-4 items-center justify-center">
        <BreathingStar
          key={restartKey}
          isActive={sessionReady}
          isPaused={isPaused}
          onPhaseChange={setBreathPhase}
          initialElapsed={
            savedState ? TOTAL_DURATION - initialTimeRemaining : 0
          }
        />
      </View>

      {/* Progress bar */}
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
        treatment="caption"
        tone="secondary"
        weight="bold"
        className="mb-6 mt-3"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}
      </Text>

      {/* Instruction card */}
      <View className="mb-6 w-full max-w-sm rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4">
        <Text
          size="md"
          align="center"
          weight="medium"
          className="leading-relaxed text-foreground/90"
        >
          Trace the star&#39;s edges with your breath. Inhale and exhale along
          the lines, hold at each point.
        </Text>
      </View>

      {/* Playback controls */}
      <PlaybackControls
        isPaused={isPaused}
        onPauseToggle={() => {
          setIsPaused((p) => {
            if (!p) {
              inhalePlayer.pause();
              holdPlayer.pause();
              exhalePlayer.pause();
            }
            return !p;
          });
        }}
        isMuted={isMuted}
        onMuteToggle={() => setIsMuted((m) => !m)}
        onRestart={handleRestart}
        sessionReady={sessionReady}
      />

      {/* HRV + Stats card */}
      <StatsCard />
    </Screen>
  );
}
