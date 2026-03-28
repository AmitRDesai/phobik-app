import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BAR_WIDTH = 4;
const MIN_HEIGHT = 8;
const MAX_HEIGHT = 48;
const BASE_HEIGHTS = [
  { key: 'a', height: 16 },
  { key: 'b', height: 32 },
  { key: 'c', height: 48 },
  { key: 'd', height: 24 },
  { key: 'e', height: 40 },
  { key: 'f', height: 16 },
];

interface AudioVisualizerProps {
  levels?: number[] | null;
  isPlaying?: boolean;
}

function VisualizerBar({
  level,
  isPlaying,
  baseHeight,
  delay,
}: {
  level?: number;
  isPlaying: boolean;
  baseHeight: number;
  delay: number;
}) {
  const height = useSharedValue(MIN_HEIGHT);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimation(height);
      height.value = withTiming(MIN_HEIGHT, { duration: 300 });
      return;
    }
    if (level !== undefined) {
      // Driven by real PCM sample data
      const target = MIN_HEIGHT + level * (MAX_HEIGHT - MIN_HEIGHT);
      height.value = withTiming(target, {
        duration: 100,
        easing: Easing.out(Easing.quad),
      });
    } else {
      // Simulated animation fallback
      height.value = withRepeat(
        withSequence(
          withTiming(Math.min(baseHeight + 16, MAX_HEIGHT), {
            duration: 400 + delay,
          }),
          withTiming(Math.max(baseHeight - 8, MIN_HEIGHT), {
            duration: 300 + delay,
          }),
        ),
        -1,
        true,
      );
    }
  }, [level, isPlaying, baseHeight, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        { width: BAR_WIDTH, borderRadius: 2, overflow: 'hidden' },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[colors.accent.yellow, colors.primary.pink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1, borderRadius: 2 }}
      />
    </Animated.View>
  );
}

export function AudioVisualizer({
  levels,
  isPlaying = false,
}: AudioVisualizerProps) {
  return (
    <View className="h-12 flex-row items-end gap-1.5">
      {BASE_HEIGHTS.map((bar, i) => (
        <VisualizerBar
          key={bar.key}
          level={levels?.[i]}
          isPlaying={isPlaying}
          baseHeight={bar.height}
          delay={i * 80}
        />
      ))}
    </View>
  );
}
