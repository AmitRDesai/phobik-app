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
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { BreathingInfinity } from '../components/BreathingInfinity';
import { lazy8BreathingSessionAtom } from '../store/lazy-8-breathing';

const CYCLE_DURATION = 8; // 4s inhale + 4s exhale
const TOTAL_DURATION = CYCLE_DURATION * 5; // 5 cycles = 40s
const INHALE_END = 4;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Lazy8BreathingSession() {
  const router = useRouter();
  const navigation = useNavigation();
  const savedState = useAtomValue(lazy8BreathingSessionAtom);
  const setSession = useSetAtom(lazy8BreathingSessionAtom);

  const initialTimeRef = useRef(savedState?.timeRemaining ?? TOTAL_DURATION);

  const [timeRemaining, setTimeRemaining] = useState(initialTimeRef.current);
  const [isPaused, setIsPaused] = useState(false);
  const [instructionDone, setInstructionDone] = useState(
    savedState !== null, // skip instruction if resuming
  );
  const [sessionReady, setSessionReady] = useState(savedState !== null);
  const [countdown, setCountdown] = useState<number | undefined>(undefined);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = TOTAL_DURATION - timeRemaining;
  const overallProgress = elapsed / TOTAL_DURATION;

  // Animated progress bar
  const animatedProgress = useSharedValue(overallProgress);
  useEffect(() => {
    animatedProgress.value = withTiming(overallProgress, {
      duration: 1000,
      easing: Easing.linear,
    });
  }, [overallProgress, animatedProgress]);
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

  // Audio player for instructions
  const player = useAudioPlayer(
    require('@/assets/audio/practices/lazy-8-breathing-session/instructions.mp3'),
  );
  const status = useAudioPlayerStatus(player);

  // Phase audio players
  const inhalePlayer = useAudioPlayer(
    require('@/assets/audio/practices/common/inhale.mp3'),
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

  // Start instruction audio on mount (skip if resuming)
  useEffect(() => {
    if (!instructionDone) {
      player.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  // Detect when instruction audio finishes naturally
  useEffect(() => {
    if (
      !instructionDone &&
      status.duration > 0 &&
      status.currentTime >= status.duration &&
      !status.playing
    ) {
      setInstructionDone(true);
    }
  }, [instructionDone, status.playing, status.currentTime, status.duration]);

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
      player.pause();
    } else if (!instructionDone) {
      player.play();
    }
  }, [isPaused, player, instructionDone]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, sessionReady, isPaused]);

  // Pause phase audio when session is paused
  useEffect(() => {
    if (isPaused) {
      inhalePlayer.pause();
      exhalePlayer.pause();
      bowlPlayer.pause();
    }
  }, [isPaused, inhalePlayer, exhalePlayer, bowlPlayer]);

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

  const handleRewind = () => {};

  const handleForward = () => {};

  return (
    <Container safeAreaClass="bg-background-dark">
      <View className="flex-1 bg-background-dark">
        <GlowBg
          bgClassName="bg-background-dark"
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
          <Text className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-white">
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
            <Text className="text-5xl font-semibold tracking-wider text-white">
              {currentPhase}
            </Text>
            <Text className="mt-3 text-sm font-medium uppercase tracking-widest text-slate-400">
              Focus on the light
            </Text>
          </View>

          {/* Infinity visualization */}
          <View className="mb-8 w-full items-center">
            <BreathingInfinity
              isActive={sessionReady}
              isPaused={isPaused}
              onPhaseChange={setBreathPhase}
              initialElapsed={
                savedState ? TOTAL_DURATION - initialTimeRef.current : 0
              }
            />
          </View>

          {/* Progress bar — star breathing gradient style */}
          <View
            className="mb-0 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.08]"
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
            className="mb-6 mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}
          </Text>

          {/* Instruction card */}
          <View className="mb-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5">
            <Text className="text-center text-sm font-medium leading-relaxed text-white/90">
              Follow the path with your eyes, inhale as it moves right, exhale
              as it moves left. Relax, breathe slowly, and repeat the loop.
            </Text>
          </View>

          {/* Playback controls */}
          <View className="mb-8 flex-row items-center justify-center gap-8">
            <Pressable
              onPress={handleRewind}
              className="h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
            >
              <MaterialIcons
                name="fast-rewind"
                size={24}
                color={alpha.white70}
              />
            </Pressable>
            <Pressable
              onPress={() => setIsPaused((p) => !p)}
              className="h-14 w-14 items-center justify-center rounded-full bg-white active:scale-95"
              style={{
                shadowColor: '#fff',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <MaterialIcons
                name={isPaused ? 'play-arrow' : 'pause'}
                size={28}
                color={colors.background.dark}
              />
            </Pressable>
            <Pressable
              onPress={handleForward}
              className="h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
            >
              <MaterialIcons
                name="fast-forward"
                size={24}
                color={alpha.white70}
              />
            </Pressable>
          </View>

          {/* Bottom stats card */}
          <View className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-4">
            <View className="flex-row items-center justify-between px-1">
              {/* Heart Rate */}
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: 'rgba(244,63,94,0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(244,63,94,0.3)',
                  }}
                >
                  <MaterialIcons
                    name="favorite"
                    size={20}
                    color={colors.rose[400]}
                  />
                </View>
                <View>
                  <Text className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Heart Rate
                  </Text>
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-xl font-bold tracking-tighter text-white">
                      72
                    </Text>
                    <Text className="text-[9px] font-bold uppercase text-pink-400">
                      BPM
                    </Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View className="h-8 w-px bg-white/10" />

              {/* HRV */}
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: 'rgba(234,179,8,0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(234,179,8,0.3)',
                  }}
                >
                  <MaterialIcons
                    name="waves"
                    size={20}
                    color={colors.yellow[400]}
                  />
                </View>
                <View>
                  <Text className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    HRV
                  </Text>
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-xl font-bold tracking-tighter text-white">
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
        </ScrollView>
      </View>
    </Container>
  );
}
