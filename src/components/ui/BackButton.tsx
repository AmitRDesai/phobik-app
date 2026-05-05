import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

type BackButtonProps = {
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  className?: string;
};

export function BackButton({
  onPress,
  icon = 'arrow-back',
  iconSize = 22,
  iconColor,
  className,
}: BackButtonProps) {
  const router = useRouter();
  const scheme = useScheme();
  const resolvedIconColor =
    iconColor ?? foregroundFor(scheme, { dark: 1, light: 0.78 });

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      className={clsx(
        'h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5',
        className,
      )}
    >
      <MaterialIcons name={icon} size={iconSize} color={resolvedIconColor} />
    </Pressable>
  );
}
