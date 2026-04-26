import breathing478Instructions from '@/assets/audio/practices/478-breathing-session/instructions.mp3';
import exhaleAudio from '@/assets/audio/practices/common/exhale.mp3';
import holdAudio from '@/assets/audio/practices/common/hold.mp3';
import inhaleAudio from '@/assets/audio/practices/common/inhale.mp3';
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
  const savedState = useAtomValue(breathing478SessionAtom);
  const setSession = useSetAtom(breathing478SessionAtom);

  const initialTimeRef = useRef(savedState?.timeRemaining ?? TOTAL_DURATION);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const {
    sessionReady,
    countdown,
    instructionDone,
    instructionPlayer,
    skipToReady,
    skipToCountdown,
  } = useInstructionAudio({
    audioSource: breathing478Instructions,
    skipInstruction: savedState !== null,
    isPaused,
  });

  const { timeRemaining, setTimeRemaining, elapsed } = useSessionTimer({
    totalDuration: TOTAL_DURATION,
    initialTimeRemaining: initialTimeRef.current,
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

  // Phase audio players
  const inhalePlayer = useAudioPlayer(inhaleAudio);
  const holdPlayer = useAudioPlayer(holdAudio);
  const exhalePlayer = useAudioPlayer(exhaleAudio);
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
    bowlPlayer.volume = bowlVol;
  }, [
    isMuted,
    instructionPlayer,
    inhalePlayer,
    holdPlayer,
    exhalePlayer,
    bowlPlayer,
  ]);

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
  const isFresh = (at: Date | null) =>
    at != null && Date.now() - at.getTime() < FRESH_MS;
  const liveHr = isFresh(heartRateAt) ? heartRate : null;
  const liveHrv = isFresh(hrvAt) ? hrv : null;

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

        {/* Header */}
        <View className="z-10 flex-row items-center justify-between px-6 py-4">
          <BackButton />
          <Text className="text-lg font-bold tracking-tight text-white">
            4-7-8 Breathing
          </Text>
          <View className="h-11 w-11" />
        </View>

        {/* Breathing instruction text — fixed height to prevent layout shifts */}
        <View className="z-10 mt-2 items-center px-8" style={{ height: 100 }}>
          <Text className="mb-2 text-center text-4xl font-light tracking-tight text-white">
            {currentPhase}
          </Text>
          <Text className="mx-auto max-w-[280px] text-center text-sm leading-relaxed text-slate-400">
            {currentSubtext}
          </Text>
        </View>

        {/* Circular visualization - flex to fill available space */}
        <View className="z-10 flex-1 items-center justify-center">
          <BreathingCircle478
            elapsed={elapsed}
            isPaused={isPaused}
            isActive={sessionReady}
            phaseIndex={phaseIndex}
          />
        </View>

        {/* Bottom section */}
        <View className="z-20 px-6">
          {/* Instruction card */}
          <View className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
            <Text className="text-center text-[13px] font-medium leading-relaxed text-slate-200">
              Inhale for 4 seconds, hold your breath for 7 seconds, and exhale
              for 8 seconds. Repeat this cycle 4 times.
            </Text>
          </View>

          {/* Controls row: mute, pause, restart */}
          <View className="mb-8 flex-row items-center justify-between px-6">
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
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  padding: 2,
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 30,
                }}
              >
                <View className="flex-1 items-center justify-center rounded-full bg-black/40">
                  <MaterialIcons
                    name={isPaused ? 'play-arrow' : 'pause'}
                    size={36}
                    color="white"
                  />
                </View>
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

          {/* Stats cards row */}
          <View className="mb-4 flex-row gap-4">
            {/* Heart Rate card */}
            <View className="flex-1 rounded-[32px] border border-white/[0.08] bg-white/[0.04] p-5">
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
                <Text className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Heart Rate
                </Text>
              </View>
              <View className="mt-1 flex-row items-baseline gap-1">
                <Text
                  className="text-2xl font-semibold text-white"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {liveHr != null ? liveHr : '—'}
                </Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  BPM
                </Text>
              </View>
            </View>

            {/* HRV card */}
            <View className="flex-1 rounded-[32px] border border-white/[0.08] bg-white/[0.04] p-5">
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
                <Text className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">
                  HRV
                </Text>
              </View>
              <View className="mt-1 flex-row items-baseline gap-1">
                <Text
                  className="text-2xl font-semibold text-white"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {liveHrv != null ? Math.round(liveHrv) : '—'}
                </Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  MS
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
