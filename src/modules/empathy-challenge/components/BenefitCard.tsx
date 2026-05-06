import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface BenefitCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-xl border border-foreground/10 bg-foreground/5 p-4">
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary-pink/20">
        <MaterialIcons name={icon} size={24} color={colors.primary.pink} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-foreground/60">{description}</Text>
      </View>
    </View>
  );
}
