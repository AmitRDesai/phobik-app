import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function DoseDeficiencyAlert() {
  return (
    <View className="overflow-hidden rounded-3xl border border-[#00D4FF]/30 bg-white/5 p-5">
      <View className="flex-row items-center gap-4">
        <View className="h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00D4FF]/20">
          <MaterialIcons
            name="info-outline"
            size={24}
            color={colors.accent.info}
          />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-white">
            You're low on Oxytocin today
          </Text>
          <Text className="mt-1 text-sm text-white/60">
            Smart Tip: Try a 60-second connection reset with a loved one or pet.
          </Text>
        </View>
      </View>
    </View>
  );
}
