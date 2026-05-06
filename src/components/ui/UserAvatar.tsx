import { foregroundFor } from '@/constants/colors';
import { useSession } from '@/hooks/auth/useAuth';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image, View, type ViewStyle } from 'react-native';

interface UserAvatarProps {
  /** Outer container className for size, border, etc. */
  className?: string;
  /** Outer container style (e.g. boxShadow). */
  style?: ViewStyle;
  /** Fallback icon color when no image. Default: theme-aware foreground. */
  fallbackColor?: string;
  /** Icon size. Default: 20 */
  iconSize?: number;
  /** Explicit image URI. When provided, overrides the session user image. */
  imageUri?: string | null;
}

export function UserAvatar({
  className,
  style,
  fallbackColor,
  iconSize = 20,
  imageUri,
}: UserAvatarProps) {
  const { data: session } = useSession();
  const scheme = useScheme();
  const userImage = imageUri !== undefined ? imageUri : session?.user?.image;
  const resolvedFallback = fallbackColor ?? foregroundFor(scheme, 0.6);

  return (
    <View
      className={clsx(
        'items-center justify-center overflow-hidden rounded-full',
        className,
      )}
      style={style}
    >
      {userImage ? (
        <Image
          source={{ uri: userImage }}
          className="h-full w-full rounded-full"
        />
      ) : (
        <MaterialIcons name="person" size={iconSize} color={resolvedFallback} />
      )}
    </View>
  );
}
