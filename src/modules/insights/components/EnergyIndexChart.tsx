import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import { useEnergyCheckInHistory } from '@/modules/home/hooks/useEnergyCheckIn';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import { type TimeRange, timeRangeAtom } from '../store/insights';

const RANGE_TO_DAYS: Record<TimeRange, number> = {
  Day: 1,
  Week: 7,
  '2 Weeks': 14,
  Month: 30,
};

const VIEW_W = 400;
const VIEW_H = 150;

function formatLabel(date: string): string {
  return dayjs(date).format('M/D');
}

function pickLabelIndices(length: number, max = 4): number[] {
  if (length <= 0) return [];
  if (length <= max) return Array.from({ length }, (_, i) => i);
  const step = (length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => Math.round(i * step));
}

export function EnergyIndexChart() {
  const scheme = useScheme();
  const range = useAtomValue(timeRangeAtom);
  const days = RANGE_TO_DAYS[range];
  const { series, average, isLoading } = useEnergyCheckInHistory(days);

  const points = useMemo(() => {
    if (series.length === 0) return [];
    const denom = Math.max(series.length - 1, 1);
    return series.map((p, i) => ({
      x: (i / denom) * VIEW_W,
      y: VIEW_H - (Math.max(0, Math.min(100, p.value)) / 100) * VIEW_H,
      value: p.value,
      date: p.date,
    }));
  }, [series]);

  const linePath = useMemo(() => {
    if (points.length < 2) return null;
    return points
      .map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x},${pt.y}`)
      .join(' ');
  }, [points]);

  const areaPath = useMemo(() => {
    if (!linePath) return null;
    return `${linePath} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`;
  }, [linePath]);

  const labelIndices = pickLabelIndices(series.length);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text size="xs" treatment="caption" tone="secondary">
          Energy Index Trend
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full bg-primary-pink" />
          <Text size="xs" weight="bold">
            Avg. {average ?? '—'}
          </Text>
        </View>
      </View>
      <Card variant="raised" size="lg" className="overflow-hidden p-6">
        <View className="h-[180px] w-full">
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.primary['pink-soft']} />
                <Stop offset="100%" stopColor={colors.accent.gold} />
              </LinearGradient>
              <LinearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop
                  offset="0%"
                  stopColor={colors.primary['pink-soft']}
                  stopOpacity={0.25}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.primary['pink-soft']}
                  stopOpacity={0}
                />
              </LinearGradient>
            </Defs>
            <Line
              x1="0"
              y1="0"
              x2={VIEW_W}
              y2="0"
              stroke={foregroundFor(scheme, 0.05)}
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1={VIEW_H / 2}
              x2={VIEW_W}
              y2={VIEW_H / 2}
              stroke={foregroundFor(scheme, 0.05)}
              strokeWidth="1"
            />
            <Line
              x1="0"
              y1={VIEW_H}
              x2={VIEW_W}
              y2={VIEW_H}
              stroke={foregroundFor(scheme, 0.05)}
              strokeWidth="1"
            />
            {areaPath ? <Path d={areaPath} fill="url(#areaGrad)" /> : null}
            {linePath ? (
              <Path
                d={linePath}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
            {points.length === 1 ? (
              <Circle
                cx={points[0].x === 0 ? VIEW_W / 2 : points[0].x}
                cy={points[0].y}
                r={5}
                fill={colors.primary['pink-soft']}
              />
            ) : null}
          </Svg>
          <View className="absolute inset-0 justify-between py-1">
            <Text size="xs" treatment="caption" tone="tertiary">
              High
            </Text>
            <Text size="xs" treatment="caption" tone="tertiary">
              Med
            </Text>
            <Text size="xs" treatment="caption" tone="tertiary">
              Low
            </Text>
          </View>
          {!isLoading && series.length === 0 ? (
            <View className="absolute inset-0 items-center justify-center">
              <Text size="xs" tone="secondary" weight="semibold">
                No energy check-ins yet
              </Text>
            </View>
          ) : null}
        </View>
        {labelIndices.length > 0 ? (
          <View className="mt-4 flex-row justify-between">
            {labelIndices.map((i) => (
              <Text
                key={series[i].date}
                size="xs"
                tone="tertiary"
                weight="bold"
              >
                {formatLabel(series[i].date)}
              </Text>
            ))}
          </View>
        ) : null}
      </Card>
    </View>
  );
}
