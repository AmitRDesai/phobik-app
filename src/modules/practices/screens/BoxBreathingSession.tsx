import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BreathingBox } from '../components/BreathingBox';

const GOAL_DURATION = 10 * 60; // 10 minutes in seconds

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function BoxBreathingSession() {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleComplete = useCallback(() => {
    router.replace('/practices/completion' as never);
  }, [router]);

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= GOAL_DURATION - 1) {
          clearInterval(intervalRef.current!);
          handleComplete();
          return GOAL_DURATION;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, handleComplete]);

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
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 active:scale-95"
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color="rgba(255,255,255,0.8)"
            />
          </Pressable>
          <View className="items-center">
            <Text className="text-lg font-bold tracking-tight text-white">
              Box Breathing
            </Text>
            <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-pink">
              Biometric Sync
            </Text>
          </View>
          <Pressable className="h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 active:scale-95">
            <MaterialIcons
              name="more-horiz"
              size={24}
              color="rgba(255,255,255,0.8)"
            />
          </Pressable>
        </View>

        {/* Breathing Visualization - centered */}
        <View className="z-10 flex-1 items-center justify-center">
          <BreathingBox elapsed={elapsed} isPaused={isPaused} />

          {/* Instruction text */}
          <View className="mt-20 items-center">
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
                  {formatTime(GOAL_DURATION)}
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
                <Pressable className="h-10 w-10 items-center justify-center rounded-full active:opacity-70">
                  <MaterialIcons
                    name="replay-5"
                    size={24}
                    color="rgba(255,255,255,0.4)"
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
                      color="#121214"
                    />
                  </LinearGradient>
                </Pressable>

                <Pressable className="h-10 w-10 items-center justify-center rounded-full active:opacity-70">
                  <MaterialIcons
                    name="forward-5"
                    size={24}
                    color="rgba(255,255,255,0.4)"
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
