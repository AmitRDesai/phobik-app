import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
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
      <Text className="text-sm font-bold text-white">{label}</Text>
      {selected && (
        <Ionicons
          name="checkmark-circle-outline"
          size={18}
          color="white"
          style={{ marginLeft: 6 }}
        />
      )}
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
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          {inner}
        </LinearGradient>
      ) : (
        <View className="rounded-full bg-white/5">{inner}</View>
      )}
    </Pressable>
  );
}
