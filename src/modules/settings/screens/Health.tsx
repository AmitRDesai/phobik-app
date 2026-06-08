import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { WhoopProviderCard } from '@/modules/home/components/WhoopProviderCard';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { useWhoopConnection } from '@/modules/home/hooks/useWhoopConnection';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Platform } from 'react-native';

const PROVIDER_LABEL =
  Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';

export default function Health() {
  const {
    heartRate,
    hrv,
    heartRateAt,
    hrvAt,
    hasAccess,
    sdkAvailable,
    requestAccess,
    disconnect,
  } = useLatestBiometrics();
  const whoop = useWhoopConnection(hasAccess);
  const [busy, setBusy] = useState(false);

  const isAndroidUnavailable =
    Platform.OS === 'android' && sdkAvailable === false;

  const handleConnect = async () => {
    setBusy(true);
    // requestAccess swallows its own errors. Avoid try/finally here — the
    // React Compiler does not support `finally`.
    const ok = await requestAccess().catch(() => false);
    setBusy(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDisconnect = async () => {
    const result = await dialog.error({
      title: 'Disconnect Health',
      message: `Phobik will stop reading from ${PROVIDER_LABEL}. To fully revoke access, toggle Phobik off in ${PROVIDER_LABEL} settings.`,
      buttons: [
        { label: 'Disconnect', value: 'disconnect', variant: 'destructive' },
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
      ],
    });
    if (result === 'disconnect') {
      await disconnect();
    }
  };

  const latestAt =
    heartRateAt && hrvAt
      ? heartRateAt > hrvAt
        ? heartRateAt
        : hrvAt
      : (heartRateAt ?? hrvAt);

  return (
    <Screen
      scroll
      header={<Header title="Health" />}
      className="px-4"
      contentClassName="gap-4"
    >
      <Card className="p-6">
        <View className="flex-row items-center gap-3">
          <IconChip
            size="md"
            shape="rounded"
            bg={hasAccess ? withAlpha(colors.status.success, 0.2) : undefined}
          >
            <MaterialIcons
              name={hasAccess ? 'check-circle' : 'favorite-border'}
              size={22}
              color={hasAccess ? colors.status.success : colors.primary.pink}
            />
          </IconChip>
          <View className="flex-1">
            <Text size="md" weight="semibold">
              {hasAccess ? 'Connected' : 'Not connected'}
            </Text>
            <Text size="sm" tone="secondary">
              {hasAccess
                ? `Reading from ${PROVIDER_LABEL}`
                : `Connect to read HR & HRV from ${PROVIDER_LABEL}`}
            </Text>
          </View>
        </View>

        {hasAccess ? (
          <View className="mt-5 gap-2">
            <View className="flex-row justify-between">
              <Text size="sm" tone="secondary">
                Heart rate
              </Text>
              <Text size="sm" weight="semibold">
                {heartRate != null ? `${heartRate} bpm` : '—'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text size="sm" tone="secondary">
                HRV
              </Text>
              <Text size="sm" weight="semibold">
                {hrv != null ? `${hrv.toFixed(1)} ms` : '—'}
              </Text>
            </View>
            {latestAt ? (
              <View className="flex-row justify-between">
                <Text size="sm" tone="secondary">
                  Last sample
                </Text>
                <Text size="sm" weight="semibold">
                  {latestAt.toLocaleString()}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </Card>

      {isAndroidUnavailable ? (
        <Text size="xs" tone="secondary" align="center" className="px-2">
          Health Connect isn&apos;t installed on this device. Install it from
          the Play Store and re-open this screen.
        </Text>
      ) : null}

      {hasAccess ? (
        <Button variant="destructive" onPress={handleDisconnect}>
          Disconnect
        </Button>
      ) : (
        <Button
          onPress={handleConnect}
          loading={busy}
          disabled={isAndroidUnavailable}
          prefixIcon={<MaterialIcons name="favorite" size={18} color="white" />}
        >
          Connect to {PROVIDER_LABEL}
        </Button>
      )}

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
          </View>
        </Card>
      ) : null}

      <Text size="xs" align="center" tone="tertiary" className="px-2">
        Phobik only reads your health data — it never writes back to your
        sources.
      </Text>
    </Screen>
  );
}
