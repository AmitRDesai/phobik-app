import { GradientButton } from '@/components/ui/GradientButton';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function DailyFlowHero() {
  const handleStartDailyFlow = () => {
    // TODO: wire to Daily Flow route once it exists
  };

  return (
    <View className="items-center px-2 pb-2 pt-6">
      <Text className="mb-2 text-center text-3xl font-black leading-tight tracking-tight text-white">
        How do you want to feel right now?
      </Text>
      <Text className="mb-6 text-center text-sm font-medium text-white/60">
        Start your Daily Flow
      </Text>
      <View className="w-full px-6">
        <GradientButton
          onPress={handleStartDailyFlow}
          prefixIcon={
            <MaterialIcons name="play-circle-filled" size={24} color="white" />
          }
        >
          DAILY FLOW
        </GradientButton>
      </View>
    </View>
  );
}
