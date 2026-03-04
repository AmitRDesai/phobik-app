import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';

interface SenseCardProps {
  count: number;
  title: string;
  subtitle: string;
}

export function SenseCard({ count, title, subtitle }: SenseCardProps) {
  return (
    <View className="flex-row items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-pink/20">
        <Text
          className="text-sm font-bold"
          style={{ color: colors.primary.pink }}
        >
          {count}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">{title}</Text>
        <Text className="mt-0.5 text-xs text-white/50">{subtitle}</Text>
      </View>
    </View>
  );
}
