import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BAR_HEIGHTS = [16, 32, 48, 24, 40, 16];
const BAR_WIDTH = 4;
const MAX_HEIGHT = 48;

function VisualizerBar({
  baseHeight,
  delay,
}: {
  baseHeight: number;
  delay: number;
}) {
  const height = useSharedValue(baseHeight);

  useEffect(() => {
    height.value = withRepeat(
      withSequence(
        withTiming(Math.min(baseHeight + 16, MAX_HEIGHT), {
          duration: 400 + delay,
        }),
        withTiming(Math.max(baseHeight - 8, 8), { duration: 300 + delay }),
      ),
      -1,
      true,
    );
  }, [baseHeight, delay, height]);

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

export function AudioVisualizer() {
  return (
    <View className="h-12 flex-row items-end gap-1.5">
      {BAR_HEIGHTS.map((h, i) => (
        <VisualizerBar key={i} baseHeight={h} delay={i * 80} />
      ))}
    </View>
  );
}
