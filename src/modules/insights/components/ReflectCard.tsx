import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface ReflectCardProps {
  question: string;
}

export function ReflectCard({ question }: ReflectCardProps) {
  return (
    <Card
      variant="raised"
      size="lg"
      className="border-l-4 border-l-primary-pink p-5"
    >
      <View className="mb-2 flex-row items-center gap-2">
        <MaterialIcons
          name="psychology"
          size={14}
          color={colors.primary['pink-soft']}
        />
        <Text size="xs" treatment="caption" tone="accent">
          Reflect
        </Text>
      </View>
      <Text size="md" italic weight="bold" className="text-foreground/90">
        {question}
      </Text>
    </Card>
  );
}
