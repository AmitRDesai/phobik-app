import { useEffect } from 'react';
import {
  useSharedValue,
  withTiming,
  type SharedValue,
  type WithTimingConfig,
} from 'react-native-reanimated';

/**
 * Animates a `SharedValue` toward `target` via `withTiming` whenever `target`
 * changes. Encapsulates the mutation in the same hook that creates the
 * shared value so React Compiler can optimize call sites.
 *
 * `config` is captured by reference; stabilize it (e.g., `useMemo`) only if
 * you need to change easing/duration at runtime.
 */
export function useAnimatedTiming(
  target: number,
  config?: WithTimingConfig,
): SharedValue<number> {
  const value = useSharedValue(target);
  useEffect(() => {
    value.value = withTiming(target, config);
  }, [target, value]);
  return value;
}
