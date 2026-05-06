import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

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
  iconBgColor,
  label,
  subtitle,
  onPress,
}: SettingsMenuItemProps) {
  const scheme = useScheme();
  return (
    <Card onPress={onPress} className="flex-row items-center gap-3 px-4 py-3.5">
      <IconChip size="md" shape="rounded" bg={iconBgColor}>
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </IconChip>
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
    </Card>
  );
}
