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
  iconColor = 'white',
  className,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      className={clsx(
        'h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5',
        className,
      )}
    >
      <MaterialIcons name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  );
}
