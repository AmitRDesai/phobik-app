import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface InsightCardProps {
  title: string;
  body: string;
}

export function InsightCard({ title, body }: InsightCardProps) {
  return (
    <View
      className="overflow-hidden rounded-3xl border border-neutral-800/50 bg-neutral-900/50 p-7"
      style={{ position: 'relative' }}
    >
      <View className="mb-3 flex-row items-center gap-2">
        <MaterialIcons name="lightbulb" size={18} color={colors.primary.pink} />
        <Text className="text-base font-bold text-primary-pink">{title}</Text>
      </View>
      <Text className="text-[15px] leading-relaxed text-neutral-400">
        {body}
      </Text>
    </View>
  );
}
