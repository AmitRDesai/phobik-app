import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { EaseView } from 'react-native-ease';

import { DashboardCard } from '@/components/ui/DashboardCard';
import { EnergyRing } from './EnergyRing';
import { useTodayEnergyCheckIn } from '../hooks/useEnergyCheckIn';
import { useLatestBiometrics } from '../hooks/useLatestBiometrics';
import { useStressScore } from '../hooks/useStressScore';

function PingDot({ animated }: { animated: boolean }) {
  return (
    <View className="relative h-2 w-2">
      {animated ? (
        <EaseView
          initialAnimate={{ opacity: 0.75, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ type: 'timing', duration: 1000, loop: 'repeat' }}
          className="absolute h-full w-full rounded-full bg-accent-yellow"
        />
      ) : null}
      <View className="h-2 w-2 rounded-full bg-accent-yellow" />
    </View>
  );
}

export function RealTimeAnalysisCard() {
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
            <Text className="text-[10px] font-bold uppercase tracking-widest text-accent-yellow">
              Real-time Analysis
            </Text>
            {hasAccess && ageLabel && (isStale || !isLive) ? (
              <Text className="text-[10px] font-medium tracking-wider text-foreground/40">
                · {ageLabel}
              </Text>
            ) : null}
          </View>
          <Text className="text-2xl font-bold tracking-tight text-foreground">
            {hasAccess && !hasData
              ? 'Waiting for sync'
              : (stress.label ?? 'Peaceful')}
          </Text>
          {hasAccess && !hasData ? (
            <Text className="mt-1 text-[11px] leading-snug text-foreground/50">
              Wear your device for a few minutes
            </Text>
          ) : stress.score != null ? (
            <Text className="mt-1 text-[11px] font-semibold tracking-wider text-foreground/40">
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
            <Text className="text-[10px] font-bold uppercase tracking-wider text-primary-pink">
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
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-widest text-foreground/60">
              Heart Rate
            </Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-4xl font-black leading-none text-foreground">
                {heartRate != null ? heartRate : '—'}
              </Text>
              <Text className="text-[14px] font-bold uppercase tracking-tighter text-primary-pink">
                Bpm
              </Text>
            </View>
          </View>
          <View>
            <Text className="mb-1 text-[12px] font-bold uppercase tracking-widest text-foreground/60">
              HRV Balance
            </Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-4xl font-black leading-none text-foreground">
                {hrv != null ? hrv.toFixed(1) : '—'}
              </Text>
              <Text className="text-[14px] font-bold uppercase tracking-tighter text-accent-yellow">
                Ms
              </Text>
            </View>
          </View>
        </View>
      </View>
    </DashboardCard>
  );
}
