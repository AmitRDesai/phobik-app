import { DashboardCard } from '@/modules/home/components/DashboardCard';
import { Text, View } from 'react-native';

interface StressSignsChipsProps {
  signs: string[];
}

export function StressSignsChips({ signs }: StressSignsChipsProps) {
  return (
    <DashboardCard className="p-5">
      <Text className="mb-4 text-[10px] font-black uppercase tracking-[3px] text-slate-400">
        Stress Signs
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {signs.map((sign) => (
          <View
            key={sign}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
          >
            <Text className="text-[11px] font-bold italic text-slate-300">
              {sign}
            </Text>
          </View>
        ))}
      </View>
    </DashboardCard>
  );
}
