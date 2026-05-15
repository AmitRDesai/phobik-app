import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BlurView } from '@/components/ui/BlurView';
import { Card } from '@/components/ui/Card';
import { hasConnectedHealthAtom } from '@/modules/home/store/health-connection';
import { useBiometricHistory } from '@/modules/insights/hooks/useBiometricHistory';
import { useAtomValue } from 'jotai';
import { useJournalStats } from '../hooks/useJournalStats';

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="flex-1 items-center p-3">
      <Text
        size="xs"
        treatment="caption"
        tone="tertiary"
        weight="bold"
        className="mb-1"
      >
        {label}
      </Text>
      <Text size="lg" weight="bold">
        {value}
      </Text>
    </Card>
  );
}

export function BlurredStats() {
  const { data } = useJournalStats();
  const hasConnectedHealth = useAtomValue(hasConnectedHealthAtom);
  const hrv = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], 'Week');

  return (
    <View className="relative w-full overflow-hidden rounded-xl opacity-50">
      <View className="flex-row gap-3">
        <StatBox label="Entries" value={data?.totalEntries ?? 0} />
        <StatBox label="Streak" value={data?.streak ?? 0} />
        {hasConnectedHealth ? (
          <StatBox
            label="Avg HRV"
            value={hrv.avg != null ? Math.round(hrv.avg) : '—'}
          />
        ) : null}
      </View>
      <BlurView
        intensity={8}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </View>
  );
}
