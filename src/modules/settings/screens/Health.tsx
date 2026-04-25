import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROVIDER_LABEL =
  Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';

export default function Health() {
  const insets = useSafeAreaInsets();
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
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.15}
        intensity={0.5}
      />

      <View
        className="flex-row items-center gap-3 px-4 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="text-lg font-bold text-white">Health</Text>
      </View>

      <ScrollView contentContainerClassName="gap-4 px-4 py-4 pb-8">
        <View className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <View className="flex-row items-center gap-3">
            <View
              className={`h-10 w-10 items-center justify-center rounded-xl ${hasAccess ? 'bg-green-500/20' : 'bg-white/10'}`}
            >
              <MaterialIcons
                name={hasAccess ? 'check-circle' : 'favorite-border'}
                size={22}
                color={hasAccess ? colors.green[500] : colors.primary.pink}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-white">
                {hasAccess ? 'Connected' : 'Not connected'}
              </Text>
              <Text className="text-sm text-white/50">
                {hasAccess
                  ? `Reading from ${PROVIDER_LABEL}`
                  : `Connect to read HR & HRV from ${PROVIDER_LABEL}`}
              </Text>
            </View>
          </View>

          {hasAccess ? (
            <View className="mt-5 gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-white/60">Heart rate</Text>
                <Text className="text-sm font-semibold text-white">
                  {heartRate != null ? `${heartRate} bpm` : '—'}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-white/60">HRV</Text>
                <Text className="text-sm font-semibold text-white">
                  {hrv != null ? `${hrv.toFixed(1)} ms` : '—'}
                </Text>
              </View>
              {latestAt ? (
                <View className="flex-row justify-between">
                  <Text className="text-sm text-white/60">Last sample</Text>
                  <Text className="text-sm font-semibold text-white">
                    {latestAt.toLocaleString()}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {isAndroidUnavailable ? (
          <Text className="px-2 text-center text-xs leading-relaxed text-white/50">
            Health Connect isn&apos;t installed on this device. Install it from
            the Play Store and re-open this screen.
          </Text>
        ) : null}

        {hasAccess ? (
          <Pressable
            onPress={handleDisconnect}
            className="items-center rounded-2xl border border-red-500/20 bg-red-500/10 py-4 active:opacity-70"
          >
            <Text className="text-base font-semibold text-red-400">
              Disconnect
            </Text>
          </Pressable>
        ) : (
          <GradientButton
            onPress={handleConnect}
            loading={busy}
            disabled={isAndroidUnavailable}
            prefixIcon={
              <MaterialIcons name="favorite" size={18} color="white" />
            }
          >
            <Text>Connect to {PROVIDER_LABEL}</Text>
          </GradientButton>
        )}

        <Text className="px-2 text-center text-xs text-white/40">
          Phobik only reads HR and HRV — it never writes data to{' '}
          {PROVIDER_LABEL}.
        </Text>

        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
