import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface RegulationScoreRingProps {
  percentage: number;
}

const SIZE = 120;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RegulationScoreRing({ percentage }: RegulationScoreRingProps) {
  const scheme = useScheme();
  const trackColor = foregroundFor(scheme, 0.06);
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100;

  const getLabel = () => {
    if (percentage >= 75) return 'Highly resilient under moderate stress.';
    if (percentage >= 50) return 'Growing resilience with room to expand.';
    return 'Building your regulation capacity.';
  };

  return (
    <View className="items-center rounded-2xl border border-foreground/5 bg-foreground/[0.03] p-5">
      <View className="relative mb-3 items-center justify-center">
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.primary.pink} />
              <Stop offset="1" stopColor={colors.accent.yellow} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={trackColor}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#ringGrad)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View className="absolute items-center">
          <Text variant="h1" className="font-bold">
            {percentage}%
          </Text>
        </View>
      </View>
      <Text variant="sm" muted className="text-center">
        {getLabel()}
      </Text>
    </View>
  );
}
