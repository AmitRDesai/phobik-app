import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface RegulationScoreRingProps {
  percentage: number;
}

const SIZE = 120;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RegulationScoreRing({ percentage }: RegulationScoreRingProps) {
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
          {/* Background ring */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Progress ring */}
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
          <Text className="text-3xl font-bold text-foreground">
            {percentage}%
          </Text>
        </View>
      </View>
      <Text className="text-center text-xs text-zinc-400">{getLabel()}</Text>
    </View>
  );
}
