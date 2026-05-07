import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

interface EnergyRingProps {
  value: number | null;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
}

export function EnergyRing({
  value,
  maxValue = 100,
  size = 160,
  strokeWidth = 12,
}: EnergyRingProps) {
  const scheme = useScheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value !== null ? Math.min(value / maxValue, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

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
          <SvgLinearGradient
            id="energyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={colors.primary.pink} />
            <Stop offset="100%" stopColor={colors.accent.yellow} />
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#energyGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View className="absolute items-center">
        <Text
          className={clsx(
            value !== null ? 'text-5xl' : 'text-3xl',
            'font-black text-foreground',
          )}
          style={{
            textShadowColor: withAlpha(colors.primary.pink, 0.5),
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          }}
        >
          {value !== null ? value : 'N/A'}
        </Text>
        <Text variant="caption" muted className="mt-1 font-bold">
          Energy
        </Text>
      </View>
    </View>
  );
}
