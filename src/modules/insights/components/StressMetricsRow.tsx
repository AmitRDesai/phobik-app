import { DashboardCard } from '@/modules/home/components/DashboardCard';
import { Text, View } from 'react-native';

interface StressMetricsRowProps {
  impact: string;
  duration: string;
}

export function StressMetricsRow({ impact, duration }: StressMetricsRowProps) {
  return (
    <View className="flex-row gap-4">
      <DashboardCard className="flex-1 p-4">
        <Text className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          Stress Impact
        </Text>
        <Text className="text-xl font-black uppercase text-primary-pink">
          {impact}
        </Text>
      </DashboardCard>
      <DashboardCard className="flex-1 p-4">
        <Text className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          Avg Duration
        </Text>
        <Text className="text-xl font-black text-accent-yellow">
          {duration}
        </Text>
      </DashboardCard>
    </View>
  );
}
