import { colors } from '@/constants/colors';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
export function HeartRateBadge() {
  const { heartRate } = useLatestBiometrics();
  const display = heartRate != null ? `${heartRate} BPM` : '— BPM';

  return (
    <View className="flex-row items-center gap-1 rounded-full border border-primary-pink/20 bg-primary-pink/10 px-2 py-1">
      <MaterialIcons name="favorite" size={12} color={colors.primary.pink} />
      <Text
        className="text-[10px] font-bold uppercase tracking-wider text-primary-pink"
        numberOfLines={1}
      >
        {display}
      </Text>
    </View>
  );
}
