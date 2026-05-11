import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { MaterialIcons } from '@expo/vector-icons';

interface BenefitCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <Card className="flex-row items-center gap-4">
      <IconChip size="lg" shape="square" tone="pink">
        {(color) => <MaterialIcons name={icon} size={24} color={color} />}
      </IconChip>
      <View className="flex-1">
        <Text size="md" weight="semibold">
          {title}
        </Text>
        <Text size="sm" className="text-foreground/60">
          {description}
        </Text>
      </View>
    </Card>
  );
}
