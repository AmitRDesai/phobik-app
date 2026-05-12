import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const INACTIVE_W = 8;
const ACTIVE_W = 24;
const HEIGHT = 6;

export interface ProgressDotsProps {
  total: number;
  /** 1-indexed active dot. */
  current: number;
  /**
   * Smoothly tween width + color when `current` changes. Default false
   * (snap-to-active). Use `true` when the surrounding stack is animating
   * — e.g. shared layout header above a routed Stack — so the active
   * dot slides instead of jumping.
   */
  animated?: boolean;
  /** Animation duration in ms. Default 300. */
  animationDuration?: number;
}

export function ProgressDots({
  total,
  current,
  animated,
  animationDuration = 300,
}: ProgressDotsProps) {
  if (animated) {
    return (
      <View className="flex-row items-center gap-2">
        {Array.from({ length: total }).map((_, index) => (
          <AnimatedDot
            key={index}
            active={index === current - 1}
            duration={animationDuration}
          />
        ))}
      </View>
    );
  }
  return (
    <View className="flex-row items-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current - 1;
        return (
          <View
            key={index}
            className={
              isActive
                ? 'h-1.5 w-6 rounded-full bg-primary-pink'
                : 'h-1.5 w-2 rounded-full bg-foreground/20'
            }
          />
        );
      })}
    </View>
  );
}

function AnimatedDot({
  active,
  duration,
}: {
  active: boolean;
  duration: number;
}) {
  const scheme = useScheme();
  const inactiveColor = foregroundFor(scheme, 0.2);
  const activeColor = colors.primary.pink;
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, duration, progress]);

  const style = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [INACTIVE_W, ACTIVE_W]),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor],
    ),
  }));

  return (
    <Animated.View
      style={[{ height: HEIGHT, borderRadius: HEIGHT / 2 }, style]}
    />
  );
}
