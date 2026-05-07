import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Linking, Platform, Pressable } from 'react-native';
import { EaseView } from 'react-native-ease';
import { openHealthConnectSettings } from 'react-native-health-connect';

import { useLatestBiometrics } from '../hooks/useLatestBiometrics';

const PROVIDER_LABEL =
  Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';
const HEALTH_CONNECT_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata';

function HealthHero({ pulsing }: { pulsing: boolean }) {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  return (
    <View className="mb-10 mt-6 items-center">
      <View className="relative mb-6 items-center justify-center">
        <View className="absolute h-24 w-24 overflow-hidden rounded-full">
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
        <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-primary-pink/30">
          {pulsing ? (
            <EaseView
              initialAnimate={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.1, opacity: 1 }}
              transition={{
                type: 'timing',
                duration: 1000,
                easing: [0.455, 0.03, 0.515, 0.955],
                loop: 'reverse',
              }}
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ borderWidth: 2, borderColor: yellow }}
            >
              <MaterialIcons name="favorite" size={28} color={yellow} />
            </EaseView>
          ) : (
            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ borderWidth: 2, borderColor: yellow }}
            >
              <MaterialIcons name="check" size={32} color={yellow} />
            </View>
          )}
        </View>
      </View>

      <Text variant="caption" className="mb-2 font-bold text-primary-pink">
        {pulsing ? `Connect to ${PROVIDER_LABEL}` : 'Connected'}
      </Text>
      <Text variant="h1" className="mb-3 font-bold">
        {pulsing ? 'Sync Your Wearable' : "You're synced"}
      </Text>
      <Text
        variant="sm"
        muted
        className="max-w-[300px] text-center leading-relaxed"
      >
        {pulsing
          ? `Phobik reads heart rate and HRV from ${PROVIDER_LABEL} — read-only, never written. Any wearable that syncs there (Apple Watch, Whoop, Oura, Garmin, Fitbit, Polar) works automatically.`
          : `Phobik is now reading your heart rate and HRV from ${PROVIDER_LABEL}.`}
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
      <Text variant="caption" muted className="mb-2 font-bold">
        {label}
      </Text>
      <View className="flex-row items-baseline gap-1.5">
        <Text className="text-4xl font-black leading-none text-foreground">
          {value}
        </Text>
        <Text
          variant="sm"
          className="font-bold uppercase tracking-tighter"
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
  const { heartRate, hrv, hasAccess, sdkAvailable, requestAccess } =
    useLatestBiometrics();
  const [requesting, setRequesting] = useState(false);

  const isAndroidUnavailable =
    Platform.OS === 'android' && sdkAvailable === false;

  const handleConnect = async () => {
    if (isAndroidUnavailable) {
      Linking.openURL(HEALTH_CONNECT_PLAY_STORE_URL).catch(() => {});
      return;
    }
    setRequesting(true);
    // requestAccess swallows its own errors and returns a boolean. Avoid
    // try/finally here — the React Compiler does not support `finally`.
    const ok = await requestAccess().catch(() => false);
    setRequesting(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await dialog.error({
        title: 'Permission needed',
        message: `Phobik needs read access to heart rate and HRV in ${PROVIDER_LABEL}. Open ${PROVIDER_LABEL} settings to grant access.`,
      });
    }
  };

  const openHealthSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('x-apple-health://').catch(() => {});
    } else {
      openHealthConnectSettings();
    }
  };

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          center={
            <Text
              variant="sm"
              muted
              className="font-bold uppercase tracking-[4px]"
              style={{ paddingRight: 4 }}
              numberOfLines={1}
            >
              Connect Wearable
            </Text>
          }
        />
      }
      className="px-6"
    >
      <HealthHero pulsing={!hasAccess} />

      {hasAccess ? (
        <View className="gap-4">
          <View className="flex-row gap-4">
            <MetricRow
              label="Heart Rate"
              value={heartRate != null ? String(heartRate) : '—'}
              unit="Bpm"
              unitColor={accentFor(scheme, 'pink')}
            />
            <MetricRow
              label="HRV"
              value={hrv != null ? hrv.toFixed(1) : '—'}
              unit="Ms"
              unitColor={accentFor(scheme, 'yellow')}
            />
          </View>
          {heartRate == null && hrv == null ? (
            <Text variant="sm" muted className="text-center leading-relaxed">
              No recent samples yet. Wear your device and sync it to{' '}
              {PROVIDER_LABEL}, then return here.
            </Text>
          ) : null}
          <Pressable
            onPress={openHealthSettings}
            className="mt-2 items-center py-3"
          >
            <Text variant="xs" muted className="font-semibold">
              Open {PROVIDER_LABEL} settings
            </Text>
          </Pressable>
        </View>
      ) : isAndroidUnavailable ? (
        <View className="gap-3">
          <Text
            variant="sm"
            className="text-center leading-relaxed text-foreground/70"
          >
            Health Connect isn&apos;t installed on this device. Install it from
            the Play Store, then return here to connect.
          </Text>
          <GradientButton
            onPress={handleConnect}
            prefixIcon={
              <MaterialIcons name="cloud-download" size={18} color="white" />
            }
          >
            Install Health Connect
          </GradientButton>
        </View>
      ) : (
        <GradientButton
          onPress={handleConnect}
          loading={requesting}
          prefixIcon={<MaterialIcons name="favorite" size={18} color="white" />}
        >
          Connect to {PROVIDER_LABEL}
        </GradientButton>
      )}
    </Screen>
  );
}
