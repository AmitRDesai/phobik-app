import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface ReflectCardProps {
  question: string;
}

export function ReflectCard({ question }: ReflectCardProps) {
  return (
    <DashboardCard className="border-l-4 border-l-primary-pink p-5">
      <View className="mb-2 flex-row items-center gap-2">
        <MaterialIcons
          name="psychology"
          size={14}
          color={colors.primary['pink-soft']}
        />
        <Text variant="caption" className="text-primary-pink">
          Reflect
        </Text>
      </View>
      <Text variant="md" className="font-bold italic text-foreground/90">
        {question}
      </Text>
    </DashboardCard>
  );
}
