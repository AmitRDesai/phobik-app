import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlowBg } from '@/components/ui/GlowBg';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { DEVICE_DISPLAY_NAME } from '@/lib/biometrics/providers';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Linking, Platform } from 'react-native';
import { EaseView } from 'react-native-ease';
import { openHealthConnectSettings } from 'react-native-health-connect';

import { HealthProviderCard } from '../components/HealthProviderCard';
import { WhoopProviderCard } from '../components/WhoopProviderCard';
import { useLatestBiometrics } from '../hooks/useLatestBiometrics';
import { useWhoopConnection } from '../hooks/useWhoopConnection';

const HEALTH_CONNECT_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata';

function openHealthSettings() {
  if (Platform.OS === 'ios') {
    Linking.openURL('x-apple-health://').catch(() => {});
  } else {
    openHealthConnectSettings();
  }
}

function HealthHero({ connected }: { connected: boolean }) {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  return (
    <View className="mb-8 mt-6 items-center">
      <View className="relative mb-6 items-center justify-center">
        <View className="absolute size-24 overflow-hidden rounded-full">
          <GlowBg
            centerX={0.5}
            centerY={0.5}
            intensity={2}
            radius={0.5}
            startColor={colors.primary.pink}
            endColor={colors.accent.yellow}
            bgClassName="bg-transparent"
          />
        </View>
        <View className="size-24 items-center justify-center rounded-full border-2 border-primary-pink/30">
          {connected ? (
            <View
              className="size-16 items-center justify-center rounded-full"
              style={{ borderWidth: 2, borderColor: yellow }}
            >
              <MaterialIcons name="check" size={32} color={yellow} />
            </View>
          ) : (
            <EaseView
              initialAnimate={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.1, opacity: 1 }}
              transition={{
                type: 'timing',
                duration: 1000,
                easing: [0.455, 0.03, 0.515, 0.955],
                loop: 'reverse',
              }}
              className="size-16 items-center justify-center rounded-full"
              style={{ borderWidth: 2, borderColor: yellow }}
            >
              <MaterialIcons name="favorite" size={28} color={yellow} />
            </EaseView>
          )}
        </View>
      </View>

      <Text
        size="xs"
        treatment="caption"
        tone="accent"
        weight="bold"
        className="mb-2"
      >
        {connected ? 'Connected' : 'Your sources'}
      </Text>
      <Text size="h1" align="center" className="mb-3">
        {connected ? "You're synced" : 'Sync Your Wearables'}
      </Text>
      <Text
        size="sm"
        tone="secondary"
        align="center"
        className="max-w-[300px] leading-relaxed"
      >
        {connected
          ? 'Phobik is reading your biometrics. Add or manage a source below.'
          : 'Connect a source below. Phobik reads recovery, heart rate, HRV and sleep — read-only, never written.'}
      </Text>
    </View>
  );
}

function MetricRow({
  label,
  value,
  unit,
  unitColor,
}: {
  label: string;
  value: string;
  unit: string;
  unitColor: string;
}) {
  return (
    <Card className="flex-1 p-5">
      <Text
        size="xs"
        treatment="caption"
        tone="secondary"
        weight="bold"
        className="mb-2"
      >
        {label}
      </Text>
      <View className="flex-row items-baseline gap-1.5">
        <Text size="display" weight="black" className="leading-none">
          {value}
        </Text>
        <Text
          size="sm"
          weight="bold"
          className="uppercase tracking-tighter"
          style={{ color: unitColor }}
        >
          {unit}
        </Text>
      </View>
    </Card>
  );
}

export default function ConnectWearable() {
  const scheme = useScheme();
  const device = useLatestBiometrics();
  const whoop = useWhoopConnection(device.hasAccess);
  const [deviceBusy, setDeviceBusy] = useState(false);

  const isAndroidUnavailable =
    Platform.OS === 'android' && device.sdkAvailable === false;

  const anyConnected = device.hasAccess || whoop.connected;

  const handleConnectDevice = async () => {
    if (isAndroidUnavailable) {
      Linking.openURL(HEALTH_CONNECT_PLAY_STORE_URL).catch(() => {});
      return;
    }
    setDeviceBusy(true);
    // requestAccess swallows its own errors and returns a boolean. Avoid
    // try/finally here — the React Compiler does not support `finally`.
    const ok = await device.requestAccess().catch(() => false);
    setDeviceBusy(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await dialog.error({
        title: 'Permission needed',
        message: `Phobik needs read access to heart rate and HRV in ${DEVICE_DISPLAY_NAME}. Open ${DEVICE_DISPLAY_NAME} settings to grant access.`,
      });
    }
  };

  return (
    <Screen
      scroll
      header={<Header title="Connect Wearable" />}
      className="px-6"
      contentClassName="gap-3"
    >
      <HealthHero connected={anyConnected} />

      <HealthProviderCard
        icon="favorite"
        name={DEVICE_DISPLAY_NAME}
        subtitle={
          device.hasAccess
            ? `Reading from ${DEVICE_DISPLAY_NAME}`
            : isAndroidUnavailable
              ? "Health Connect isn't installed on this device"
              : `Read HR, HRV & sleep from ${DEVICE_DISPLAY_NAME}`
        }
        connected={device.hasAccess}
        actionLabel={isAndroidUnavailable ? 'Install' : 'Connect'}
        onAction={handleConnectDevice}
        busy={deviceBusy}
        secondaryActionLabel="Settings"
        onSecondary={openHealthSettings}
      />

      <WhoopProviderCard whoop={whoop} />

      {device.hasAccess ? (
        <View className="mt-4 flex-row gap-3">
          <MetricRow
            label="Heart Rate"
            value={device.heartRate != null ? String(device.heartRate) : '—'}
            unit="Bpm"
            unitColor={accentFor(scheme, 'pink')}
          />
          <MetricRow
            label="HRV"
            value={device.hrv != null ? device.hrv.toFixed(1) : '—'}
            unit="Ms"
            unitColor={accentFor(scheme, 'yellow')}
          />
        </View>
      ) : null}

      <Text
        size="xs"
        align="center"
        tone="tertiary"
        className="mt-4 px-2 leading-relaxed"
      >
        Read-only — Phobik never writes to your health data.
      </Text>
    </Screen>
  );
}
