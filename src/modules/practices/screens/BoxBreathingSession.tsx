import boxBreathingInstructions from '@/assets/audio/practices/box-breathing-session/instructions.mp3';
import exhaleAudio from '@/assets/audio/practices/common/exhale.mp3';
import holdAudio from '@/assets/audio/practices/common/hold.mp3';
import inhaleAudio from '@/assets/audio/practices/common/inhale.mp3';
import restAudio from '@/assets/audio/practices/common/rest.mp3';
import tibetanBowlAudio from '@/assets/audio/practices/common/tibetan-bowl.mp3';
import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';

import { BreathingBox } from '../components/BreathingBox';
import { useInstructionAudio } from '../hooks/useInstructionAudio';
import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { boxBreathingSessionAtom } from '../store/session-atoms';
import { formatTime } from '../utils/format';

const PHASE_DURATION = 4;
const CYCLE_DURATION = PHASE_DURATION * 4; // 16s
const TOTAL_DURATION = CYCLE_DURATION * 5; // 5 cycles = 80 seconds

export default function BoxBreathingSession() {
  const savedState = useAtomValue(boxBreathingSessionAtom);
  const setSession = useSetAtom(boxBreathingSessionAtom);

  const initialTimeRef = useRef(savedState?.timeRemaining ?? TOTAL_DURATION);

  const [isPaused, setIsPaused] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const {
    sessionReady,
    countdown,
    instructionPlayer,
    skipToReady,
    skipToCountdown,
  } = useInstructionAudio({
    audioSource: boxBreathingInstructions,
    skipInstruction: savedState !== null,
    isPaused,
  });

  const { timeRemaining, setTimeRemaining, elapsed } = useSessionTimer({
    totalDuration: TOTAL_DURATION,
    initialTimeRemaining: initialTimeRef.current,
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

  // Phase audio players
  const inhalePlayer = useAudioPlayer(inhaleAudio);
  const holdPlayer = useAudioPlayer(holdAudio);
  const exhalePlayer = useAudioPlayer(exhaleAudio);
  const restPlayer = useAudioPlayer(restAudio);
  const bowlPlayer = useAudioPlayer(tibetanBowlAudio);

  // Set bowl volume
  useEffect(() => {
    bowlPlayer.volume = 0.8;
  }, [bowlPlayer]);

  // Mute/unmute all audio
  useEffect(() => {
    const vol = isMuted ? 0 : 1;
    const bowlVol = isMuted ? 0 : 0.8;
    instructionPlayer.volume = vol;
    inhalePlayer.volume = vol;
    holdPlayer.volume = vol;
    exhalePlayer.volume = vol;
    restPlayer.volume = vol;
    bowlPlayer.volume = bowlVol;
  }, [
    isMuted,
    instructionPlayer,
    inhalePlayer,
    holdPlayer,
    exhalePlayer,
    restPlayer,
    bowlPlayer,
  ]);

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
  const isFresh = (at: Date | null) =>
    at != null && Date.now() - at.getTime() < FRESH_MS;
  const hrvLive = isFresh(hrvAt) ? hrv : null;
  const hrLive = isFresh(heartRateAt) ? heartRate : null;
  const hrvMs = hrvLive != null ? Math.round(hrvLive) : null;
  const heartRateBpm = hrLive;
  const hasLiveData = hasAccess && (hrvMs != null || heartRateBpm != null);

  return (
    <Container safeAreaClass="bg-background-dark">
      <View className="flex-1 bg-background-dark">
        <GlowBg
          bgClassName="bg-background-dark"
          centerX={0.5}
          centerY={0.35}
          intensity={0.5}
          radius={0.35}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-10 flex-row items-center justify-between px-6 py-4">
          <BackButton />
          <Text className="text-lg font-bold tracking-tight text-white">
            Box Breathing
          </Text>
          <View className="h-11 w-11" />
        </View>

        {/* Breathing Visualization - centered */}
        <View className="z-10 flex-1 items-center justify-center">
          <BreathingBox
            elapsed={elapsed}
            isPaused={isPaused}
            isActive={sessionReady}
            countdown={countdown}
          />

          {/* Instruction text */}
          <View className="mt-8 items-center">
            <Text className="mb-4 text-xs font-medium tracking-wide text-white/40">
              MATCH YOUR BREATH TO THE SQUARE
            </Text>

            {/* Time cards */}
            <View className="flex-row gap-4">
              <View className="items-center rounded-2xl border border-white/5 bg-background-charcoal px-6 py-3">
                <Text className="mb-1 text-[10px] font-bold uppercase tracking-wider text-primary-pink">
                  Completed
                </Text>
                <Text
                  className="text-xl font-bold text-white/90"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {formatTime(elapsed)}
                </Text>
              </View>
              <View className="items-center rounded-2xl border border-white/5 bg-background-charcoal px-6 py-3">
                <Text className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent-yellow">
                  Goal
                </Text>
                <Text
                  className="text-xl font-bold text-white/90"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {formatTime(TOTAL_DURATION)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom HRV Card + Controls */}
        <View className="z-20 px-6 pb-6">
          <View
            className="rounded-[32px] border border-white/10 p-6"
            style={{ backgroundColor: colors.background.dark }}
          >
            {/* HRV Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <View
                  className="h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: withAlpha(colors.pink[400], 0.1) }}
                >
                  <MaterialIcons
                    name="monitor-heart"
                    size={18}
                    color={colors.primary.pink}
                  />
                </View>
                <View>
                  <Text className="text-xs font-bold text-white">
                    HRV Tracking
                  </Text>
                  <Text className="text-[10px] leading-none text-white/40">
                    {hasLiveData
                      ? 'Wearable Streaming'
                      : hasAccess
                        ? 'No recent samples'
                        : 'Wearable Not Connected'}
                  </Text>
                </View>
              </View>
              <View
                className={`flex-row items-center gap-2 rounded-full border px-2.5 py-1 ${
                  hasLiveData
                    ? 'border-green-500/20 bg-green-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <View
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasLiveData ? 'bg-green-500' : 'bg-white/30'
                  }`}
                />
                <Text
                  className={`text-[10px] font-bold uppercase ${
                    hasLiveData ? 'text-green-500' : 'text-white/40'
                  }`}
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
                  <Text className="text-3xl font-bold text-white">
                    {hrvMs != null ? hrvMs : '—'}
                  </Text>
                  <Text className="text-xs font-medium uppercase tracking-tighter text-primary-pink">
                    ms
                  </Text>
                </View>
                <View className="h-1.5 overflow-hidden rounded-full bg-white/5">
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
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Variability
                </Text>
              </View>

              {/* Heart Rate */}
              <View className="flex-1 items-end gap-2">
                <View className="flex-row items-baseline gap-1.5">
                  <Text className="text-3xl font-bold text-white">
                    {heartRateBpm != null ? heartRateBpm : '—'}
                  </Text>
                  <Text className="text-xs font-medium uppercase tracking-tighter text-accent-yellow">
                    bpm
                  </Text>
                </View>
                <View className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
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
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Heart Rate
                </Text>
              </View>
            </View>

            {/* Playback Controls */}
            <View className="mt-8 flex-row items-center justify-between border-t border-white/5 px-6 pt-6">
              {/* Mute button */}
              <Pressable
                onPress={() => setIsMuted((m) => !m)}
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
                onPress={() => setIsPaused((p) => !p)}
                className="active:scale-95"
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
                    shadowColor: colors.primary.pink,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                  }}
                >
                  <MaterialIcons
                    name={isPaused ? 'play-arrow' : 'pause'}
                    size={30}
                    color="white"
                  />
                </LinearGradient>
              </Pressable>

              {/* Restart button */}
              <Pressable
                onPress={handleRestart}
                className="h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] active:scale-90"
              >
                <MaterialIcons
                  name={sessionReady ? 'replay' : 'skip-next'}
                  size={24}
                  color={alpha.white60}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
