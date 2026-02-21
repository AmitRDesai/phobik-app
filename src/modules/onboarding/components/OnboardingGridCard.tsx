import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

interface OnboardingGridCardProps {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  selected: boolean;
  onPress: () => void;
  height?: number;
}

export function OnboardingGridCard({
  icon,
  label,
  selected,
  onPress,
  height = 92,
}: OnboardingGridCardProps) {
  const cardInner = (
    <View
      className={`justify-center rounded-xl p-3.5 ${
        selected ? 'bg-background-onboarding' : 'bg-white/5'
      }`}
      style={{ minHeight: height }}
    >
      <MaterialIcons
        name={icon}
        size={28}
        color={selected ? colors.primary.pink : 'rgba(255,255,255,0.3)'}
      />
      <Text className="mt-2 text-sm font-bold leading-tight text-white/90">
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable onPress={onPress} className="flex-1">
      {selected ? (
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 12, padding: 2 }}
        >
          {cardInner}
        </LinearGradient>
      ) : (
        <View
          style={{
            borderRadius: 12,
            padding: 2,
          }}
        >
          {cardInner}
        </View>
      )}
    </Pressable>
  );
}
