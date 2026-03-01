import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function HeartRateBadge() {
  return (
    <View className="flex-row items-center gap-2 rounded-full border border-primary-pink/20 bg-primary-pink/10 px-4 py-2">
      <MaterialIcons name="favorite" size={14} color={colors.primary.pink} />
      <Text className="text-sm font-bold text-white">72 BPM</Text>
    </View>
  );
}
