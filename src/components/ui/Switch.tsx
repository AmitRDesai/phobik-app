import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  /** Required when the switch isn't accompanied by a visible text label. */
  accessibilityLabel?: string;
  /** Suppress press haptic. Default: false. */
  noHaptic?: boolean;
}

// Hand-rolled dimensions (no RN Switch wrapper) so iOS and Android render
// an identical pill switch — same track size, thumb size, animation curve,
// and colors. Numbers match iOS's native switch so the result feels familiar.
const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const THUMB_SIZE = 27;
const TRACK_PADDING = 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;
const ANIMATION_DURATION_MS = 220;

/**
 * Themed binary toggle. Custom-built (no RN `Switch` wrapper) so iOS and
 * Android render identically — brand pink track-on, theme-aware
 * foreground/10 track-off, white thumb with a subtle drop shadow,
 * reanimated transition, built-in light haptic.
 *
 * Use for settings toggles, "anonymous post" flags, biometric enable —
 * any independent on/off choice. For mutually-exclusive options use
 * SegmentedControl; for selecting from a set use SelectionCard.
 */
export function Switch({
  value,
  onValueChange,
  disabled,
  accessibilityLabel,
  noHaptic,
}: SwitchProps) {
  const scheme = useScheme();
  const progress = useSharedValue(value ? 1 : 0);
  const trackOffColor = foregroundFor(scheme, 0.1);
  const trackOnColor = colors.primary.pink;

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [trackOffColor, trackOnColor],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  const handlePress = () => {
    if (disabled) return;
    if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled: !!disabled }}
      hitSlop={8}
      style={disabled ? { opacity: 0.4 } : undefined}
    >
      <Animated.View
        style={[
          {
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            padding: TRACK_PADDING,
            justifyContent: 'center',
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: 'white',
              // Subtle drop shadow so the thumb has depth — matches iOS native.
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
