import { colors } from '@/constants/colors';
import { hasConnectedHealthAtom } from '@/modules/home/store/health-connection';
import {
  useBiometricHistory,
  type BiometricHistoryPoint,
} from '@/modules/insights/hooks/useBiometricHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { useAtomValue } from 'jotai';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const VIEW_W = 400;
const VIEW_H = 150;
const PAD = 8;

function buildAreaAndLine(points: BiometricHistoryPoint[]): {
  line: string;
  area: string;
} {
  if (points.length < 2) return { line: '', area: '' };
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = (VIEW_W - PAD * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = PAD + i * xStep;
    const y = PAD + (VIEW_H - PAD * 2) * (1 - (p.value - min) / range);
    return { x, y };
  });
  const line = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ');
  const first = coords[0]!;
  const last = coords[coords.length - 1]!;
  const area = `${line} L${last.x.toFixed(1)},${VIEW_H} L${first.x.toFixed(1)},${VIEW_H} Z`;
  return { line, area };
}

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
  // Pick up to 5 evenly spaced labels. The `key` is the source bucket id,
  // which is stable per data point and never reorders.
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
  const range = useAtomValue(timeRangeAtom);
  const hasConnectedHealth = useAtomValue(hasConnectedHealthAtom);
  const hrv = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], range);
  const { line, area } = buildAreaAndLine(hrv.points);
  const labels = timeLabels(hrv.points, hrv.bucketLabel);

  const latestValue = hrv.latest?.value ?? null;
  const deltaPct =
    hrv.avg != null && latestValue != null
      ? ((latestValue - hrv.avg) / hrv.avg) * 100
      : null;

  return (
    <View className="gap-4 px-4">
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-lg font-bold text-foreground">
            HRV Recovery
          </Text>
          <Text className="text-sm text-foreground/40">
            Heart Rate Variability trend
          </Text>
        </View>
        <View className="items-end">
          <Text
            className="text-2xl font-bold tracking-tight"
            style={{
              color: colors.amber[400],
              textShadowColor: colors.amber[400],
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 4,
            }}
          >
            {latestValue != null ? latestValue.toFixed(0) : '—'}{' '}
            <Text className="text-xs font-normal">ms</Text>
          </Text>
          {deltaPct != null ? (
            <Text
              className="text-xs font-bold"
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
      <View className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 p-4">
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
                  <Stop
                    offset="0%"
                    stopColor={colors.amber[400]}
                    stopOpacity={0.3}
                  />
                  <Stop
                    offset="100%"
                    stopColor={colors.amber[400]}
                    stopOpacity={0}
                  />
                </LinearGradient>
              </Defs>
              <Path d={area} fill="url(#hrvGrad)" />
              <Path
                d={line}
                fill="none"
                stroke={colors.amber[400]}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </Svg>
          ) : hasConnectedHealth ? (
            <View className="h-full w-full items-center justify-center">
              <Text className="text-center text-xs font-semibold uppercase tracking-widest text-foreground/40">
                No data
              </Text>
              <Text className="mt-1 text-[10px] text-foreground/30">
                No HRV samples in this window
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={() => router.push('/settings/health')}
              className="h-full w-full items-center justify-center"
            >
              <Text className="text-center text-xs text-foreground/40">
                Connect Apple Health or Health Connect for HRV trends.
              </Text>
              <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary-pink">
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
                className="text-[10px] font-bold uppercase text-foreground/30"
              >
                {label.text}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}
