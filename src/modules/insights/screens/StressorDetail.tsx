import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import type { StressorKey } from '@/modules/self-check-ins/data/stressors';
import { useLocalSearchParams } from 'expo-router';

import { ReflectCard } from '../components/ReflectCard';
import { SelfLeadershipPlan } from '../components/SelfLeadershipPlan';
import { StressorHeader } from '../components/StressorHeader';
import { STRESSOR_DETAILS } from '../data/stressor-details';

export default function StressorDetail() {
  const { key } = useLocalSearchParams<{ key: StressorKey }>();
  const data = STRESSOR_DETAILS[key ?? 'work'];

  return (
    <Screen
      variant="default"
      scroll
      header={
        <StressorHeader
          title={data.headerTitle}
          subtitle={data.headerSubtitle}
        />
      }
      className="px-5"
      contentClassName="gap-8 pb-4 pt-4"
    >
      <View className="items-center gap-3">
        <View
          className="h-28 w-28 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
          style={{
            boxShadow: `0 0 12px ${withAlpha(colors.primary['pink-soft'], 0.2)}`,
          }}
        >
          <Text className="text-5xl">{data.emoji}</Text>
        </View>
        <View className="max-w-[320px] items-center gap-3">
          <Text
            size="h2"
            italic
            align="center"
            weight="black"
            className="uppercase"
          >
            {data.title}
          </Text>
          <Text size="xs" tone="secondary" align="center" weight="medium">
            {data.description}
          </Text>
        </View>
      </View>

      <ReflectCard question={data.reflectQuestion} />
      <SelfLeadershipPlan
        selectedStrengths={data.selectedStrengths}
        exercises={data.exercises}
      />
    </Screen>
  );
}
