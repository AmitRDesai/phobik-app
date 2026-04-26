import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { ScrollView, View } from 'react-native';

import { BiometricIndexCard } from '../components/BiometricIndexCard';
import { DoseSummaryCard } from '../components/DoseSummaryCard';
import { EnergyIndexChart } from '../components/EnergyIndexChart';
import { InsightsHeader } from '../components/InsightsHeader';
import { MorningResetCalendar } from '../components/MorningResetCalendar';
import { SleepIntelligenceCard } from '../components/SleepIntelligenceCard';
import { TimeRangeControl } from '../components/TimeRangeControl';
import { TopStressorsRow } from '../components/TopStressorsRow';

export default function InsightsDashboard() {
  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.25}
        intensity={0.5}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <InsightsHeader />
      <ScrollView
        contentContainerClassName="gap-8 px-5 py-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <TimeRangeControl />
        <TopStressorsRow />
        <MorningResetCalendar />
        <EnergyIndexChart />
        <DoseSummaryCard />
        <BiometricIndexCard />
        <SleepIntelligenceCard />
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
