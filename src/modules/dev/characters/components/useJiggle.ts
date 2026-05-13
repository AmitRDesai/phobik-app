import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function useJiggleStyle(durationMs = 2000) {
  const sx = useSharedValue(1);
  const sy = useSharedValue(1);

  useEffect(() => {
    const step = durationMs / 4;
    const easing = Easing.inOut(Easing.quad);

    sx.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: step, easing }),
        withTiming(0.9, { duration: step, easing }),
        withTiming(1.05, { duration: step, easing }),
        withTiming(1, { duration: step, easing }),
      ),
      -1,
      false,
    );
    sy.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: step, easing }),
        withTiming(1.1, { duration: step, easing }),
        withTiming(0.95, { duration: step, easing }),
        withTiming(1, { duration: step, easing }),
      ),
      -1,
      false,
    );
  }, [sx, sy, durationMs]);

  return useAnimatedStyle(() => ({
    transform: [{ scaleX: sx.value }, { scaleY: sy.value }],
  }));
}
