import { GradientButton } from '@/components/ui/GradientButton';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

export function ActionButtons() {
  return (
    <View className="items-center py-2 px-6">
      <View className="w-full">
        <GradientButton
          onPress={() => router.push('/quick-reset/name-your-feeling')}
          prefixIcon={<MaterialIcons name="refresh" size={20} color="white" />}
        >
          QUICK RESET
        </GradientButton>
      </View>
    </View>
  );
}
