import { Text, View } from '@/components/themed';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface EbookProgressBarProps {
  percent: number;
}

export function EbookProgressBar({ percent }: EbookProgressBarProps) {
  return (
    <View className="px-6 pb-4">
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text variant="xs" muted className="font-medium">
          Book Progress
        </Text>
        <Text variant="xs" className="font-semibold">
          {percent}%
        </Text>
      </View>
      <View className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
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
