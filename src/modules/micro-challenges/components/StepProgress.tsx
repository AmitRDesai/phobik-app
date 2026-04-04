import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const completed = currentStep + 1;
  const remaining = totalSteps - completed;

  return (
    <View className="flex-row gap-1.5 px-6 py-3">
      {completed > 0 && (
        <MaskedView
          style={{ flex: completed, flexDirection: 'row', height: 5 }}
          maskElement={
            <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
              {Array.from({ length: completed }, (_, i) => (
                <View
                  key={`done-${i}`}
                  style={{
                    flex: 1,
                    borderRadius: 9999,
                    backgroundColor: 'black',
                  }}
                />
              ))}
            </View>
          }
        >
          <LinearGradient
            colors={[
              colors.primary.pink,
              colors.gradient['warm-orange'],
              colors.accent.yellow,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, height: 5 }}
          />
        </MaskedView>
      )}
      {Array.from({ length: remaining }, (_, i) => (
        <View
          key={`rem-${i}`}
          className="h-[5px] flex-1 rounded-full bg-white/10"
        />
      ))}
    </View>
  );
}
