import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface SettingsMenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
}

export function SettingsMenuItem({
  icon,
  iconColor = colors.primary.pink,
  iconBgColor = withAlpha(colors.primary.pink, 0.15),
  label,
  subtitle,
  onPress,
}: SettingsMenuItemProps) {
  const scheme = useScheme();
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-3.5 active:opacity-70"
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: iconBgColor }}
      >
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{label}</Text>
        {subtitle && (
          <Text className="text-sm text-foreground/50">{subtitle}</Text>
        )}
      </View>
      <MaterialIcons
        name="chevron-right"
        size={22}
        color={foregroundFor(scheme, 0.3)}
      />
    </Pressable>
  );
}
