import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BlurView } from '@/components/ui/BlurView';
import { NotificationBadge } from '@/components/ui/NotificationBadge';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { variantConfig } from '@/components/variant-config';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useSession } from '@/hooks/auth/useAuth';
import { useScheme } from '@/hooks/useTheme';
import { useUnreadCount } from '@/modules/notifications/hooks/useNotifications';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function DashboardHeader() {
  const { data: session } = useSession();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useScheme();
  const userName = session?.user?.name ?? 'Friend';
  const unreadCount = useUnreadCount();

  // Tint the blur with the active variant bg so the header reads as the
  // same surface as the screen behind it.
  const blurBg = withAlpha(variantConfig.default[scheme].bgHex, 0.7);

  return (
    <BlurView intensity={25} tint={scheme} style={{ backgroundColor: blurBg }}>
      <View
        className="flex-row items-center justify-between border-b border-foreground/10 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          testID="settings-button"
          onPress={() => router.push('/settings')}
          className="flex-row items-center gap-3"
        >
          <UserAvatar
            className="h-10 w-10 border-2 border-primary-pink/40 bg-foreground/10"
            style={{
              boxShadow: `0 4px 8px ${withAlpha(colors.primary.pink, 0.2)}`,
            }}
          />
          <View>
            <Text variant="caption" className="font-bold text-primary-pink">
              Welcome back
            </Text>
            <Text variant="h3" className="font-bold leading-tight">
              {userName}
            </Text>
          </View>
        </Pressable>
        <View className="relative">
          <Pressable
            onPress={() => router.push('/notifications')}
            className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
          >
            <MaterialIcons
              name="notifications"
              size={22}
              color={accentFor(scheme, 'yellow')}
            />
          </Pressable>
          <NotificationBadge count={unreadCount} />
        </View>
      </View>
    </BlurView>
  );
}
