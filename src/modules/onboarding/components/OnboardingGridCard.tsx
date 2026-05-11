import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Pressable } from 'react-native';

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

  return (
    <Pressable onPress={onPress} className="flex-1">
      <View
        className={clsx(
          'justify-center rounded-xl border-2 p-3.5',
          selected
            ? 'border-primary-pink bg-primary-pink/10'
            : 'border-transparent bg-foreground/5',
        )}
        style={{
          minHeight: height,
          ...(selected && {
            boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.3)}`,
          }),
        }}
      >
        <MaterialIcons
          name={icon}
          size={28}
          color={selected ? colors.primary.pink : idleIconColor}
        />
        <Text
          size="sm"
          className={clsx(
            'mt-2 font-bold leading-tight',
            selected ? 'text-foreground' : 'text-foreground/90',
          )}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
