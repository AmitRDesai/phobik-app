import { Text, View } from '@/components/themed';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface EbookProgressBarProps {
  percent: number;
}

export function EbookProgressBar({ percent }: EbookProgressBarProps) {
  return (
    <View className="px-6 pb-4">
      <View className="mb-1.5 flex-row items-center justify-between">
        <Text size="xs" tone="secondary" weight="medium">
          Book Progress
        </Text>
        <Text size="xs" weight="semibold">
          {percent}%
        </Text>
      </View>
      <ProgressBar progress={percent / 100} gradient />
    </View>
  );
}
