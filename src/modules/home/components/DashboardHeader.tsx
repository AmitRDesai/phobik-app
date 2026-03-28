import { UserAvatar } from '@/components/ui/UserAvatar';
import { colors, withAlpha } from '@/constants/colors';
import { useSession } from '@/lib/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function DashboardHeader() {
  const { data: session } = useSession();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userName = session?.user?.name ?? 'Friend';

  const content = (
    <View
      className="flex-row items-center justify-between border-b border-white/10 px-4 pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <Pressable
        onPress={() => router.push('/settings')}
        className="flex-row items-center gap-3"
      >
        <UserAvatar className="h-10 w-10 border-2 border-primary-pink/40 bg-white/10 ios:shadow-lg ios:shadow-primary-pink/20 android:elevation-2" />
        <View>
          <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
            Welcome back
          </Text>
          <Text className="text-lg font-bold leading-tight text-white">
            {userName}
          </Text>
        </View>
      </Pressable>
      <Pressable className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <MaterialIcons
          name="notifications"
          size={22}
          color={colors.accent.yellow}
        />
      </Pressable>
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <View
        style={{ backgroundColor: withAlpha(colors.background.dashboard, 0.7) }}
      >
        {content}
      </View>
    );
  }

  return (
    <BlurView
      intensity={25}
      tint="dark"
      style={{ backgroundColor: withAlpha(colors.background.dashboard, 0.7) }}
    >
      {content}
    </BlurView>
  );
}
