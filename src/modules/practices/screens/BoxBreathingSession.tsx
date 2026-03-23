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

import { BreathingBox } from '../components/BreathingBox';
import { boxBreathingSessionAtom } from '../store/box-breathing';

const PHASE_DURATION = 4;
const CYCLE_DURATION = PHASE_DURATION * 4; // 16s
const TOTAL_DURATION = CYCLE_DURATION * 5; // 5 cycles = 80 seconds

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function BoxBreathingSession() {
  const router = useRouter();
  const navigation = useNavigation();
  const savedState = useAtomValue(boxBreathingSessionAtom);
  const setSession = useSetAtom(boxBreathingSessionAtom);

  const initialTimeRef = useRef(savedState?.timeRemaining ?? TOTAL_DURATION);

  const [timeRemaining, setTimeRemaining] = useState(initialTimeRef.current);
  const [isPaused, setIsPaused] = useState(false);
  const [instructionDone, setInstructionDone] = useState(
    savedState !== null, // skip instruction if resuming
  );
  const [sessionReady, setSessionReady] = useState(savedState !== null);
  const [countdown, setCountdown] = useState<number | undefined>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = TOTAL_DURATION - timeRemaining;

  // Breathing phase (derived from elapsed)
  const cyclePosition = elapsed % CYCLE_DURATION;
  const phaseIndex = Math.floor(cyclePosition / PHASE_DURATION);

  // Go to previous phase start (backward)
  const handleBackward = () => {
    const timeIntoPhase = cyclePosition - phaseIndex * PHASE_DURATION;
    const jumpBack = timeIntoPhase + PHASE_DURATION;
    setTimeRemaining((prev) => Math.min(prev + jumpBack, TOTAL_DURATION));
  };

  // Go to next phase start (forward)
  const handleForward = () => {
    const timeLeftInPhase =
      PHASE_DURATION - (cyclePosition - phaseIndex * PHASE_DURATION);
    setTimeRemaining((prev) => Math.max(prev - timeLeftInPhase, 0));
  };

  // Instruction audio
  const instructionPlayer = useAudioPlayer(
    require('@/assets/audio/practices/box-breathing-session/instructions.mp3'),
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
  const restPlayer = useAudioPlayer(
    require('@/assets/audio/practices/common/rest.mp3'),
  );
  const bowlPlayer = useAudioPlayer(
    require('@/assets/audio/practices/common/tibetan-bowl.mp3'),
  );

  // Set bowl volume
  useEffect(() => {
    bowlPlayer.volume = 0.8;
  }, [bowlPlayer]);

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

    const players = [inhalePlayer, holdPlayer, exhalePlayer, restPlayer];
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

  // Mock HRV data (would come from biometric sensor in production)
  const hrvMs = 72;
  const heartRateBpm = 64;

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
            style={{ backgroundColor: '#0d0d0f' }}
          >
            {/* HRV Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <View
                  className="h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}
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
                    Optical Sensor Active
                  </Text>
                </View>
              </View>
              <View
                className="flex-row items-center gap-2 rounded-full border px-2.5 py-1"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  borderColor: 'rgba(34, 197, 94, 0.2)',
                }}
              >
                <View className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <Text className="text-[10px] font-bold uppercase text-green-500">
                  Synced
                </Text>
              </View>
            </View>

            {/* HRV Stats Grid */}
            <View className="flex-row gap-6">
              {/* Variability */}
              <View className="flex-1 gap-2">
                <View className="flex-row items-baseline gap-1.5">
                  <Text className="text-3xl font-bold text-white">{hrvMs}</Text>
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
                      width: `${hrvMs}%`,
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
                    {heartRateBpm}
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
                        width: `${heartRateBpm}%`,
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
            <View className="mt-8 items-center border-t border-white/5 pt-6">
              <View className="flex-row items-center gap-8">
                <Pressable
                  onPress={handleBackward}
                  className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
                >
                  <MaterialIcons
                    name="replay-5"
                    size={24}
                    color={alpha.white40}
                  />
                </Pressable>

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
                      color={colors.background.charcoal}
                    />
                  </LinearGradient>
                </Pressable>

                <Pressable
                  onPress={handleForward}
                  className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
                >
                  <MaterialIcons
                    name="forward-5"
                    size={24}
                    color={alpha.white40}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
