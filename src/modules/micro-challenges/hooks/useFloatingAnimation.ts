import { useEffect } from 'react';
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface FloatingOptions {
  amplitude?: number;
  duration?: number;
  delay?: number;
}

export function useFloatingAnimation({
  amplitude = 15,
  duration = 6000,
  delay = 0,
}: FloatingOptions = {}) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    const halfDur = duration / 2;
    translateY.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration: halfDur }),
        withTiming(0, { duration: halfDur }),
      ),
      -1,
      true,
    );

    return () => {
      cancelAnimation(translateY);
    };
  }, [amplitude, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}
