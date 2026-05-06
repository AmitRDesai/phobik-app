import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
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
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-foreground/60">{description}</Text>
      </View>
    </Card>
  );
}
