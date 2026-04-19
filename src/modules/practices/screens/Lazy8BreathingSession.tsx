import exhaleAudio from '@/assets/audio/practices/common/exhale.mp3';
import inhaleAudio from '@/assets/audio/practices/common/inhale.mp3';
import tibetanBowlAudio from '@/assets/audio/practices/common/tibetan-bowl.mp3';
import lazy8Instructions from '@/assets/audio/practices/lazy-8-breathing-session/instructions.mp3';
import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
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
import { useInstructionAudio } from '../hooks/useInstructionAudio';
import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { lazy8BreathingSessionAtom } from '../store/session-atoms';
import { formatTime } from '../utils/format';

const CYCLE_DURATION = 8; // 4s inhale + 4s exhale
const TOTAL_DURATION = CYCLE_DURATION * 5; // 5 cycles = 40s
const INHALE_END = 4;

function StatsCard() {
  return (
    <View className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-4">
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
              backgroundColor: withAlpha(colors.yellow[500], 0.2),
              borderWidth: 1,
              borderColor: withAlpha(colors.yellow[500], 0.3),
            }}
          >
            <MaterialIcons name="waves" size={20} color={colors.yellow[400]} />
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
  return (
    <View className="mb-8 flex-row items-center justify-center gap-8">
      <Pressable
        onPress={onMuteToggle}
        className="h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
      >
        <MaterialIcons
          name={isMuted ? 'volume-off' : 'volume-up'}
          size={24}
          color={alpha.white70}
        />
      </Pressable>
      <Pressable
        onPress={onPauseToggle}
        className="h-14 w-14 items-center justify-center rounded-full bg-white active:scale-95"
        style={{
          boxShadow: [
            {
              offsetX: 0,
              offsetY: 2,
              blurRadius: 8,
              color: 'rgba(255, 255, 255, 0.3)',
            },
          ],
        }}
      >
        <MaterialIcons
          name={isPaused ? 'play-arrow' : 'pause'}
          size={28}
          color={colors.background.dark}
        />
      </Pressable>
      <Pressable
        onPress={onRestart}
        className="h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
      >
        <MaterialIcons
          name={sessionReady ? 'replay' : 'skip-next'}
          size={24}
          color={alpha.white70}
        />
      </Pressable>
    </View>
  );
}

export default function Lazy8BreathingSession() {
  const savedState = useAtomValue(lazy8BreathingSessionAtom);
  const setSession = useSetAtom(lazy8BreathingSessionAtom);

  const initialTimeRef = useRef(savedState?.timeRemaining ?? TOTAL_DURATION);

  const [isPaused, setIsPaused] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');

  const [isMuted, setIsMuted] = useState(false);

  const {
    sessionReady,
    countdown,
    instructionDone,
    instructionPlayer,
    skipToReady,
    skipToCountdown,
  } = useInstructionAudio({
    audioSource: lazy8Instructions,
    skipInstruction: savedState !== null,
    isPaused,
  });

  const {
    timeRemaining,
    setTimeRemaining,
    elapsed,
    progress: overallProgress,
  } = useSessionTimer({
    totalDuration: TOTAL_DURATION,
    initialTimeRemaining: initialTimeRef.current,
    isPaused,
    sessionReady,
    practiceType: 'lazy8-breathing',
    onComplete: () => setSession(null),
  });

  // Animated progress bar
  const animatedProgress = useSharedValue(overallProgress);
  useEffect(() => {
    animatedProgress.value = withTiming(overallProgress, {
      duration: 1000,
      easing: Easing.linear,
    });
  }, [overallProgress]);
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

  // Phase audio players
  const inhalePlayer = useAudioPlayer(inhaleAudio);
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
    exhalePlayer.volume = vol;
    bowlPlayer.volume = bowlVol;
  }, [isMuted, instructionPlayer, inhalePlayer, exhalePlayer, bowlPlayer]);

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
              key={restartKey}
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
          <PlaybackControls
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
        </ScrollView>
      </View>
    </Container>
  );
}
