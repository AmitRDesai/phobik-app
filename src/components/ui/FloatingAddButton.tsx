import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

interface FloatingAddButtonProps {
  onPress: () => void;
}

export function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-8 right-6 z-40 active:opacity-80"
    >
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
          boxShadow: `0 4px 12px ${withAlpha(colors.primary.pink, 0.4)}`,
        }}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </LinearGradient>
    </Pressable>
  );
}
