import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  selected: T | null;
  onSelect: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  selected,
  onSelect,
}: SegmentedControlProps<T>) {
  return (
    <View className="h-12 flex-row gap-1 rounded-xl bg-foreground/5 p-1">
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className="flex-1"
          >
            {isSelected ? (
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 8,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: `0 0 8px ${withAlpha(colors.primary.pink, 0.3)}`,
                }}
              >
                <Text size="sm" tone="inverse" weight="bold">
                  {option.label}
                </Text>
              </LinearGradient>
            ) : (
              <View className="flex-1 items-center justify-center rounded-lg">
                <Text size="sm" weight="bold" className="text-foreground/65">
                  {option.label}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
