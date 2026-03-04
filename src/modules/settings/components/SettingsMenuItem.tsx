import { colors } from '@/constants/colors';
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
  iconBgColor = 'rgba(233,75,147,0.15)',
  label,
  subtitle,
  onPress,
}: SettingsMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 active:opacity-70"
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: iconBgColor }}
      >
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-white">{label}</Text>
        {subtitle && <Text className="text-sm text-white/50">{subtitle}</Text>}
      </View>
      <MaterialIcons
        name="chevron-right"
        size={22}
        color="rgba(255,255,255,0.3)"
      />
    </Pressable>
  );
}
