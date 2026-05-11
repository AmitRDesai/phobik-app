import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
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

interface SliderProps {
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
  trackWidth: number;
  thumbColor?: string;
  thumbBorderColor?: string;
  minimumTrackColor?: string;
  maximumTrackColor?: string;
}

export function Slider({
  value,
  min,
  max,
  onValueChange,
  trackWidth,
  thumbColor,
  thumbBorderColor = colors.primary.pink,
  minimumTrackColor,
  maximumTrackColor,
}: SliderProps) {
  const scheme = useScheme();
  const resolvedThumbColor =
    thumbColor ?? (scheme === 'dark' ? 'white' : '#ffffff');
  const resolvedMaxTrack = maximumTrackColor ?? foregroundFor(scheme, 0.1);
  const usableWidth = trackWidth - THUMB_SIZE;
  const initialX = ((value - min) / (max - min)) * usableWidth;
  const thumbX = useSharedValue(initialX);
  const thumbScale = useSharedValue(1);

  useEffect(() => {
    const newX = ((value - min) / (max - min)) * usableWidth;
    thumbX.value = newX;
  }, [value, min, max, usableWidth]);

  // Cancel running animations on unmount
  useEffect(() => {
    return () => {
      cancelAnimation(thumbX);
      cancelAnimation(thumbScale);
    };
  }, []);

  const updateValue = useCallback(
    (x: number) => {
      const clamped = Math.max(0, Math.min(x, usableWidth));
      const newValue = Math.round(min + (clamped / usableWidth) * (max - min));
      onValueChange(newValue);
    },
    [min, max, usableWidth, onValueChange],
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      thumbScale.value = withSpring(1.2, { damping: 15 });
    })
    .onUpdate((e) => {
      // Use local x position for direct 1:1 finger tracking
      const newX = Math.max(0, Math.min(e.x - THUMB_SIZE / 2, usableWidth));
      thumbX.value = newX;
      scheduleOnRN(updateValue, newX);
    })
    .onEnd(() => {
      thumbScale.value = withSpring(1, { damping: 15 });
    });

  const tap = Gesture.Tap().onStart((e) => {
    const newX = Math.max(0, Math.min(e.x - THUMB_SIZE / 2, usableWidth));
    thumbX.value = newX;
    scheduleOnRN(updateValue, newX);
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
        style={{
          width: trackWidth,
          height: THUMB_SIZE + 16,
          justifyContent: 'center',
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
            backgroundColor: resolvedMaxTrack,
          }}
        />
        {/* Filled track */}
        {minimumTrackColor && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: THUMB_SIZE / 2,
                height: TRACK_HEIGHT,
                borderRadius: TRACK_HEIGHT / 2,
                backgroundColor: minimumTrackColor,
              },
              filledTrackStyle,
            ]}
          />
        )}
        {/* Thumb */}
        <Animated.View
          style={[
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: resolvedThumbColor,
              borderWidth: 2,
              borderColor: thumbBorderColor,
              boxShadow: `0px 0px 8px ${withAlpha(thumbBorderColor, 0.4)}`,
            },
            thumbStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}
