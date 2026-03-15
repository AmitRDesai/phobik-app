import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export function SleepIntelligenceCard() {
  const router = useRouter();

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-white/40">
          Sleep Intelligence
        </Text>
        <Text className="text-[9px] font-bold uppercase tracking-widest text-accent-yellow">
          Wearable Sync: ON
        </Text>
      </View>
      <Pressable onPress={() => router.push('/insights/sleep-quality')}>
        <DashboardCard className="flex-row items-center gap-6 overflow-hidden p-5">
          {/* Glow background */}
          <View
            className="absolute -left-10 top-0 h-32 w-32 rounded-full"
            style={{
              backgroundColor: 'rgba(255, 45, 133, 0.1)',
              // blur is simulated with opacity
            }}
          />
          {/* Moon icon */}
          <View className="relative z-10 h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <MaterialIcons
              name="dark-mode"
              size={36}
              color={colors.accent.yellow}
              style={{
                shadowColor: colors.accent.yellow,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
              }}
            />
          </View>
          {/* Content */}
          <View className="relative z-10 flex-1">
            <View className="mb-1 flex-row items-end justify-between">
              <Text className="text-lg font-black text-white">
                Restorative Sleep
              </Text>
              <Text className="text-2xl font-black text-primary-pink">84%</Text>
            </View>
            {/* Progress bar */}
            <View className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: '84%',
                  height: '100%',
                  borderRadius: 9999,
                  shadowColor: colors.primary['pink-soft'],
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                }}
              />
            </View>
            <Text className="mt-3 text-[10px] font-medium text-white/40">
              Deep & REM cycles prioritized neural recovery today.
            </Text>
          </View>
        </DashboardCard>
      </Pressable>
    </View>
  );
}
