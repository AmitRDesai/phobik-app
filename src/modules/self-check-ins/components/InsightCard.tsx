import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface InsightCardProps {
  title: string;
  body: string;
}

export function InsightCard({ title, body }: InsightCardProps) {
  return (
    <Card variant="raised" size="lg" className="overflow-hidden p-7">
      <View className="mb-3 flex-row items-center gap-2">
        <MaterialIcons name="lightbulb" size={18} color={colors.primary.pink} />
        <Text size="lg" tone="accent" weight="bold">
          {title}
        </Text>
      </View>
      <Text size="md" className="leading-relaxed text-foreground/60">
        {body}
      </Text>
    </Card>
  );
}
