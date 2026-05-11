import { useEffect } from 'react';
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type EasingFunction,
  type SharedValue,
} from 'react-native-reanimated';

type PulseOptions = {
  /** Whether the pulse loop is running. When false, value eases to `restValue`. */
  active: boolean;
  from: number;
  to: number;
  /** Duration of one half of the pulse cycle in ms. */
  duration: number;
  /** Value to ease toward when `active` flips false. Defaults to `from`. */
  restValue?: number;
  /** Duration of the resting transition when `active` flips to false. */
  restDuration?: number;
  easing?: EasingFunction;
};

/**
 * Repeats `withTiming(from -> to)` while `active` is true, eases to
 * `restValue` (default: `from`) when it flips false. Encapsulates the
 * shared-value mutation in the same hook that creates the value.
 */
export function usePulseAnimation({
  active,
  from,
  to,
  duration,
  restValue,
  restDuration = 500,
  easing = Easing.inOut(Easing.ease),
}: PulseOptions): SharedValue<number> {
  const value = useSharedValue(from);
  const rest = restValue ?? from;
  useEffect(() => {
    if (active) {
      value.value = withRepeat(
        withSequence(
          withTiming(to, { duration, easing }),
          withTiming(from, { duration, easing }),
        ),
        -1,
        false,
      );
    } else {
      value.value = withTiming(rest, { duration: restDuration });
    }
  }, [active, value]);
  return value;
}
