import { BlurView } from '@/components/ui/BlurView';
import { useBiometricHistory } from '@/modules/insights/hooks/useBiometricHistory';
import { Text, View } from 'react-native';
import { useJournalStats } from '../hooks/useJournalStats';

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 items-center rounded-xl border border-foreground/10 bg-foreground/5 p-3">
      <Text className="mb-1 text-[10px] font-bold uppercase text-foreground/30">
        {label}
      </Text>
      <Text className="text-lg font-bold text-foreground">{value}</Text>
    </View>
  );
}

export function BlurredStats() {
  const { data } = useJournalStats();
  const hrv = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], 'Week');

  return (
    <View className="relative w-full overflow-hidden rounded-xl opacity-50">
      <View className="flex-row gap-3">
        <StatBox label="Entries" value={data?.totalEntries ?? 0} />
        <StatBox label="Streak" value={data?.streak ?? 0} />
        <StatBox
          label="Avg HRV"
          value={hrv.avg != null ? Math.round(hrv.avg) : '—'}
        />
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
