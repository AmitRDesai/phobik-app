import { Text } from '@/components/themed/Text';
import { foregroundFor } from '@/constants/colors';
import { useSession } from '@/hooks/auth/useAuth';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image, View, type ViewStyle } from 'react-native';

export type UserAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<UserAvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 80,
};

const SIZE_ICON: Record<UserAvatarSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 40,
};

const SIZE_INITIALS: Record<UserAvatarSize, 'xs' | 'sm' | 'md' | 'lg'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

export interface UserAvatarProps {
  /** Size preset (sm 32, md 40, lg 48, xl 80) or a custom pixel number. Default: `md`. */
  size?: UserAvatarSize | number;
  /** Explicit image URI. When provided, overrides the session user image. Pass `null` to force fallback. */
  imageUri?: string | null;
  /**
   * User display name — used to compute initials when no image is set.
   * Falls back to the session user's name; falls back to the generic person
   * icon when neither is available.
   */
  name?: string;
  /** Override icon color (used only when icon fallback renders). */
  fallbackColor?: string;
  /** Outer container className for borders, margins, etc. */
  className?: string;
  /** Outer container style (e.g. boxShadow). */
  style?: ViewStyle;
}

/**
 * User avatar with image / initials / icon fallback hierarchy:
 *   1. Resolved image URI (explicit `imageUri` or session user image)
 *   2. Initials computed from `name` (or session user name)
 *   3. Generic person icon
 *
 * Pulls session state automatically — pass `imageUri` / `name` only when
 * you need to render someone other than the current user (community feed,
 * shared profiles, etc.).
 */
export function UserAvatar({
  size = 'md',
  imageUri,
  name,
  fallbackColor,
  className,
  style,
}: UserAvatarProps) {
  const { data: session } = useSession();
  const scheme = useScheme();

  const px = typeof size === 'number' ? size : SIZE_PX[size];
  const radius = px / 2;
  const iconPx =
    typeof size === 'number' ? Math.round(size * 0.5) : SIZE_ICON[size];
  const initialsSize = typeof size === 'number' ? 'sm' : SIZE_INITIALS[size];

  const resolvedImage =
    imageUri !== undefined ? imageUri : session?.user?.image;
  const resolvedName = name ?? session?.user?.name;
  const resolvedFallback = fallbackColor ?? foregroundFor(scheme, 0.6);

  const initials = resolvedName ? computeInitials(resolvedName) : null;

  return (
    <View
      className={clsx(
        'items-center justify-center overflow-hidden bg-foreground/10',
        className,
      )}
      style={[{ width: px, height: px, borderRadius: radius }, style]}
    >
      {resolvedImage ? (
        <Image
          source={{ uri: resolvedImage }}
          style={{ width: '100%', height: '100%', borderRadius: radius }}
        />
      ) : initials ? (
        <Text size={initialsSize} weight="bold" tone="primary">
          {initials}
        </Text>
      ) : (
        <MaterialIcons name="person" size={iconPx} color={resolvedFallback} />
      )}
    </View>
  );
}

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
