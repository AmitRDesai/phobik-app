import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { ScrollView, View } from 'react-native';

import { AnxietyImpactCard } from '../components/AnxietyImpactCard';
import { DetailHeader } from '../components/DetailHeader';
import { HrvRecoveryChart } from '../components/HrvRecoveryChart';
import { SleepMetricsGrid } from '../components/SleepMetricsGrid';
import { SleepScoreHeader } from '../components/SleepScoreHeader';

export default function SleepQualityInsights() {
  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.15}
        intensity={0.4}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <DetailHeader title="Sleep Quality Insights" />
      <ScrollView
        contentContainerClassName="gap-8 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <SleepScoreHeader />
        <HrvRecoveryChart />
        <SleepMetricsGrid />
        <AnxietyImpactCard />
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
