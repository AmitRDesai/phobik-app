import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { colors } from '@/constants/colors';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
interface SenseCardProps {
  count: number;
  title: string;
  subtitle: string;
}

export function SenseCard({ count, title, subtitle }: SenseCardProps) {
  return (
    <Card className="flex-row items-start gap-4">
      <IconChip size="sm" shape="circle" tone="pink">
        <Text
          className="text-sm font-bold"
          style={{ color: colors.primary.pink }}
        >
          {count}
        </Text>
      </IconChip>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">{title}</Text>
        <Text className="mt-0.5 text-xs text-foreground/50">{subtitle}</Text>
      </View>
    </Card>
  );
}
