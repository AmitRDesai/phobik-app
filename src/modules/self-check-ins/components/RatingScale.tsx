import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors, withAlpha } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

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
                    boxShadow: `0px 0px 20px ${withAlpha(colors.primary.pink, 0.4)}`,
                  }}
                >
                  <Text size="h3" tone="inverse" weight="bold">
                    {option}
                  </Text>
                </LinearGradient>
              ) : (
                <View className="h-14 w-14 items-center justify-center rounded-full border border-foreground/10 bg-surface">
                  <Text size="h3" weight="bold" className="text-foreground/60">
                    {option}
                  </Text>
                </View>
              )}
            </Pressable>
            {isFirst && (
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="tracking-wider text-foreground/45"
              >
                {startLabel}
              </Text>
            )}
            {isLast && (
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="tracking-wider text-foreground/45"
              >
                {endLabel}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
