import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const progress = current / total;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        {label && (
          <Text className="text-xs font-medium uppercase tracking-wider text-white/40">
            {label}
          </Text>
        )}
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: `${colors.primary.pink}20` }}
        >
          <Text
            className="text-xs font-bold"
            style={{ color: colors.primary.pink }}
          >
            {current} of {total}
          </Text>
        </View>
      </View>
      <View className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <View
          className="h-full rounded-full"
          style={{
            backgroundColor: colors.primary.pink,
            width: `${progress * 100}%`,
          }}
        />
      </View>
    </View>
  );
}
