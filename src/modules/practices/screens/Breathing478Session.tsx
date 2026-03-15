import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { BreathingCircle478 } from '../components/BreathingCircle478';

const TOTAL_CYCLES = 4;
const INHALE = 4;
const HOLD = 7;
const EXHALE = 8;
const CYCLE_DURATION = INHALE + HOLD + EXHALE; // 19 seconds
const TOTAL_DURATION = TOTAL_CYCLES * CYCLE_DURATION; // 76 seconds for 4 cycles

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

function getCurrentPhaseIndex(elapsed: number): number {
  const cyclePosition = elapsed % CYCLE_DURATION;
  if (cyclePosition < INHALE) return 0;
  if (cyclePosition < INHALE + HOLD) return 1;
  return 2;
}

export default function Breathing478Session() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhaseIndex = getCurrentPhaseIndex(elapsed);
  const currentPhase = BREATHING_PHASES[currentPhaseIndex];
  const currentSubtext = PHASE_SUBTEXTS[currentPhaseIndex];

  const handleComplete = useCallback(() => {
    router.replace('/practices/completion');
  }, [router]);

  const handleReset = useCallback(() => {
    setElapsed(0);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= TOTAL_DURATION - 1) {
          clearInterval(intervalRef.current!);
          handleComplete();
          return TOTAL_DURATION;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, handleComplete]);

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
        <View className="z-20 flex-row items-center justify-between px-6 pt-2 pb-2">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
          >
            <MaterialIcons name="close" size={24} color={alpha.white80} />
          </Pressable>
          <View className="items-center">
            <Text className="text-[11px] font-black uppercase tracking-[0.25em] text-primary-pink">
              4-7-8 Breathing
            </Text>
            <View className="mt-1 flex-row items-center gap-1.5">
              <View
                className="h-1.5 w-1.5 rounded-full bg-accent-yellow"
                style={{
                  shadowColor: colors.accent.yellow,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
              <Text className="text-[9px] font-bold uppercase tracking-widest text-accent-yellow/90">
                Biometric Syncing
              </Text>
            </View>
          </View>
          <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-white/5 active:bg-white/10">
            <MaterialIcons name="settings" size={24} color={alpha.white80} />
          </Pressable>
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
          <BreathingCircle478 elapsed={elapsed} isPaused={isPaused} />
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

          {/* Controls row: volume, pause, replay */}
          <View className="mb-8 flex-row items-center justify-between px-6">
            {/* Volume button */}
            <Pressable className="h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] active:scale-90">
              <MaterialIcons name="volume-up" size={24} color={alpha.white60} />
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

            {/* Replay button */}
            <Pressable
              onPress={handleReset}
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
