import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface InsightCardProps {
  title: string;
  body: string;
}

export function InsightCard({ title, body }: InsightCardProps) {
  return (
    <Card variant="elevated" className="overflow-hidden p-7">
      <View className="mb-3 flex-row items-center gap-2">
        <MaterialIcons name="lightbulb" size={18} color={colors.primary.pink} />
        <Text className="text-base font-bold text-primary-pink">{title}</Text>
      </View>
      <Text className="text-[15px] leading-relaxed text-foreground/60">
        {body}
      </Text>
    </Card>
  );
}
