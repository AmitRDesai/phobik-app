import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BreathingCircle478 } from '../components/BreathingCircle478';
import { breathing478SessionAtom } from '../store/478-breathing';

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
  const router = useRouter();
  const navigation = useNavigation();
  const savedState = useAtomValue(breathing478SessionAtom);
  const setSession = useSetAtom(breathing478SessionAtom);

  const initialTimeRef = useRef(savedState?.timeRemaining ?? TOTAL_DURATION);

  const [timeRemaining, setTimeRemaining] = useState(initialTimeRef.current);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [instructionDone, setInstructionDone] = useState(
    savedState !== null, // skip instruction if resuming
  );
  const [sessionReady, setSessionReady] = useState(savedState !== null);
  const [countdown, setCountdown] = useState<number | undefined>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = TOTAL_DURATION - timeRemaining;

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

  // Instruction audio
  const instructionPlayer = useAudioPlayer(
    require('@/assets/audio/practices/478-breathing-session/instructions.mp3'),
  );
  const instructionStatus = useAudioPlayerStatus(instructionPlayer);

  // Phase audio players
  const inhalePlayer = useAudioPlayer(
    require('@/assets/audio/practices/common/inhale.mp3'),
  );
  const holdPlayer = useAudioPlayer(
    require('@/assets/audio/practices/common/hold.mp3'),
  );
  const exhalePlayer = useAudioPlayer(
    require('@/assets/audio/practices/common/exhale.mp3'),
  );
  const bowlPlayer = useAudioPlayer(
    require('@/assets/audio/practices/common/tibetan-bowl.mp3'),
  );

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

  // Start instruction audio on mount (skip if resuming)
  useEffect(() => {
    if (!instructionDone) {
      instructionPlayer.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructionPlayer]);

  // Detect when instruction audio finishes naturally
  useEffect(() => {
    if (
      !instructionDone &&
      instructionStatus.duration > 0 &&
      instructionStatus.currentTime >= instructionStatus.duration &&
      !instructionStatus.playing
    ) {
      setInstructionDone(true);
    }
  }, [
    instructionDone,
    instructionStatus.playing,
    instructionStatus.currentTime,
    instructionStatus.duration,
  ]);

  // 3-second countdown after instruction before starting the exercise
  useEffect(() => {
    if (!instructionDone || sessionReady) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === undefined || prev <= 1) {
          clearInterval(interval);
          setSessionReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [instructionDone, sessionReady]);

  // Sync instruction audio with pause state
  useEffect(() => {
    if (isPaused) {
      instructionPlayer.pause();
    } else if (!instructionDone) {
      instructionPlayer.play();
    }
  }, [isPaused, instructionPlayer, instructionDone]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (sessionReady && timeRemaining > 0) {
        setSession({ timeRemaining });
      }
    });
    return unsubscribe;
  }, [sessionReady, timeRemaining, navigation, setSession]);

  // Complete session when timer reaches zero
  useEffect(() => {
    if (timeRemaining === 0) {
      setSession(null);
      router.replace('/practices/completion');
    }
  }, [timeRemaining, setSession, router]);

  // Timer only runs after session is ready
  useEffect(() => {
    if (isPaused || !sessionReady) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, sessionReady]);

  // Restart the session (skip instruction, start breathing immediately)
  const handleRestart = () => {
    setTimeRemaining(TOTAL_DURATION);
    setIsPaused(false);
    setInstructionDone(true);
    setSessionReady(true);
    setCountdown(undefined);
    setSession(null);
  };

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
              <MaterialIcons name="replay" size={24} color={alpha.white60} />
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
                    textShadowColor: 'rgba(244,63,94,0.5)',
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
                  72
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
                    textShadowColor: 'rgba(234,179,8,0.5)',
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
                  74
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
