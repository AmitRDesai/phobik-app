import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BreathingInfinity } from '../components/BreathingInfinity';

const TOTAL_DURATION = 5 * 60; // 5 minutes per design

const BREATHING_PHASES = ['Inhale', 'Exhale'] as const;
const PHASE_DURATIONS = [4, 4]; // 4s inhale (right loop), 4s exhale (left loop)
const PHASE_TOTAL = PHASE_DURATIONS.reduce((a, b) => a + b, 0);

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Lazy8BreathingSession() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = TOTAL_DURATION - timeRemaining;
  const overallProgress = elapsed / TOTAL_DURATION;

  // Breathing phase calculation
  const cyclePosition = elapsed % PHASE_TOTAL;
  let accumulated = 0;
  let currentPhaseIndex = 0;
  for (let i = 0; i < PHASE_DURATIONS.length; i++) {
    accumulated += PHASE_DURATIONS[i];
    if (cyclePosition < accumulated) {
      currentPhaseIndex = i;
      break;
    }
  }
  const currentPhase = BREATHING_PHASES[currentPhaseIndex];

  const handleComplete = useCallback(() => {
    router.replace('/practices/completion');
  }, [router]);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, handleComplete]);

  const handleRewind = () => {
    setTimeRemaining((prev) => Math.min(prev + 15, TOTAL_DURATION));
  };

  const handleForward = () => {
    setTimeRemaining((prev) => {
      const next = prev - 15;
      if (next <= 0) {
        handleComplete();
        return 0;
      }
      return next;
    });
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
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center active:opacity-70"
          >
            <MaterialIcons name="close" size={24} color="white" />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-white">
            Lazy 8 Breathing
          </Text>
          <Pressable className="h-12 w-12 items-center justify-center active:opacity-70">
            <MaterialIcons name="settings" size={24} color="white" />
          </Pressable>
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
            <BreathingInfinity isPaused={isPaused} />
          </View>

          {/* Progress bar */}
          <View
            className="mb-0 w-full max-w-xs overflow-hidden rounded-full border border-white/5"
            style={{ height: 6 }}
          >
            <LinearGradient
              colors={[
                colors.primary.pink,
                colors.accent.yellow,
                colors.primary.pink,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: '100%',
                width: `${overallProgress * 100}%`,
                borderRadius: 99,
              }}
            />
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
                color="rgba(255,255,255,0.7)"
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
                color="rgba(255,255,255,0.7)"
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
                  <MaterialIcons name="favorite" size={20} color="#fb7185" />
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
                  <MaterialIcons name="waves" size={20} color="#facc15" />
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
