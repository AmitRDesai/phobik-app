import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useSession, useSignOut } from '@/hooks/auth/useAuth';
import { biometricEnabledAtom } from '@/store/auth';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Pressable } from 'react-native';
import { SettingsMenuItem } from '../components/SettingsMenuItem';

export default function Settings() {
  const router = useRouter();
  const scheme = useScheme();
  const { data: session } = useSession();
  const signOut = useSignOut();
  const biometricEnabled = useAtomValue(biometricEnabledAtom);

  const yellow = accentFor(scheme, 'yellow');
  const purple = accentFor(scheme, 'purple');
  const cyan = accentFor(scheme, 'cyan');
  const pink = accentFor(scheme, 'pink');

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
    <Screen
      variant="default"
      scroll
      header={<Header title="Settings" />}
      className="px-4"
      contentClassName="gap-6"
    >
      <View className="items-center gap-3 py-4">
        <UserAvatar
          className="h-20 w-20 border-2 border-primary-pink/40 bg-foreground/10"
          iconSize={36}
        />
        <View className="items-center">
          <Text variant="h3">{userName}</Text>
          {userEmail ? (
            <Text variant="sm" muted>
              {userEmail}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="gap-2">
        <SettingsMenuItem
          icon="person"
          label="Profile"
          subtitle="Edit your name and photo"
          onPress={() => router.push('/settings/profile')}
        />
        <SettingsMenuItem
          icon={scheme === 'dark' ? 'dark-mode' : 'light-mode'}
          iconColor={yellow}
          iconBgColor={withAlpha(yellow, scheme === 'dark' ? 0.15 : 0.12)}
          label="Appearance"
          subtitle="Light, dark, or follow system"
          onPress={() => router.push('/settings/appearance')}
        />
        <SettingsMenuItem
          icon="notifications"
          iconColor={yellow}
          iconBgColor={withAlpha(yellow, scheme === 'dark' ? 0.15 : 0.12)}
          label="Notifications"
          subtitle="Manage reminders"
          onPress={() => router.push('/settings/notifications')}
        />
        <SettingsMenuItem
          icon="fingerprint"
          iconColor={purple}
          iconBgColor={withAlpha(purple, scheme === 'dark' ? 0.15 : 0.12)}
          label="Biometric Login"
          subtitle="Quick sign-in settings"
          onPress={() => router.push('/settings/biometric')}
        />
        <SettingsMenuItem
          icon="calendar-today"
          iconColor={cyan}
          iconBgColor={withAlpha(cyan, scheme === 'dark' ? 0.15 : 0.12)}
          label="Calendar"
          subtitle="Connected calendars and check-ins"
          onPress={() => router.push('/settings/calendar')}
        />
        <SettingsMenuItem
          icon="favorite"
          iconColor={pink}
          iconBgColor={withAlpha(pink, scheme === 'dark' ? 0.15 : 0.12)}
          label="Health"
          subtitle="Connect Apple Health or Health Connect"
          onPress={() => router.push('/settings/health')}
        />
        <SettingsMenuItem
          icon="library-music"
          iconColor={cyan}
          iconBgColor={withAlpha(cyan, scheme === 'dark' ? 0.15 : 0.12)}
          label="Audio & Storage"
          subtitle="Voice preference and cached audio"
          onPress={() => router.push('/settings/audio-storage')}
        />
      </View>

      <View className="mt-4 gap-3">
        {biometricEnabled && (
          <Card
            onPress={() => signOut.mutateAsync()}
            className="flex-row items-center justify-center gap-2 py-4"
          >
            <MaterialIcons name="lock" size={20} color={colors.primary.pink} />
            <Text variant="md" className="font-semibold text-primary-pink">
              Lock App
            </Text>
          </Card>
        )}
        <Pressable
          onPress={handleLogout}
          className="items-center rounded-2xl border border-status-danger/20 bg-status-danger/10 py-4 active:opacity-70"
        >
          <Text variant="md" className="font-semibold text-status-danger">
            Log Out
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
