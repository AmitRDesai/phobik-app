import { GlowBg } from '@/components/ui/GlowBg';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { colors, withAlpha } from '@/constants/colors';
import { useSession, useSignOut } from '@/hooks/auth/useAuth';
import { biometricEnabledAtom } from '@/store/auth';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BackButton } from '@/components/ui/BackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsMenuItem } from '../components/SettingsMenuItem';

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: session } = useSession();
  const signOut = useSignOut();
  const biometricEnabled = useAtomValue(biometricEnabledAtom);

  const userName = session?.user?.name ?? 'Friend';
  const userEmail = session?.user?.email ?? '';

  const handleLogout = async () => {
    const result = await dialog.error({
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        { label: 'Log Out', value: 'logout', variant: 'destructive' },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
      ],
    });

    if (result === 'logout') {
      await signOut.mutateAsync({ force: true });
    }
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.15}
        intensity={0.5}
      />

      {/* Header */}
      <View
        className="flex-row items-center gap-3 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="text-lg font-bold text-white">Settings</Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 px-4 py-4 pb-8">
        {/* User info */}
        <View className="items-center gap-3 py-4">
          <UserAvatar
            className="h-20 w-20 border-2 border-primary-pink/40 bg-white/10"
            iconSize={36}
          />
          <View className="items-center">
            <Text className="text-xl font-bold text-white">{userName}</Text>
            {userEmail ? (
              <Text className="text-sm text-white/50">{userEmail}</Text>
            ) : null}
          </View>
        </View>

        {/* Menu items */}
        <View className="gap-2">
          <SettingsMenuItem
            icon="person"
            label="Profile"
            subtitle="Edit your name and photo"
            onPress={() => router.push('/settings/profile')}
          />
          <SettingsMenuItem
            icon="notifications"
            iconColor={colors.accent.yellow}
            iconBgColor={withAlpha(colors.accent.yellow, 0.15)}
            label="Notifications"
            subtitle="Manage reminders"
            onPress={() => router.push('/settings/notifications')}
          />
          <SettingsMenuItem
            icon="fingerprint"
            iconColor={colors.accent.purple}
            iconBgColor={withAlpha(colors.purple[400], 0.15)}
            label="Biometric Login"
            subtitle="Quick sign-in settings"
            onPress={() => router.push('/settings/biometric')}
          />
          <SettingsMenuItem
            icon="calendar-today"
            iconColor={colors.accent.cyan}
            iconBgColor={withAlpha(colors.cyan[300], 0.15)}
            label="Calendar"
            subtitle="Connected calendars and check-ins"
            onPress={() => router.push('/settings/calendar')}
          />
          <SettingsMenuItem
            icon="favorite"
            iconColor={colors.primary.pink}
            iconBgColor={withAlpha(colors.primary.pink, 0.15)}
            label="Health"
            subtitle="Connect Apple Health or Health Connect"
            onPress={() => router.push('/settings/health')}
          />
          <SettingsMenuItem
            icon="library-music"
            iconColor={colors.accent.cyan}
            iconBgColor={withAlpha(colors.accent.cyan, 0.15)}
            label="Audio & Storage"
            subtitle="Voice preference and cached audio"
            onPress={() => router.push('/settings/audio-storage')}
          />
        </View>

        {/* Lock App + Logout */}
        <View className="mt-4 gap-3">
          {biometricEnabled && (
            <Pressable
              onPress={() => signOut.mutateAsync()}
              className="flex-row items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 active:opacity-70"
            >
              <MaterialIcons
                name="lock"
                size={20}
                color={colors.primary.pink}
              />
              <Text className="text-base font-semibold text-primary-pink">
                Lock App
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleLogout}
            className="items-center rounded-2xl border border-red-500/20 bg-red-500/10 py-4 active:opacity-70"
          >
            <Text className="text-base font-semibold text-red-400">
              Log Out
            </Text>
          </Pressable>
        </View>

        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
