import { BlurView } from '@/components/ui/BlurView';
import { NotificationBadge } from '@/components/ui/NotificationBadge';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useSession } from '@/hooks/auth/useAuth';
import { useUnreadCount } from '@/modules/notifications/hooks/useNotifications';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function DashboardHeader() {
  const { data: session } = useSession();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useScheme();
  const userName = session?.user?.name ?? 'Friend';
  const unreadCount = useUnreadCount();

  const blurBg =
    scheme === 'dark'
      ? withAlpha(colors.background.dashboard, 0.7)
      : 'rgba(250,250,250,0.7)';

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
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
              Welcome back
            </Text>
            <Text className="text-lg font-bold leading-tight text-foreground">
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
              color={colors.accent.yellow}
            />
          </Pressable>
          <NotificationBadge count={unreadCount} />
        </View>
      </View>
    </BlurView>
  );
}
