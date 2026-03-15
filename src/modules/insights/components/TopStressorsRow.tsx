import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { StressorKey } from '@/modules/daily-check-in/data/stressors';

interface StressorCardData {
  key: StressorKey;
  emoji: string;
  label: string;
  count: string;
  color: string;
}

const SAMPLE_STRESSORS: StressorCardData[] = [
  {
    key: 'work',
    emoji: '💼',
    label: 'Workload',
    count: '12x',
    color: colors.primary['pink-soft'],
  },
  {
    key: 'financial',
    emoji: '💰',
    label: 'Finances',
    count: '8x',
    color: colors.accent.gold,
  },
  {
    key: 'relationships',
    emoji: '💔',
    label: 'Conflict',
    count: '5x',
    color: colors.white,
  },
];

export function TopStressorsRow() {
  const router = useRouter();

  return (
    <View className="-mx-5 gap-4">
      <View className="flex-row items-center justify-between px-5">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-white/40">
          Top Stressors
        </Text>
        <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
          Compass Link
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 px-5"
      >
        {SAMPLE_STRESSORS.map((s) => (
          <Pressable
            key={s.key}
            onPress={() =>
              router.push({
                pathname: '/insights/stressor-detail',
                params: { key: s.key },
              })
            }
          >
            <DashboardCard className="min-w-[120px] items-center p-4">
              <Text className="mb-2 text-3xl">{s.emoji}</Text>
              <Text className="text-[10px] font-bold uppercase tracking-tighter text-white/60">
                {s.label}
              </Text>
              <Text className="text-lg font-black" style={{ color: s.color }}>
                {s.count}
              </Text>
            </DashboardCard>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
