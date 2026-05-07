import { View } from '@/components/themed/View';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function TypingIndicator() {
  const scheme = useScheme();
  const purple = accentFor(scheme, 'purple');
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const animate = (sv: SharedValue<number>, delay: number) => {
      sv.value = withRepeat(
        withDelay(
          delay,
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.3, { duration: 400 }),
          ),
        ),
        -1,
      );
    };
    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, [dot1, dot2, dot3]);

  const style1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const style3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View className="mb-4 flex-row gap-3">
      <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.08]">
        <MaterialIcons name="psychology" size={16} color={purple} />
      </View>
      <View className="flex-row items-center gap-1.5 pt-2">
        {[style1, style2, style3].map((style, i) => (
          <Animated.View
            key={i}
            className="h-[6px] w-[6px] rounded-full"
            style={[{ backgroundColor: purple }, style]}
          />
        ))}
      </View>
    </View>
  );
}
