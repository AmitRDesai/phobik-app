import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface EnergyMetricCardProps {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

export function EnergyMetricCard({
  label,
  value,
  icon,
  color,
}: EnergyMetricCardProps) {
  return (
    <Card variant="elevated" className="flex-1 flex-row items-center gap-3 p-4">
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: withAlpha(color, 0.15) }}
      >
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text
          size="xs"
          treatment="caption"
          tone="secondary"
          weight="bold"
          className="tracking-widest"
        >
          {label}
        </Text>
        <Text weight="bold" size="lg" allowFontScaling={false}>
          {value}
        </Text>
      </View>
    </Card>
  );
}
