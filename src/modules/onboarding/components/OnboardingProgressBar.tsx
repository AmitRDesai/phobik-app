import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

interface OnboardingProgressBarProps {
  step: number;
  totalSteps?: number;
}

export function OnboardingProgressBar({
  step,
  totalSteps = 8,
}: OnboardingProgressBarProps) {
  return (
    <View className="flex-row gap-1.5">
      {step > 0 && (
        <MaskedView
          style={{ flex: step, flexDirection: 'row', height: 5 }}
          maskElement={
            <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
              {Array.from({ length: step }, (_, i) => (
                <View
                  key={i}
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
            colors={[colors.primary.pink, '#FF8D5C', colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, height: 5 }}
          />
        </MaskedView>
      )}
      {Array.from({ length: totalSteps - step }, (_, i) => (
        <View
          key={i + step}
          className="h-[5px] flex-1 rounded-full bg-white/10"
        />
      ))}
    </View>
  );
}
