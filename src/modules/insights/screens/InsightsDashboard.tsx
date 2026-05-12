import { Screen } from '@/components/ui/Screen';

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
    <Screen
      scroll
      insetTop={false}
      header={<InsightsHeader />}
      className="px-5"
      contentClassName="gap-8 pt-4 pb-2"
    >
      <TimeRangeControl />
      <TopStressorsRow />
      <MorningResetCalendar />
      <EnergyIndexChart />
      <DoseSummaryCard />
      <BiometricIndexCard />
      <SleepIntelligenceCard />
    </Screen>
  );
}
