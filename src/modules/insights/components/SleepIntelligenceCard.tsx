import { DashboardCard } from '@/components/ui/DashboardCard';
import { IconChip } from '@/components/ui/IconChip';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { hasConnectedHealthAtom } from '@/modules/home/store/health-connection';
import { useSleepHistory } from '@/modules/insights/hooks/useSleepHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Pressable, Text, View } from 'react-native';

function summaryText(
  restorativePct: number | null,
  hasConnected: boolean,
): string {
  if (restorativePct == null) {
    return hasConnected
      ? 'Wear your device overnight to capture sleep stages.'
      : 'Connect Apple Health or Health Connect to track sleep.';
  }
  if (restorativePct >= 50)
    return 'Deep & REM cycles prioritized neural recovery.';
  if (restorativePct >= 35)
    return 'Healthy mix of restorative stages last night.';
  if (restorativePct >= 20)
    return 'Light sleep dominated — restorative stages were limited.';
  return 'Restorative stages were limited last night.';
}

export function SleepIntelligenceCard() {
  const router = useRouter();
  const scheme = useScheme();
  const range = useAtomValue(timeRangeAtom);
  const hasConnectedHealth = useAtomValue(hasConnectedHealthAtom);
  const { lastNight } = useSleepHistory(range);

  const restorativePct = lastNight?.restorativePct ?? null;
  const displayPct = restorativePct != null ? Math.round(restorativePct) : null;
  const wearableLabel = hasConnectedHealth
    ? 'Wearable Sync: ON'
    : 'Wearable Sync: OFF';

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-foreground/40">
          Sleep Intelligence
        </Text>
        <Text className="text-[9px] font-bold uppercase tracking-widest text-accent-yellow">
          {wearableLabel}
        </Text>
      </View>
      <Pressable onPress={() => router.push('/insights/sleep-quality')}>
        <DashboardCard className="flex-row items-center gap-6 overflow-hidden p-5">
          <View
            className="absolute -left-10 top-0 h-32 w-32 rounded-full"
            style={{ backgroundColor: withAlpha(colors.primary.pink, 0.1) }}
          />
          <IconChip
            size={64}
            shape="rounded"
            bg={foregroundFor(scheme, 0.05)}
            border={foregroundFor(scheme, 0.1)}
            className="relative z-10"
          >
            <MaterialIcons
              name="dark-mode"
              size={36}
              color={colors.accent.yellow}
              style={{
                textShadowColor: colors.accent.yellow,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            />
          </IconChip>
          <View className="relative z-10 flex-1">
            <View className="mb-1 flex-row items-end justify-between">
              <Text className="text-lg font-black text-foreground">
                Restorative Sleep
              </Text>
              <Text className="text-2xl font-black text-primary-pink">
                {displayPct != null ? `${displayPct}%` : '—'}
              </Text>
            </View>
            <View className="h-1.5 overflow-hidden rounded-full bg-foreground/5">
              {displayPct != null ? (
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: `${Math.min(100, displayPct)}%`,
                    height: '100%',
                    borderRadius: 9999,
                    boxShadow: `0px 0px 10px ${withAlpha(colors.primary['pink-soft'], 0.5)}`,
                  }}
                />
              ) : null}
            </View>
            <Text className="mt-3 text-[10px] font-medium text-foreground/40">
              {summaryText(restorativePct, hasConnectedHealth)}
            </Text>
          </View>
        </DashboardCard>
      </Pressable>
    </View>
  );
}
