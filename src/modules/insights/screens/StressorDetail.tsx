import { GlowBg } from '@/components/ui/GlowBg';
import { colors, withAlpha } from '@/constants/colors';
import type { StressorKey } from '@/modules/self-check-ins/data/stressors';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/themed/Text';
import { ScrollView, View } from 'react-native';
import { ReflectCard } from '../components/ReflectCard';
import { SelfLeadershipPlan } from '../components/SelfLeadershipPlan';
import { StressorHeader } from '../components/StressorHeader';
import { STRESSOR_DETAILS } from '../data/stressor-details';

export default function StressorDetail() {
  const { key } = useLocalSearchParams<{ key: StressorKey }>();
  const data = STRESSOR_DETAILS[key ?? 'work'];

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-black"
        centerY={0.2}
        intensity={0.4}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <StressorHeader title={data.headerTitle} subtitle={data.headerSubtitle} />
      <ScrollView
        contentContainerClassName="gap-8 px-5 pb-12 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Stressor icon + title */}
        <View className="items-center gap-3">
          <View
            className="h-28 w-28 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
            style={{
              boxShadow: `0px 0px 15px ${withAlpha(colors.primary['pink-soft'], 0.2)}`,
            }}
          >
            <Text className="text-5xl">{data.emoji}</Text>
          </View>
          <View className="max-w-[320px] items-center gap-3">
            <Text className="text-center text-2xl font-black uppercase italic leading-none tracking-tight text-foreground">
              {data.title}
            </Text>
            <Text className="text-center text-xs font-medium leading-relaxed text-foreground/60">
              {data.description}
            </Text>
          </View>
        </View>

        <ReflectCard question={data.reflectQuestion} />
        <SelfLeadershipPlan
          selectedStrengths={data.selectedStrengths}
          exercises={data.exercises}
        />
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
