import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import {
  STRESSOR_CATEGORIES,
  type StressorKey,
} from '@/modules/self-check-ins/data/stressors';
import { useAssessmentList } from '@/modules/self-check-ins/hooks/useSelfCheckIn';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';

const ACCENT_COLORS = [
  colors.primary['pink-soft'],
  colors.accent.gold,
  colors.white,
];

interface StressorCardData {
  key: StressorKey;
  emoji: string;
  label: string;
  count: string;
  color: string;
}

interface CompletedAssessment {
  id: string;
  type: string;
  status: string;
  answers?: Record<string, number>;
}

export function TopStressorsRow() {
  const router = useRouter();
  const { data: assessments } = useAssessmentList();

  const topStressors = useMemo<StressorCardData[]>(() => {
    const list = assessments as CompletedAssessment[] | undefined;
    const latest = list?.find(
      (a) => a.type === 'stress-compass' && a.status === 'completed',
    );
    if (!latest) return [];

    const answers = (latest.answers ?? {}) as Record<string, number>;
    const ratings: { key: StressorKey; rating: number }[] = [];
    for (const [qid, value] of Object.entries(answers)) {
      const idx = Number(qid);
      const stressor = STRESSOR_CATEGORIES[idx];
      if (stressor) ratings.push({ key: stressor.key, rating: value });
    }
    return ratings
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 3)
      .map((item, i) => {
        const stressor = STRESSOR_CATEGORIES.find((s) => s.key === item.key)!;
        return {
          key: item.key,
          emoji: stressor.emoji,
          label: stressor.label,
          count: `${item.rating}/10`,
          color: ACCENT_COLORS[i] ?? colors.white,
        };
      });
  }, [assessments]);

  return (
    <View className="-mx-5 gap-4">
      <View className="flex-row items-center justify-between px-5">
        <Text size="xs" treatment="caption" tone="secondary">
          Top Stressors
        </Text>
        <Text size="xs" treatment="caption" tone="accent">
          Compass Link
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 px-5"
      >
        {topStressors.length === 0 ? (
          <Pressable
            onPress={() =>
              router.push('/practices/self-check-ins/stress-compass')
            }
          >
            <DashboardCard className="min-w-[200px] items-center justify-center p-4">
              <Text className="mb-2 text-3xl">🧭</Text>
              <Text
                size="xs"
                treatment="caption"
                align="center"
                className="text-foreground/60"
              >
                Take the Stress{'\n'}Compass
              </Text>
              <Text
                size="xs"
                treatment="caption"
                tone="accent"
                className="mt-1"
              >
                Start
              </Text>
            </DashboardCard>
          </Pressable>
        ) : (
          topStressors.map((s) => (
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
                <Text
                  size="xs"
                  treatment="caption"
                  className="text-foreground/60"
                >
                  {s.label}
                </Text>
                <Text size="lg" weight="black" style={{ color: s.color }}>
                  {s.count}
                </Text>
              </DashboardCard>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
