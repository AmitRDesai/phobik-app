import {
  accentFor,
  foregroundFor,
  withAlpha,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const THUMB_SIZE = 16;
const TRACK_HEIGHT = 4;

export interface SliderProps {
  value: number;
  /** Default: 0. */
  min?: number;
  /** Default: 100. */
  max?: number;
  /** Step granularity for the emitted value. Default: 1 (integer). */
  step?: number;
  onValueChange: (value: number) => void;
  /** Tone for the filled track + thumb border. Default: `pink`. */
  tone?: AccentHue;
  disabled?: boolean;
  /** Suppress drag-start haptic. Default: false. */
  noHaptic?: boolean;
  /** Outer container className (margins, max-width). */
  className?: string;
}

/**
 * Continuous numeric slider with drag + tap-to-seek. Use for ranged numeric
 * input — mood scale, breathing duration, volume, brightness, opacity.
 * Width auto-measures via onLayout so callers don't need to compute the
 * track length up front.
 *
 * For selecting from a discrete set of ≤ ~5 options, prefer
 * SegmentedControl — it shows all choices at once. Slider is best for
 * truly continuous ranges where the exact stop isn't important.
 */
export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  tone = 'pink',
  disabled,
  noHaptic,
  className,
}: SliderProps) {
  const scheme = useScheme();
  const accent = accentFor(scheme, tone);
  const maxTrack = foregroundFor(scheme, 0.1);

  const [trackWidth, setTrackWidth] = useState(0);
  const usableWidth = Math.max(0, trackWidth - THUMB_SIZE);

  const thumbX = useSharedValue(0);
  const thumbScale = useSharedValue(1);

  // Sync thumb position when external value / range changes.
  useEffect(() => {
    if (usableWidth <= 0) return;
    const ratio = (value - min) / Math.max(1e-6, max - min);
    thumbX.value = Math.max(0, Math.min(1, ratio)) * usableWidth;
  }, [value, min, max, usableWidth, thumbX]);

  useEffect(() => {
    return () => {
      cancelAnimation(thumbX);
      cancelAnimation(thumbScale);
    };
  }, [thumbX, thumbScale]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  }, []);

  const emit = useCallback(
    (x: number) => {
      if (usableWidth <= 0) return;
      const clamped = Math.max(0, Math.min(x, usableWidth));
      const raw = min + (clamped / usableWidth) * (max - min);
      // Snap to step
      const stepped = step > 0 ? Math.round(raw / step) * step : raw;
      const final = Math.max(min, Math.min(max, stepped));
      onValueChange(final);
    },
    [min, max, step, usableWidth, onValueChange],
  );

  const fireHaptic = useCallback(() => {
    if (noHaptic) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [noHaptic]);

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      thumbScale.value = withSpring(1.2, { damping: 15 });
      scheduleOnRN(fireHaptic);
    })
    .onUpdate((e) => {
      const newX = Math.max(0, Math.min(e.x - THUMB_SIZE / 2, usableWidth));
      thumbX.value = newX;
      scheduleOnRN(emit, newX);
    })
    .onEnd(() => {
      thumbScale.value = withSpring(1, { damping: 15 });
    });

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onStart((e) => {
      const newX = Math.max(0, Math.min(e.x - THUMB_SIZE / 2, usableWidth));
      thumbX.value = newX;
      scheduleOnRN(fireHaptic);
      scheduleOnRN(emit, newX);
    });

  const composed = Gesture.Race(pan, tap);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }, { scale: thumbScale.value }],
  }));

  const filledTrackStyle = useAnimatedStyle(() => ({
    width: thumbX.value + THUMB_SIZE / 2,
  }));

  return (
    <GestureDetector gesture={composed}>
      <View
        onLayout={onLayout}
        accessibilityRole="adjustable"
        accessibilityState={{ disabled: !!disabled }}
        accessibilityValue={{ min, max, now: value }}
        className={clsx(className)}
        style={{
          height: THUMB_SIZE + 16,
          justifyContent: 'center',
          opacity: disabled ? 0.4 : 1,
        }}
      >
        {/* Background track */}
        <View
          style={{
            position: 'absolute',
            left: THUMB_SIZE / 2,
            right: THUMB_SIZE / 2,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: maxTrack,
          }}
        />
        {/* Filled track */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: THUMB_SIZE / 2,
              height: TRACK_HEIGHT,
              borderRadius: TRACK_HEIGHT / 2,
              backgroundColor: accent,
            },
            filledTrackStyle,
          ]}
        />
        {/* Thumb */}
        <Animated.View
          style={[
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: '#ffffff',
              borderWidth: 2,
              borderColor: accent,
              boxShadow: `0px 0px 8px ${withAlpha(accent, 0.4)}`,
            },
            thumbStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}
