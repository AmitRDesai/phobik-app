import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

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
    <View className="h-12 flex-row gap-1 rounded-xl bg-white/5 p-1">
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
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}
              >
                <Text className="text-sm font-bold text-white">
                  {option.label}
                </Text>
              </LinearGradient>
            ) : (
              <View className="flex-1 items-center justify-center rounded-lg">
                <Text className="text-sm font-bold text-primary-muted">
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
