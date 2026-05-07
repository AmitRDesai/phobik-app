import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { colors } from '@/constants/colors';

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
          variant="sm"
          className="font-bold"
          style={{ color: colors.primary.pink }}
        >
          {count}
        </Text>
      </IconChip>
      <View className="flex-1">
        <Text variant="md" className="font-semibold">
          {title}
        </Text>
        <Text variant="sm" className="mt-0.5 text-foreground/50">
          {subtitle}
        </Text>
      </View>
    </Card>
  );
}
