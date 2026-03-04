import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

interface AffirmationHeaderProps {
  currentStep: number;
}

export function AffirmationHeader({ currentStep }: AffirmationHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pb-2 pt-2">
      <Pressable onPress={() => router.back()} className="active:opacity-70">
        <MaterialIcons name="chevron-left" size={28} color="white" />
      </Pressable>

      <View className="flex-row gap-1.5">
        {[1, 2].map((step) => (
          <View
            key={step}
            className={`h-1 w-6 rounded-full ${
              step === currentStep
                ? 'bg-primary-pink'
                : step < currentStep
                  ? 'bg-primary-pink/40'
                  : 'bg-white/10'
            }`}
          />
        ))}
      </View>

      <View className="w-7" />
    </View>
  );
}
