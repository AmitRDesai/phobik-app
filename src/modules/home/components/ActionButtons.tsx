import { GradientButton } from '@/components/ui/GradientButton';
import { useEnterMorningReset } from '@/modules/morning-reset/hooks/useEnterMorningReset';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

export function ActionButtons() {
  const enterMorningReset = useEnterMorningReset();

  return (
    <View className="items-center px-6 py-2">
      <View className="w-full">
        <GradientButton
          onPress={enterMorningReset}
          prefixIcon={<MaterialIcons name="wb-sunny" size={20} color="white" />}
        >
          MORNING RESET
        </GradientButton>
      </View>
    </View>
  );
}
