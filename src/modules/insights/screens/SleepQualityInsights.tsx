import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';

import { AnxietyImpactCard } from '../components/AnxietyImpactCard';
import { HrvRecoveryChart } from '../components/HrvRecoveryChart';
import { SleepMetricsGrid } from '../components/SleepMetricsGrid';
import { SleepScoreHeader } from '../components/SleepScoreHeader';

export default function SleepQualityInsights() {
  return (
    <Screen
      scroll
      header={<Header title="Sleep Quality Insights" />}
      className=""
      contentClassName="gap-8 pb-4"
    >
      <SleepScoreHeader />
      <HrvRecoveryChart />
      <SleepMetricsGrid />
      <AnxietyImpactCard />
    </Screen>
  );
}
