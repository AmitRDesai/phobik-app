import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableChip({
  label,
  selected,
  onPress,
}: SelectableChipProps) {
  const inner = (
    <View className="h-11 flex-row items-center px-5">
      <Text
        className={`text-sm font-bold ${selected ? 'text-white' : 'text-foreground/80'}`}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable onPress={onPress}>
      {selected ? (
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 9999,
            boxShadow: `0 0 8px ${withAlpha(colors.primary.pink, 0.3)}`,
          }}
        >
          {inner}
        </LinearGradient>
      ) : (
        <View className="rounded-full bg-foreground/10">{inner}</View>
      )}
    </Pressable>
  );
}
