import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BreathingStar } from '../components/BreathingStar';

const TOTAL_DURATION = 5 * 60; // 5 minutes

const BREATHING_PHASES = ['Breathe in', 'Hold', 'Breathe out', 'Hold'] as const;
const PHASE_DURATIONS = [4, 1, 4, 1]; // seconds per phase
const PHASE_TOTAL = PHASE_DURATIONS.reduce((a, b) => a + b, 0);

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function StarBreathingSession() {
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
        <View className="z-20 px-6 pb-4 pt-2">
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
            <Pressable
              onPress={() => setIsPaused((p) => !p)}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 active:scale-95"
            >
              <MaterialIcons name="settings" size={22} color={alpha.white70} />
            </Pressable>
          </View>
          {/* Progress bar */}
          <View className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: '100%',
                width: `${overallProgress * 100}%`,
                borderRadius: 99,
              }}
            />
          </View>
        </View>

        {/* Breathing instruction — fixed height to prevent layout shifts */}
        <View className="z-10 items-center px-8 pt-4" style={{ height: 100 }}>
          <Text className="mb-3 text-center text-5xl font-semibold tracking-tight text-white">
            {currentPhase}
          </Text>
          <Text className="text-center text-sm font-medium text-white/40">
            Follow the light around the star
          </Text>
        </View>

        {/* Star visualization */}
        <View className="z-10 flex-1 items-center justify-center">
          <BreathingStar />
        </View>

        {/* Bottom info cards */}
        <ScrollView
          horizontal={false}
          contentContainerClassName="px-6 gap-4 pb-6"
          showsVerticalScrollIndicator={false}
          className="z-20 max-h-[220px]"
        >
          {/* Instruction card */}
          <View className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <Text className="text-center text-[15px] font-medium leading-relaxed text-white/90">
              Trace the star's edges with your breath. Inhale and exhale along
              the lines, hold at each point.
            </Text>
          </View>

          {/* HRV + Stats card */}
          <View className="rounded-[32px] border border-white/[0.08] bg-white/[0.03] p-6">
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
