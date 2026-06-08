import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { accentFor, foregroundFor, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { buildAreaLinePath } from '@/lib/charts/area-line-path';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const VIEW_W = 400;
const VIEW_H = 150;

interface TrendChartProps {
  values: number[];
  tone?: AccentHue;
  height?: number;
  /** Evenly-spaced labels rendered under the chart (e.g. weekday letters). */
  labels?: string[];
  emptyLabel?: string;
}

/** Lightweight area + line trend chart over a series of values (0–100ish). */
export function TrendChart({
  values,
  tone = 'pink',
  height = 160,
  labels,
  emptyLabel = 'Not enough data yet',
}: TrendChartProps) {
  const scheme = useScheme();
  const color = accentFor(scheme, tone);
  const { line, area } = buildAreaLinePath(values, {
    width: VIEW_W,
    height: VIEW_H,
  });
  const gradientId = `trend-${tone}`;

  return (
    <View className="gap-3">
      <View style={{ height }} className="w-full">
        {line ? (
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <Stop offset="100%" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Path d={area} fill={`url(#${gradientId})`} />
            <Path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : (
          <View
            className="h-full w-full items-center justify-center rounded-2xl"
            style={{ backgroundColor: foregroundFor(scheme, 0.03) }}
          >
            <Text size="xs" treatment="caption" tone="tertiary" align="center">
              {emptyLabel}
            </Text>
          </View>
        )}
      </View>
      {labels && labels.length > 0 ? (
        <View className="flex-row justify-between px-1">
          {labels.map((label, i) => (
            <Text
              key={`${label}-${i}`}
              size="xs"
              treatment="caption"
              tone="tertiary"
            >
              {label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
