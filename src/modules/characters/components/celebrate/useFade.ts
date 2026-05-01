import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export function useFadeIn(durationMs: number) {
  const op = useSharedValue(0);
  useEffect(() => {
    op.value = withTiming(1, { duration: durationMs });
  }, [durationMs, op]);
  return useAnimatedStyle(() => ({ opacity: op.value }));
}

export function useFadeOut(active: boolean, durationMs: number) {
  const op = useSharedValue(1);
  useEffect(() => {
    if (active) op.value = withTiming(0, { duration: durationMs });
  }, [active, durationMs, op]);
  return useAnimatedStyle(() => ({ opacity: op.value }));
}
