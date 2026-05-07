import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

export type RingGradient = 'pink-yellow' | 'yellow-pink' | 'gold-pink';

const GRADIENT_STOPS: Record<RingGradient, [string, string]> = {
  'pink-yellow': [colors.primary.pink, colors.accent.yellow],
  'yellow-pink': [colors.accent.yellow, colors.primary.pink],
  'gold-pink': [colors.accent.gold, colors.primary.pink],
};

interface ScoreRingProps {
  value: number | null;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  gradient?: RingGradient;
  /** Eyebrow label below value (e.g. "Score", "of 100"). */
  caption?: string;
  /** Optional unit suffix shown next to the number (e.g. "%"). */
  suffix?: ReactNode;
  /** Big number override — render a custom React node instead of the value. */
  centerOverride?: ReactNode;
  /** Tailwind class for the value text. */
  valueClassName?: string;
}

export function ScoreRing({
  value,
  maxValue = 100,
  size = 160,
  strokeWidth = 12,
  gradient = 'pink-yellow',
  caption,
  suffix,
  centerOverride,
  valueClassName,
}: ScoreRingProps) {
  const scheme = useScheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value !== null ? Math.min(value / maxValue, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;
  const [from, to] = GRADIENT_STOPS[gradient];
  const gradientId = `score-ring-${gradient}`;

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={foregroundFor(scheme, 0.05)}
          strokeWidth={strokeWidth}
        />
        <Defs>
          <SvgLinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={from} />
            <Stop offset="100%" stopColor={to} />
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View className="absolute items-center">
        {centerOverride ?? (
          <View className="flex-row items-baseline">
            <Text
              className={clsx(
                value !== null ? 'text-5xl' : 'text-3xl',
                'font-black text-foreground',
                valueClassName,
              )}
              allowFontScaling={false}
            >
              {value !== null ? value : '—'}
            </Text>
            {suffix ? (
              <Text
                variant="sm"
                className="ml-0.5 font-bold text-foreground/60"
              >
                {suffix}
              </Text>
            ) : null}
          </View>
        )}
        {caption ? (
          <Text variant="caption" muted className="mt-1 font-bold">
            {caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
