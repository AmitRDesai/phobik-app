import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';

type Point = { x: number; y: number };

type GradientTextProps = {
  children: string;
  className?: string;
  startColor?: string;
  endColor?: string;
  /** Gradient start point. Default: top-left {x:0,y:0}. */
  start?: Point;
  /** Gradient end point. Default: top-right {x:1,y:0} (horizontal sweep). */
  end?: Point;
};

const DEFAULT_START: Point = { x: 0, y: 0 };
const DEFAULT_END: Point = { x: 1, y: 0 };

export function GradientText({
  children,
  className = '',
  startColor = colors.primary.pink,
  endColor = colors.accent.yellow,
  start = DEFAULT_START,
  end = DEFAULT_END,
}: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text className={className} style={{ color: 'white' }}>
          {children}
        </Text>
      }
    >
      <LinearGradient colors={[startColor, endColor]} start={start} end={end}>
        <Text className={className} style={{ opacity: 0 }}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
