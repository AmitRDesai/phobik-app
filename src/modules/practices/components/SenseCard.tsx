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
        <Text size="sm" weight="bold" style={{ color: colors.primary.pink }}>
          {count}
        </Text>
      </IconChip>
      <View className="flex-1">
        <Text size="md" weight="semibold">
          {title}
        </Text>
        <Text size="sm" className="mt-0.5 text-foreground/50">
          {subtitle}
        </Text>
      </View>
    </Card>
  );
}
