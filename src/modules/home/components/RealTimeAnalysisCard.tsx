import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { GlowBg } from '@/components/ui/GlowBg';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { EaseView } from 'react-native-ease';
import { useTodayEnergyCheckIn } from '../hooks/useEnergyCheckIn';
import { useLatestBiometrics } from '../hooks/useLatestBiometrics';
import { useStressScore } from '../hooks/useStressScore';
import { EnergyRing } from './EnergyRing';

function PingDot({ animated }: { animated: boolean }) {
  const scheme = useScheme();
  const dotColor = accentFor(scheme, 'yellow');
  return (
    <View className="relative h-2 w-2">
      {animated ? (
        <EaseView
          initialAnimate={{ opacity: 0.75, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ type: 'timing', duration: 1000, loop: 'repeat' }}
          className="absolute h-full w-full rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
      <View
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
    </View>
  );
}

export function RealTimeAnalysisCard() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const { data: energyCheckIn } = useTodayEnergyCheckIn();
  const energyValue =
    energyCheckIn?.energyIndex != null
      ? (energyCheckIn.energyIndex as number)
      : null;
  const { heartRate, hrv, hasAccess, heartRateAt, hrvAt } =
    useLatestBiometrics();
  const stress = useStressScore();
  // `now` ticks every minute so the staleness derivation stays pure during
  // render — Date.now() inside the render path violates React purity rules
  // (the React Compiler will refuse to optimize it).
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const STALE_AFTER_MS = 2 * 60 * 60 * 1000;
  const latestAt =
    heartRateAt && hrvAt
      ? heartRateAt > hrvAt
        ? heartRateAt
        : hrvAt
      : (heartRateAt ?? hrvAt);
  const ageMs = latestAt ? now - latestAt.getTime() : null;
  const isStale = ageMs != null && ageMs > STALE_AFTER_MS;
  const hasData = heartRate != null || hrv != null;
  const isLive = hasAccess && hasData && !isStale;
  const ageLabel =
    ageMs == null
      ? null
      : ageMs < 60_000
        ? 'just now'
        : ageMs < 60 * 60_000
          ? `${Math.round(ageMs / 60_000)} min ago`
          : ageMs < 24 * 60 * 60_000
            ? `${Math.round(ageMs / (60 * 60_000))} hr ago`
            : `${Math.round(ageMs / (24 * 60 * 60_000))} d ago`;

  return (
    <DashboardCard glow>
      {/* Radial glow at top-right */}
      <GlowBg
        centerX={1}
        centerY={0}
        intensity={1}
        radius={0.35}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        bgClassName="bg-transparent"
      />

      {/* Header row */}
      <View className="mb-6 flex-row items-start justify-between">
        <View>
          <View className="mb-1 flex-row items-center gap-1.5">
            <PingDot animated={isLive} />
            <Text
              variant="caption"
              className="font-bold"
              style={{ color: yellow }}
            >
              Real-time Analysis
            </Text>
            {hasAccess && ageLabel && (isStale || !isLive) ? (
              <Text
                variant="caption"
                className="font-medium tracking-wider text-foreground/40"
              >
                · {ageLabel}
              </Text>
            ) : null}
          </View>
          <Text variant="h2" className="font-bold">
            {hasAccess && !hasData
              ? 'Waiting for sync'
              : (stress.label ?? 'Peaceful')}
          </Text>
          {hasAccess && !hasData ? (
            <Text variant="xs" className="mt-1 leading-snug text-foreground/50">
              Wear your device for a few minutes
            </Text>
          ) : stress.score != null ? (
            <Text
              variant="xs"
              className="mt-1 font-semibold tracking-wider text-foreground/40"
            >
              Stress {stress.score}/100
            </Text>
          ) : null}
        </View>
        {hasAccess ? null : (
          <Pressable
            onPress={() => router.push('/connect-wearable')}
            className="flex-row items-center gap-1.5 rounded-full border border-primary-pink/30 bg-primary-pink/20 px-4 py-1.5"
          >
            <MaterialIcons name="watch" size={14} color={colors.primary.pink} />
            <Text
              variant="caption"
              className="font-bold tracking-wider text-primary-pink"
              style={{ paddingRight: 1.1 }}
            >
              Connect
            </Text>
          </Pressable>
        )}
      </View>

      {/* Ring + metrics */}
      <View className="flex-row items-center justify-between gap-8 py-2">
        <Pressable onPress={() => router.push('/daily-check-in')}>
          <EnergyRing value={energyValue} />
        </Pressable>

        <View className="flex-1 justify-center gap-8">
          <View>
            <Text variant="caption" muted className="mb-1 font-bold">
              Heart Rate
            </Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text
                className="text-4xl font-black leading-none text-foreground"
                allowFontScaling={false}
              >
                {heartRate != null ? heartRate : '—'}
              </Text>
              <Text
                variant="sm"
                className="font-bold uppercase tracking-tighter text-primary-pink"
              >
                Bpm
              </Text>
            </View>
          </View>
          <View>
            <Text variant="caption" muted className="mb-1 font-bold">
              HRV Balance
            </Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text
                className="text-4xl font-black leading-none text-foreground"
                allowFontScaling={false}
              >
                {hrv != null ? hrv.toFixed(1) : '—'}
              </Text>
              <Text
                variant="sm"
                className="font-bold uppercase tracking-tighter"
                style={{ color: yellow }}
              >
                Ms
              </Text>
            </View>
          </View>
        </View>
      </View>
    </DashboardCard>
  );
}
