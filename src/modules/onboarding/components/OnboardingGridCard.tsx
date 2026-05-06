import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
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
  const scheme = useScheme();
  const idleIconColor = foregroundFor(scheme, { dark: 0.3, light: 0.45 });

  const cardInner = (
    <View
      className={clsx(
        'justify-center rounded-xl p-3.5',
        selected ? 'bg-surface' : 'bg-foreground/5',
      )}
      style={{ minHeight: height }}
    >
      <MaterialIcons
        name={icon}
        size={28}
        color={selected ? colors.primary.pink : idleIconColor}
      />
      <Text className="mt-2 text-sm font-bold leading-tight text-foreground/90">
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
        cardInner
      )}
    </Pressable>
  );
}
