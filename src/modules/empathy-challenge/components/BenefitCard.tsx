import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/colors';

interface BenefitCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary-pink/20">
        <MaterialIcons name={icon} size={24} color={colors.primary.pink} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-white">{title}</Text>
        <Text className="text-sm text-slate-400">{description}</Text>
      </View>
    </View>
  );
}
