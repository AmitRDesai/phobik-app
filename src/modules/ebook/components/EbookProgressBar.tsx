import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

interface EbookProgressBarProps {
  percent: number;
}

export function EbookProgressBar({ percent }: EbookProgressBarProps) {
  return (
    <View className="px-6 pb-4">
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text className="text-xs font-medium text-white/50">Book Progress</Text>
        <Text className="text-xs font-semibold text-white/80">{percent}%</Text>
      </View>
      <View className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            height: '100%',
            width: `${percent}%`,
            borderRadius: 9999,
          }}
        />
      </View>
    </View>
  );
}
