import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useSession, useSignOut } from '@/hooks/auth/useAuth';
import { disconnectPowerSync } from '@/lib/powersync';
import { biometricEnabledAtom } from '@/store/auth';
import { dialog } from '@/utils/dialog';
import { env } from '@/utils/env';
import { toast } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { SettingsMenuItem } from '../components/SettingsMenuItem';

async function handleResetLocalDb() {
  const choice = await dialog.error({
    title: 'Reset local database?',
    message:
      'Wipes all data on this device (journal drafts, in-progress flows, cached affirmations, etc.). Synced data will redownload from the server on next launch. Use this after schema changes.',
    buttons: [
      { label: 'Reset', value: 'reset', variant: 'destructive' },
      { label: 'Cancel', value: 'cancel', variant: 'secondary' },
    ],
  });
  if (choice !== 'reset') return;
  try {
    await disconnectPowerSync();
    toast.success('Local DB cleared — force-quit and relaunch the app.');
  } catch (err) {
    console.error('[ResetLocalDb]', err);
    toast.error('Failed to reset local DB. Check console for details.');
  }
}

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
      scroll
      header={<Header title="Settings" />}
      className="px-4"
      contentClassName="gap-6"
    >
      <View className="items-center gap-3 py-4">
        <UserAvatar size={80} className="border-2 border-primary-pink/40" />
        <View className="items-center">
          <Text size="h3">{userName}</Text>
          {userEmail ? (
            <Text size="sm" tone="secondary">
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
          subtitle="Connect your health sources & WHOOP"
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

      {env.get('ENV') !== 'production' && (
        <View className="gap-2">
          <Text size="xs" treatment="caption" tone="secondary" className="px-2">
            Prototypes & Experiments
          </Text>
          <SettingsMenuItem
            icon="science"
            iconColor={purple}
            iconBgColor={withAlpha(purple, scheme === 'dark' ? 0.15 : 0.12)}
            label="Browse all"
            subtitle="POCs & screens not yet in the nav"
            onPress={() => router.push('/dev/pocs')}
          />
        </View>
      )}

      {__DEV__ && (
        <View className="gap-2">
          <Text size="xs" treatment="caption" tone="secondary" className="px-2">
            Developer
          </Text>
          <SettingsMenuItem
            icon="palette"
            iconColor={purple}
            iconBgColor={withAlpha(purple, scheme === 'dark' ? 0.15 : 0.12)}
            label="Design System"
            subtitle="Catalog of primitives & variants"
            onPress={() => router.push('/dev/design-system')}
          />
          <SettingsMenuItem
            icon="face"
            iconColor={purple}
            iconBgColor={withAlpha(purple, scheme === 'dark' ? 0.15 : 0.12)}
            label="Characters"
            subtitle="Sunny, Olive, Eddy, Dash"
            onPress={() => router.push('/dev/characters')}
          />
          <SettingsMenuItem
            icon="delete-sweep"
            iconColor={colors.status.danger}
            iconBgColor={withAlpha(
              colors.status.danger,
              scheme === 'dark' ? 0.15 : 0.12,
            )}
            label="Reset Local DB"
            subtitle="Wipes on-device data — relaunch after"
            onPress={handleResetLocalDb}
          />
        </View>
      )}

      <View className="mt-4 gap-3">
        {biometricEnabled && (
          <Button
            variant="secondary"
            onPress={() => signOut.mutateAsync({})}
            prefixIcon={
              <MaterialIcons
                name="lock"
                size={20}
                color={colors.primary.pink}
              />
            }
          >
            Lock App
          </Button>
        )}
        <Button variant="destructive" onPress={handleLogout}>
          Log Out
        </Button>
      </View>
    </Screen>
  );
}
