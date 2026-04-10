import { useSession } from '@/lib/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image, View } from 'react-native';

interface UserAvatarProps {
  /** Outer container className for size, border, etc. */
  className?: string;
  /** Fallback icon color when no image. Default: white */
  fallbackColor?: string;
  /** Icon size. Default: 20 */
  iconSize?: number;
  /** Explicit image URI. When provided, overrides the session user image. */
  imageUri?: string | null;
}

export function UserAvatar({
  className,
  fallbackColor = 'white',
  iconSize = 20,
  imageUri,
}: UserAvatarProps) {
  const { data: session } = useSession();
  const userImage = imageUri !== undefined ? imageUri : session?.user?.image;

  return (
    <View
      className={clsx(
        'items-center justify-center overflow-hidden rounded-full',
        className,
      )}
    >
      {userImage ? (
        <Image
          source={{ uri: userImage }}
          className="h-full w-full rounded-full"
        />
      ) : (
        <MaterialIcons name="person" size={iconSize} color={fallbackColor} />
      )}
    </View>
  );
}
