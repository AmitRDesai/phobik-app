import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { DEVICE_DISPLAY_NAME } from '@/lib/biometrics/providers';
import { HealthProviderCard } from '@/modules/home/components/HealthProviderCard';
import { WhoopProviderCard } from '@/modules/home/components/WhoopProviderCard';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { useWhoopConnection } from '@/modules/home/hooks/useWhoopConnection';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Platform } from 'react-native';

const HEALTH_CONNECT_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata';

export default function Health() {
  const scheme = useScheme();
  const { hasAccess, sdkAvailable, requestAccess, disconnect } =
    useLatestBiometrics();
  const whoop = useWhoopConnection(hasAccess);
  const [busy, setBusy] = useState(false);

  const isAndroidUnavailable =
    Platform.OS === 'android' && sdkAvailable === false;

  const handleConnectDevice = async () => {
    if (isAndroidUnavailable) {
      Linking.openURL(HEALTH_CONNECT_PLAY_STORE_URL).catch(() => {});
      return;
    }
    setBusy(true);
    // requestAccess swallows its own errors. Avoid try/finally here — the
    // React Compiler does not support `finally`.
    const ok = await requestAccess().catch(() => false);
    setBusy(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDisconnectDevice = async () => {
    const result = await dialog.error({
      title: 'Disconnect Health',
      message: `Phobik will stop reading from ${DEVICE_DISPLAY_NAME}. To fully revoke access, toggle Phobik off in ${DEVICE_DISPLAY_NAME} settings.`,
      buttons: [
        { label: 'Disconnect', value: 'disconnect', variant: 'destructive' },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
      ],
    });
    if (result === 'disconnect') {
      await disconnect();
    }
  };

  return (
    <Screen
      scroll
      header={<Header title="Health" />}
      className="px-4"
      contentClassName="gap-3"
    >
      <Text
        size="xs"
        treatment="caption"
        tone="secondary"
        weight="bold"
        className="px-1 pt-1"
      >
        Connected sources
      </Text>

      <HealthProviderCard
        icon="favorite"
        name={DEVICE_DISPLAY_NAME}
        subtitle={
          hasAccess
            ? `Reading from ${DEVICE_DISPLAY_NAME}`
            : isAndroidUnavailable
              ? "Health Connect isn't installed on this device"
              : `Read HR, HRV & sleep from ${DEVICE_DISPLAY_NAME}`
        }
        connected={hasAccess}
        actionLabel={isAndroidUnavailable ? 'Install' : 'Connect'}
        onAction={handleConnectDevice}
        busy={busy}
        secondaryActionLabel="Disconnect"
        onSecondary={handleDisconnectDevice}
      />

      <WhoopProviderCard whoop={whoop} />

      {hasAccess && whoop.connected ? (
        <Card
          className="p-4"
          onPress={() => router.push('/settings/data-sources')}
        >
          <View className="flex-row items-center gap-3">
            <IconChip size="md" shape="rounded" tone="purple">
              {(color) => <MaterialIcons name="tune" size={20} color={color} />}
            </IconChip>
            <View className="flex-1">
              <Text size="md" weight="semibold">
                Data sources
              </Text>
              <Text size="sm" tone="secondary">
                Choose which source feeds each metric
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={foregroundFor(scheme, 0.3)}
            />
          </View>
        </Card>
      ) : null}

      <Text size="xs" align="center" tone="tertiary" className="mt-2 px-2">
        Phobik only reads your health data — it never writes back to your
        sources.
      </Text>
    </Screen>
  );
}
