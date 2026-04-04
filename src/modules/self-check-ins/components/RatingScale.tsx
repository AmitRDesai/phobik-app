import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';

interface RatingScaleProps {
  min: number;
  max: number;
  value: number | null;
  onChange: (value: number) => void;
  startLabel?: string;
  endLabel?: string;
}

export function RatingScale({
  min,
  max,
  value,
  onChange,
  startLabel = 'Never',
  endLabel = 'Always',
}: RatingScaleProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const handlePress = (option: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(option);
  };

  return (
    <View className="flex-row items-start justify-between gap-2">
      {options.map((option, index) => {
        const isSelected = value === option;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <View key={option} className="flex-1 items-center gap-3">
            <Pressable
              onPress={() => handlePress(option)}
              className="h-14 w-14 items-center justify-center"
            >
              {isSelected ? (
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: colors.primary.pink,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 20,
                    elevation: 8,
                  }}
                >
                  <Text className="text-xl font-bold text-black">{option}</Text>
                </LinearGradient>
              ) : (
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: colors.background.charcoal,
                    borderWidth: 1,
                    borderColor: withAlpha('#ffffff', 0.1),
                  }}
                >
                  <Text className="text-xl font-bold text-neutral-400">
                    {option}
                  </Text>
                </View>
              )}
            </Pressable>
            {isFirst && (
              <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                {startLabel}
              </Text>
            )}
            {isLast && (
              <Text className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                {endLabel}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
