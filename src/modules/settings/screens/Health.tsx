import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Text } from '@/components/themed/Text';
import { Platform, Pressable, View } from 'react-native';
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
      variant="default"
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
            <Text className="text-base font-semibold text-foreground">
              {hasAccess ? 'Connected' : 'Not connected'}
            </Text>
            <Text className="text-sm text-foreground/50">
              {hasAccess
                ? `Reading from ${PROVIDER_LABEL}`
                : `Connect to read HR & HRV from ${PROVIDER_LABEL}`}
            </Text>
          </View>
        </View>

        {hasAccess ? (
          <View className="mt-5 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-foreground/60">Heart rate</Text>
              <Text className="text-sm font-semibold text-foreground">
                {heartRate != null ? `${heartRate} bpm` : '—'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-foreground/60">HRV</Text>
              <Text className="text-sm font-semibold text-foreground">
                {hrv != null ? `${hrv.toFixed(1)} ms` : '—'}
              </Text>
            </View>
            {latestAt ? (
              <View className="flex-row justify-between">
                <Text className="text-sm text-foreground/60">Last sample</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {latestAt.toLocaleString()}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </Card>

      {isAndroidUnavailable ? (
        <Text className="px-2 text-center text-xs leading-relaxed text-foreground/50">
          Health Connect isn&apos;t installed on this device. Install it from
          the Play Store and re-open this screen.
        </Text>
      ) : null}

      {hasAccess ? (
        <Pressable
          onPress={handleDisconnect}
          className="items-center rounded-2xl border border-status-danger/20 bg-status-danger/10 py-4 active:opacity-70"
        >
          <Text className="text-base font-semibold text-status-danger">
            Disconnect
          </Text>
        </Pressable>
      ) : (
        <GradientButton
          onPress={handleConnect}
          loading={busy}
          disabled={isAndroidUnavailable}
          prefixIcon={<MaterialIcons name="favorite" size={18} color="white" />}
        >
          Connect to {PROVIDER_LABEL}
        </GradientButton>
      )}

      <Text className="px-2 text-center text-xs text-foreground/40">
        Phobik only reads HR and HRV — it never writes data to {PROVIDER_LABEL}.
      </Text>
    </Screen>
  );
}
