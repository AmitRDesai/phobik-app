import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { EaseView } from 'react-native-ease';
import { openHealthConnectSettings } from 'react-native-health-connect';

import { useLatestBiometrics } from '../hooks/useLatestBiometrics';

const PROVIDER_LABEL =
  Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';
const HEALTH_CONNECT_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata';

function HealthHero({ pulsing }: { pulsing: boolean }) {
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
              className="h-16 w-16 items-center justify-center rounded-full border-2 border-accent-yellow"
            >
              <MaterialIcons
                name="favorite"
                size={28}
                color={colors.accent.yellow}
              />
            </EaseView>
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-accent-yellow">
              <MaterialIcons
                name="check"
                size={32}
                color={colors.accent.yellow}
              />
            </View>
          )}
        </View>
      </View>

      <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-pink">
        {pulsing ? `Connect to ${PROVIDER_LABEL}` : 'Connected'}
      </Text>
      <Text className="mb-3 text-3xl font-bold tracking-tight text-white">
        {pulsing ? 'Sync Your Wearable' : "You're synced"}
      </Text>
      <Text className="max-w-[300px] text-center text-sm leading-relaxed text-slate-400">
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
  unitColorClass,
}: {
  label: string;
  value: string;
  unit: string;
  unitColorClass: string;
}) {
  return (
    <View className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-5">
      <Text className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </Text>
      <View className="flex-row items-baseline gap-1.5">
        <Text className="text-4xl font-black leading-none text-white">
          {value}
        </Text>
        <Text
          className={`text-[14px] font-bold uppercase tracking-tighter ${unitColorClass}`}
        >
          {unit}
        </Text>
      </View>
    </View>
  );
}

export default function ConnectWearable() {
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
    <Container safeAreaClass="bg-background-dashboard">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.2}
        intensity={0.6}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />

      <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
        <BackButton />
        <Text
          className="text-sm font-bold uppercase tracking-[4px] text-white/60"
          numberOfLines={1}
        >
          Connect Wearable
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <HealthHero pulsing={!hasAccess} />

        {hasAccess ? (
          <View className="gap-4">
            <View className="flex-row gap-4">
              <MetricRow
                label="Heart Rate"
                value={heartRate != null ? String(heartRate) : '—'}
                unit="Bpm"
                unitColorClass="text-primary-pink"
              />
              <MetricRow
                label="HRV"
                value={hrv != null ? hrv.toFixed(1) : '—'}
                unit="Ms"
                unitColorClass="text-accent-yellow"
              />
            </View>
            {heartRate == null && hrv == null ? (
              <Text className="text-center text-xs leading-relaxed text-slate-400">
                No recent samples yet. Wear your device and sync it to{' '}
                {PROVIDER_LABEL}, then return here.
              </Text>
            ) : null}
            <Pressable
              onPress={openHealthSettings}
              className="mt-2 items-center py-3"
            >
              <Text className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Open {PROVIDER_LABEL} settings
              </Text>
            </Pressable>
          </View>
        ) : isAndroidUnavailable ? (
          <View className="gap-3">
            <Text className="text-center text-sm leading-relaxed text-white/70">
              Health Connect isn&apos;t installed on this device. Install it
              from the Play Store, then return here to connect.
            </Text>
            <GradientButton
              onPress={handleConnect}
              prefixIcon={
                <MaterialIcons name="cloud-download" size={18} color="white" />
              }
            >
              <Text>Install Health Connect</Text>
            </GradientButton>
          </View>
        ) : (
          <GradientButton
            onPress={handleConnect}
            loading={requesting}
            prefixIcon={
              <MaterialIcons name="favorite" size={18} color="white" />
            }
          >
            <Text>Connect to {PROVIDER_LABEL}</Text>
          </GradientButton>
        )}
      </ScrollView>
    </Container>
  );
}
