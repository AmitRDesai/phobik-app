import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface Metric {
  icon: 'schedule' | 'nights-stay' | 'favorite';
  value: string;
  label: string;
}

const METRICS: Metric[] = [
  { icon: 'schedule', value: '7h 24m', label: 'Asleep' },
  { icon: 'nights-stay', value: '22%', label: 'Deep' },
  { icon: 'favorite', value: '54', label: 'BPM' },
];

export function SleepMetricsGrid() {
  return (
    <View className="flex-row gap-3 px-4">
      {METRICS.map((m) => (
        <View
          key={m.label}
          className="flex-1 items-center gap-2 rounded-xl border border-primary-pink/20 bg-primary-pink/5 p-4"
        >
          <MaterialIcons name={m.icon} size={20} color={colors.primary.pink} />
          <Text className="text-base font-bold text-white">{m.value}</Text>
          <Text className="text-[10px] font-medium uppercase tracking-wider text-white/40">
            {m.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
