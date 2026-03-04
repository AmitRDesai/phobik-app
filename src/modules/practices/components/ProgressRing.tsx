import { colors } from '@/constants/colors';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const SIZE = 256;
const STROKE_WIDTH = 4;
const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ProgressRingProps {
  /** Progress from 0 to 1 */
  progress: number;
}

export function ProgressRing({ progress }: ProgressRingProps) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Svg
      width={SIZE}
      height={SIZE}
      style={{ transform: [{ rotate: '-90deg' }] }}
    >
      <Defs>
        <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={colors.primary.pink} />
          <Stop offset="100%" stopColor={colors.accent.yellow} />
        </LinearGradient>
      </Defs>
      {/* Background track */}
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="transparent"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={STROKE_WIDTH}
      />
      {/* Progress arc */}
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="transparent"
        stroke="url(#progressGradient)"
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
}
