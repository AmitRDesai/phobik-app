import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { DashboardCard } from './DashboardCard';
import { EnergyRing } from './EnergyRing';

function PingDot() {
  const opacity = useSharedValue(0.75);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000 }),
        withDelay(200, withTiming(0.75, { duration: 0 })),
      ),
      -1,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 1000 }),
        withDelay(200, withTiming(1, { duration: 0 })),
      ),
      -1,
    );
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="relative h-2 w-2">
      <Animated.View
        className="absolute h-full w-full rounded-full bg-accent-yellow"
        style={animatedStyle}
      />
      <View className="h-2 w-2 rounded-full bg-accent-yellow" />
    </View>
  );
}

export function RealTimeAnalysisCard() {
  return (
    <DashboardCard glow>
      {/* Radial glow at top-right */}
      <GlowBg
        centerX={1}
        centerY={0}
        intensity={1}
        radius={0.35}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        bgClassName="bg-transparent"
      />

      {/* Header row */}
      <View className="mb-6 flex-row items-start justify-between">
        <View>
          <View className="mb-1 flex-row items-center gap-1.5">
            <PingDot />
            <Text className="text-[10px] font-bold uppercase tracking-widest text-accent-yellow">
              Real-time Analysis
            </Text>
          </View>
          <Text className="text-2xl font-bold tracking-tight text-white">
            Peaceful
          </Text>
        </View>
        <Pressable className="flex-row items-center gap-1.5 rounded-full border border-primary-pink/30 bg-primary-pink/20 px-4 py-1.5">
          <MaterialIcons name="watch" size={14} color={colors.primary.pink} />
          <Text className="text-[10px] font-bold uppercase tracking-wider text-primary-pink">
            Connect
          </Text>
        </Pressable>
      </View>

      {/* Ring + metrics */}
      <View className="flex-row items-center justify-between gap-8 py-2">
        <EnergyRing value={28} />

        <View className="flex-1 justify-center gap-8">
          <View>
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-widest text-slate-400">
              Heart Rate
            </Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-4xl font-black leading-none text-white">
                62
              </Text>
              <Text className="text-[14px] font-bold uppercase tracking-tighter text-primary-pink">
                Bpm
              </Text>
            </View>
          </View>
          <View>
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-widest text-slate-400">
              HRV Balance
            </Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-4xl font-black leading-none text-white">
                74
              </Text>
              <Text className="text-[14px] font-bold uppercase tracking-tighter text-accent-yellow">
                Ms
              </Text>
            </View>
          </View>
        </View>
      </View>
    </DashboardCard>
  );
}
