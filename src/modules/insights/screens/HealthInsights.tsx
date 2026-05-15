import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';

import { BiometricIndexCard } from '../components/BiometricIndexCard';
import { ExtraMetricsRow } from '../components/ExtraMetricsRow';
import { HrvRecoveryChart } from '../components/HrvRecoveryChart';
import { LiveBiometricsCard } from '../components/LiveBiometricsCard';
import { TimeRangeControl } from '../components/TimeRangeControl';

export default function HealthInsights() {
  return (
    <Screen
      scroll
      header={<Header title="Health" />}
      className="px-5"
      contentClassName="gap-8 pt-4 pb-6"
    >
      <TimeRangeControl />
      <LiveBiometricsCard />
      <BiometricIndexCard />
      <HrvRecoveryChart />
      <ExtraMetricsRow />
    </Screen>
  );
}
