import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors } from '@/constants/colors';
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

import { BreathingStar } from '../components/BreathingStar';
import { useInstructionAudio } from '../hooks/useInstructionAudio';
import { useSaveOnLeave } from '../hooks/useSaveOnLeave';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { starBreathingSessionAtom } from '../store/session-atoms';
import { formatTime } from '../utils/format';

const TOTAL_DURATION = 50; // one full star orbit (5 breathing cycles)

// Star breathing phase boundaries (must match BreathingStar.tsx)
const INHALE_END = 4;
const HOLD_END = 6;
const CYCLE_DURATION = 10;

export default function StarBreathingSession() {
  const savedState = useAtomValue(starBreathingSessionAtom);
  const setSession = useSetAtom(starBreathingSessionAtom);

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
    audioSource: require('@/assets/audio/practices/star-breathing-session/instructions.mp3'),
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
    onComplete: () => setSession(null),
  });

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

  // Play phase audio on phase changes
  useEffect(() => {
    if (!sessionReady || isPaused) return;

    const players = [inhalePlayer, holdPlayer, exhalePlayer];
    const currentPlayer = players[phaseIndex];
    currentPlayer.seekTo(0);
    currentPlayer.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, sessionReady, isPaused]);

  // Pause phase audio when session is paused
  useEffect(() => {
    if (isPaused) {
      inhalePlayer.pause();
      holdPlayer.pause();
      exhalePlayer.pause();
    }
  }, [isPaused, inhalePlayer, holdPlayer, exhalePlayer]);

  // Mute/unmute all audio
  useEffect(() => {
    const vol = isMuted ? 0 : 1;
    instructionPlayer.volume = vol;
    inhalePlayer.volume = vol;
    holdPlayer.volume = vol;
    exhalePlayer.volume = vol;
  }, [isMuted, instructionPlayer, inhalePlayer, holdPlayer, exhalePlayer]);

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
    <Container safeAreaClass="bg-black">
      <View className="flex-1 bg-black">
        <GlowBg
          bgClassName="bg-black"
          centerX={0.5}
          centerY={0.4}
          intensity={0.8}
          radius={0.35}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-50 px-6 pb-4 pt-2">
          <View className="mb-4 flex-row items-center justify-between">
            <BackButton icon="close" />
            <View className="items-center">
              <Text className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                Star Breathing
              </Text>
              <Text
                className="text-xl font-medium text-white"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatTime(timeRemaining)}
              </Text>
            </View>
            <View className="h-11 w-11" />
          </View>
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="z-10 flex-1"
          contentContainerClassName="items-center px-6 pb-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Breathing instruction — fixed height to prevent layout shifts */}
          <View className="items-center px-2 pt-4" style={{ height: 100 }}>
            <Text className="mb-3 text-center text-5xl font-semibold tracking-tight text-white">
              {currentPhase}
            </Text>
            <Text className="text-center text-sm font-medium text-white/40">
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
                savedState ? TOTAL_DURATION - initialTimeRef.current : 0
              }
            />
          </View>

          {/* Progress bar */}
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
          <View className="mb-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <Text className="text-center text-[15px] font-medium leading-relaxed text-white/90">
              Trace the star&#39;s edges with your breath. Inhale and exhale
              along the lines, hold at each point.
            </Text>
          </View>

          {/* Playback controls */}
          <View className="mb-8 flex-row items-center justify-center gap-8">
            <Pressable
              onPress={() => setIsMuted((m) => !m)}
              className="h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
            >
              <MaterialIcons
                name={isMuted ? 'volume-off' : 'volume-up'}
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
              onPress={handleRestart}
              className="h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
            >
              <MaterialIcons
                name={sessionReady ? 'replay' : 'skip-next'}
                size={24}
                color={alpha.white70}
              />
            </Pressable>
          </View>

          {/* HRV + Stats card */}
          <View className="mb-6 w-full rounded-[32px] border border-white/[0.08] bg-white/[0.03] p-6">
            {/* HRV header */}
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <LinearGradient
                  colors={['rgba(244,37,106,0.2)', 'rgba(250,204,21,0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.05)',
                  }}
                >
                  <MaterialIcons
                    name="favorite"
                    size={24}
                    color={colors.primary.pink}
                  />
                </LinearGradient>
                <View>
                  <Text className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Heart Rate Variability
                  </Text>
                  <View className="flex-row items-baseline gap-2">
                    <Text className="text-lg font-semibold text-white">
                      64ms
                    </Text>
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="arrow-upward"
                        size={14}
                        color={colors.emerald[400]}
                      />
                      <Text className="text-xs font-bold text-emerald-400">
                        12%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* Mini chart bars */}
              <View className="h-10 flex-row items-end gap-1.5 pr-2">
                {[0.4, 0.6, 1, 0.8, 0.6, 0.4].map((h, i) => (
                  <View
                    key={i}
                    className="w-1.5 rounded-full"
                    style={{
                      height: `${h * 100}%`,
                      backgroundColor:
                        i < 3
                          ? `rgba(244,37,106,${0.2 + i * 0.3})`
                          : `rgba(250,204,21,${1 - (i - 3) * 0.3})`,
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Stats grid */}
            <View className="flex-row gap-4">
              <View className="flex-1 rounded-2xl border border-white/5 bg-white/[0.04] p-4">
                <Text className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-yellow/50">
                  Stress Level
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="h-2 w-2 rounded-full bg-emerald-400" />
                  <Text className="text-sm font-semibold text-white">Low</Text>
                </View>
              </View>
              <View className="flex-1 rounded-2xl border border-white/5 bg-white/[0.04] p-4">
                <Text className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-pink/50">
                  Sync Status
                </Text>
                <View className="flex-row items-center gap-2">
                  <View
                    className="h-2 w-2 rounded-full bg-emerald-400"
                    style={{
                      shadowColor: colors.emerald[400],
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 1,
                      shadowRadius: 8,
                    }}
                  />
                  <Text className="text-sm font-semibold text-white">
                    Live Tracking
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
