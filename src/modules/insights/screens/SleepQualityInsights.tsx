import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';

import { AnxietyImpactCard } from '../components/AnxietyImpactCard';
import { HrvRecoveryChart } from '../components/HrvRecoveryChart';
import { SleepMetricsGrid } from '../components/SleepMetricsGrid';
import { SleepScoreHeader } from '../components/SleepScoreHeader';
import { TimeRangeControl } from '../components/TimeRangeControl';

export default function SleepQualityInsights() {
  return (
    <Screen
      scroll
      header={<Header title="Sleep Quality" />}
      contentClassName="gap-6 pb-6"
    >
      <SleepScoreHeader />
      <View>
        <TimeRangeControl />
      </View>
      <SleepMetricsGrid />
      <HrvRecoveryChart />
      <AnxietyImpactCard />
    </Screen>
  );
}
