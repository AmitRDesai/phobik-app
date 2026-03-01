import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export default function Insights() {
  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        intensity={0.3}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <View className="flex-1 items-center justify-center gap-4">
        <MaterialIcons name="insights" size={48} color={colors.accent.yellow} />
        <Text className="text-lg font-bold text-white">Insights</Text>
        <Text className="text-sm text-white/50">Coming soon</Text>
      </View>
    </View>
  );
}
