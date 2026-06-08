import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { buildAreaLinePath } from '@/lib/charts/area-line-path';
import { useAnyHealthConnected } from '@/modules/home/hooks/useHealthConnections';
import {
  useBiometricHistory,
  type BiometricHistoryPoint,
} from '@/modules/insights/hooks/useBiometricHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { Pressable } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const VIEW_W = 400;
const VIEW_H = 150;

function timeLabels(
  points: BiometricHistoryPoint[],
  bucketLabel: 'hour' | 'day',
): { key: string; text: string }[] {
  if (points.length === 0) return [];
  const formatter =
    bucketLabel === 'hour'
      ? (d: Date) =>
          d
            .toLocaleTimeString([], { hour: 'numeric', hour12: true })
            .toUpperCase()
            .replace(' ', '')
      : (d: Date) =>
          d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const target = Math.min(5, points.length);
  const step = (points.length - 1) / Math.max(1, target - 1);
  const out: { key: string; text: string }[] = [];
  for (let i = 0; i < target; i++) {
    const idx = Math.round(i * step);
    const point = points[idx]!;
    out.push({ key: point.bucket, text: formatter(point.at) });
  }
  return out;
}

export function HrvRecoveryChart() {
  const scheme = useScheme();
  const accent = accentFor(scheme, 'yellow');
  const range = useAtomValue(timeRangeAtom);
  const hasConnectedHealth = useAnyHealthConnected();
  const hrv = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], range);
  const { line, area } = buildAreaLinePath(
    hrv.points.map((p) => p.value),
    { width: VIEW_W, height: VIEW_H },
  );
  const labels = timeLabels(hrv.points, hrv.bucketLabel);

  const latestValue = hrv.latest?.value ?? null;
  const deltaPct =
    hrv.avg != null && latestValue != null
      ? ((latestValue - hrv.avg) / hrv.avg) * 100
      : null;

  return (
    <View className="gap-4">
      <View className="flex-row items-end justify-between">
        <View>
          <Text size="h3" weight="bold">
            HRV Recovery
          </Text>
          <Text size="sm" tone="secondary">
            Heart Rate Variability trend
          </Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-baseline">
            <Text size="h2" weight="bold" style={{ color: accent }}>
              {latestValue != null ? latestValue.toFixed(0) : '—'}
            </Text>
            <Text size="xs" tone="secondary" className="ml-1">
              ms
            </Text>
          </View>
          {deltaPct != null ? (
            <Text
              size="xs"
              weight="bold"
              style={{
                color:
                  deltaPct >= 0 ? colors.status.success : colors.status.danger,
              }}
            >
              {deltaPct >= 0 ? '+' : ''}
              {deltaPct.toFixed(0)}% from avg
            </Text>
          ) : null}
        </View>
      </View>
      <Card variant="flat" size="md">
        <View className="h-[160px] w-full">
          {line ? (
            <Svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
            >
              <Defs>
                <LinearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={accent} stopOpacity={0.3} />
                  <Stop offset="100%" stopColor={accent} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Path d={area} fill="url(#hrvGrad)" />
              <Path
                d={line}
                fill="none"
                stroke={accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </Svg>
          ) : hasConnectedHealth ? (
            <View className="h-full w-full items-center justify-center">
              <Text
                size="xs"
                treatment="caption"
                tone="secondary"
                align="center"
              >
                {hrv.points.length > 0 ? 'Need more readings' : 'No data'}
              </Text>
              <Text
                size="xs"
                treatment="caption"
                tone="tertiary"
                align="center"
                className="mt-1"
              >
                {hrv.points.length > 0
                  ? `At least 2 HRV samples in different ${hrv.bucketLabel === 'hour' ? 'hours' : 'days'} to draw a trend`
                  : 'No HRV samples in this window'}
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={() => router.push('/settings/health')}
              className="h-full w-full items-center justify-center"
            >
              <Text size="xs" tone="secondary" align="center">
                Connect a health source for HRV trends.
              </Text>
              <Text
                size="xs"
                treatment="caption"
                tone="accent"
                className="mt-1"
              >
                Set up →
              </Text>
            </Pressable>
          )}
        </View>
        {labels.length > 0 ? (
          <View className="mt-4 flex-row justify-between px-1">
            {labels.map((label) => (
              <Text
                key={label.key}
                size="xs"
                treatment="caption"
                tone="tertiary"
              >
                {label.text}
              </Text>
            ))}
          </View>
        ) : null}
      </Card>
    </View>
  );
}
