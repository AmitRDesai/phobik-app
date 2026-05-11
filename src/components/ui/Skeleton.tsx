import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { useEffect, useRef } from 'react';
import { Animated, View, type DimensionValue } from 'react-native';

export type SkeletonShape = 'rect' | 'circle' | 'pill';

export interface SkeletonProps {
  /** Width — px number or percent string (e.g. `"60%"`). Default: `"100%"`. */
  width?: DimensionValue;
  /** Height in px. Default: 16 (single text line). */
  height?: number;
  /**
   * Shape.
   *   rect   — rounded rectangle (default). Use `radius` to tune.
   *   circle — fully round; pair with equal width + height.
   *   pill   — fully rounded ends (radius = height / 2).
   */
  shape?: SkeletonShape;
  /** Corner radius (only when `shape="rect"`). Default: 6. */
  radius?: number;
  /** Disable the shimmer animation — renders a static placeholder. */
  static?: boolean;
  className?: string;
}

/**
 * Loading-state placeholder shape. Renders a foreground/8 rectangle that
 * pulses between 40% → 80% opacity (~1.6s cycle) to signal "content is
 * loading here." Compose multiple Skeletons to mimic the layout of the
 * real content (avatar + text lines + image, etc.) so the swap-in feels
 * stable.
 *
 * Prefer Skeleton over a centered spinner for list / card content: it
 * preserves layout and avoids the empty-screen flash before data lands.
 * For full-screen / indefinite loads where the layout isn't predictable
 * (auth check, initial sync), a spinner is still the right call.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  shape = 'rect',
  radius = 6,
  static: isStatic,
  className,
}: SkeletonProps) {
  const scheme = useScheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (isStatic) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, isStatic]);

  const borderRadius =
    shape === 'circle' ? height / 2 : shape === 'pill' ? height / 2 : radius;

  const baseStyle = {
    width,
    height,
    borderRadius,
    backgroundColor: foregroundFor(scheme, 0.1),
  };

  if (isStatic) {
    return (
      <View className={clsx(className)} style={[baseStyle, { opacity: 0.5 }]} />
    );
  }

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      className={clsx(className)}
      style={[baseStyle, { opacity }]}
    />
  );
}
