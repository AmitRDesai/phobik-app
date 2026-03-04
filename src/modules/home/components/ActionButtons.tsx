import { GradientButton } from '@/components/ui/GradientButton';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

export function ActionButtons() {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <GradientButton
          onPress={() => router.push('/daily-check-in')}
          prefixIcon={
            <MaterialIcons name="auto-awesome" size={20} color="white" />
          }
        >
          Check In
        </GradientButton>
      </View>
      <View className="flex-1">
        <GradientButton
          onPress={() => router.push('/quick-reset/name-your-feeling')}
          prefixIcon={<MaterialIcons name="refresh" size={20} color="white" />}
        >
          Quick Reset
        </GradientButton>
      </View>
    </View>
  );
}
