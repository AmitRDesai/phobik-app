import { alpha, colors, withAlpha } from '@/constants/colors';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Polygon,
  Stop,
} from 'react-native-svg';
import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

import {
  MYSTERY_CHALLENGES,
  type MysteryType,
} from '../data/mystery-challenges';

const WHEEL_SIZE = 340;
const CENTER_SIZE = 80;
const POINTER_SIZE = 24;
const SEGMENTS = 6;
const SEGMENT_ANGLE = 360 / SEGMENTS; // 60°

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Segment order matches the design (clockwise from 12 o'clock):
// Breathing (0-60°), Gratitude (60-120°), Affirmations (120-180°),
// Feelings (180-240°), Needs (240-300°), Wants (300-360°)
const SEGMENT_ORDER: MysteryType[] = [
  'breathing',
  'gratitude',
  'affirmations',
  'feelings',
  'needs',
  'wants',
];

// SVG paths for 6 equal segments (viewBox 0 0 100 100, center at 50,50, radius 50)
const SEGMENT_PATHS = [
  'M 50 50 L 50 0 A 50 50 0 0 1 93.3 25 L 50 50', // 0-60°
  'M 50 50 L 93.3 25 A 50 50 0 0 1 93.3 75 L 50 50', // 60-120°
  'M 50 50 L 93.3 75 A 50 50 0 0 1 50 100 L 50 50', // 120-180°
  'M 50 50 L 50 100 A 50 50 0 0 1 6.7 75 L 50 50', // 180-240°
  'M 50 50 L 6.7 75 A 50 50 0 0 1 6.7 25 L 50 50', // 240-300°
  'M 50 50 L 6.7 25 A 50 50 0 0 1 50 0 L 50 50', // 300-360°
];

// Label positions as absolute pixels (based on WHEEL_SIZE=340)
const LABEL_POSITIONS: { left: number; top: number }[] = [
  { left: 0.72 * WHEEL_SIZE, top: 0.23 * WHEEL_SIZE }, // Breathing - top right
  { left: 0.81 * WHEEL_SIZE, top: 0.5 * WHEEL_SIZE }, // Gratitude - middle right
  { left: 0.72 * WHEEL_SIZE, top: 0.77 * WHEEL_SIZE }, // Affirmations - bottom right
  { left: 0.28 * WHEEL_SIZE, top: 0.77 * WHEEL_SIZE }, // Feelings - bottom left
  { left: 0.19 * WHEEL_SIZE, top: 0.5 * WHEEL_SIZE }, // Needs - middle left
  { left: 0.28 * WHEEL_SIZE, top: 0.23 * WHEEL_SIZE }, // Wants - top left
];

// Top segments (Breathing, Wants) have dark text; others have white
const DARK_TEXT_SEGMENTS = new Set(['breathing', 'wants']);

interface MysteryWheelProps {
  onSpinComplete: (type: MysteryType) => void;
}

function triggerTick() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function MysteryWheel({ onSpinComplete }: MysteryWheelProps) {
  'use no memo'; // Opt out of React Compiler — Reanimated shared value mutations are incompatible
  const glowOpacity = useSharedValue(0.8);
  const glowScale = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const pointerScale = useSharedValue(1);
  const spinningOpacity = useSharedValue(1);
  const isSpinning = useRef(false);
  const lastSegmentCrossing = useSharedValue(0);
  const selectedTypeRef = useRef<MysteryType>('breathing');

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  // Haptic ticks when crossing segment boundaries
  useAnimatedReaction(
    () => rotation.value,
    (current) => {
      const currentSegment = Math.floor(current / SEGMENT_ANGLE);
      if (currentSegment !== lastSegmentCrossing.value) {
        lastSegmentCrossing.value = currentSegment;
        runOnJS(triggerTick)();
      }
    },
  );

  const lotusAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * spinningOpacity.value,
    transform: [{ scale: glowScale.value * pressScale.value }],
  }));

  const wheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pointerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pointerScale.value }],
  }));

  const handlePressIn = () => {
    if (isSpinning.current) return;
    pressScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (isSpinning.current) return;
    pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleSpinFinished = () => {
    isSpinning.current = false;
    spinningOpacity.value = withTiming(1, { duration: 300 });
    // Bounce the pointer
    pointerScale.value = withSequence(
      withSpring(1.4, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 8, stiffness: 200 }),
    );
    // Navigate after a short delay
    setTimeout(() => {
      onSpinComplete(selectedTypeRef.current);
    }, 600);
  };

  const spinWheel = () => {
    if (isSpinning.current) return;
    isSpinning.current = true;
    spinningOpacity.value = withTiming(0.5, { duration: 300 });

    // Pick a random segment
    const selectedIndex = Math.floor(Math.random() * SEGMENTS);
    selectedTypeRef.current = SEGMENT_ORDER[selectedIndex];

    // Calculate target rotation:
    // - Add 4-7 full spins for visual effect
    // - Land on the selected segment center (segmentIndex * 60 + 30)
    // - Rotation is clockwise, so we need to account for the fact that
    //   the pointer is at top (0°) and segments go clockwise
    const fullSpins = 4 + Math.floor(Math.random() * 4);
    const targetSegmentAngle =
      selectedIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const targetRotation =
      rotation.value + fullSpins * 360 + (360 - targetSegmentAngle);

    // Round to avoid float drift
    const finalTarget =
      Math.round(targetRotation / SEGMENT_ANGLE) * SEGMENT_ANGLE +
      SEGMENT_ANGLE / 2;

    rotation.value = withTiming(
      finalTarget,
      {
        duration: 4500,
        easing: Easing.bezier(0.12, 0.8, 0.08, 1.0),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleSpinFinished)();
        }
      },
    );
  };

  const challengeMap = Object.fromEntries(
    MYSTERY_CHALLENGES.map((c) => [c.type, c]),
  );

  return (
    <View
      className="items-center justify-center"
      style={{ width: WHEEL_SIZE, height: WHEEL_SIZE + POINTER_SIZE }}
    >
      {/* Pointer indicator at top center */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            zIndex: 10,
            alignSelf: 'center',
          },
          pointerAnimatedStyle,
        ]}
      >
        <Svg width={POINTER_SIZE} height={POINTER_SIZE} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="pointer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={colors.primary.pink} />
              <Stop offset="100%" stopColor={colors.accent.yellow} />
            </LinearGradient>
          </Defs>
          <Polygon points="12,22 2,4 22,4" fill="url(#pointer-grad)" />
        </Svg>
      </Animated.View>

      {/* Rotating wheel wrapper */}
      <Animated.View
        style={[
          {
            width: WHEEL_SIZE,
            height: WHEEL_SIZE,
            marginTop: POINTER_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          },
          wheelAnimatedStyle,
        ]}
      >
        {/* SVG Wheel */}
        <Svg
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox="0 0 100 100"
          style={{
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 8,
                blurRadius: 16,
                color: 'rgba(0, 0, 0, 0.4)',
              },
            ],
          }}
        >
          <Defs>
            {SEGMENT_ORDER.map((type) => {
              const challenge = challengeMap[type];
              return (
                <LinearGradient
                  key={type}
                  id={`grad-${type}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop
                    offset="0%"
                    stopColor={challenge.wheelGradient[0]}
                    stopOpacity={1}
                  />
                  <Stop
                    offset="100%"
                    stopColor={challenge.wheelGradient[1]}
                    stopOpacity={1}
                  />
                </LinearGradient>
              );
            })}
          </Defs>
          {SEGMENT_ORDER.map((type, i) => (
            <Path key={type} d={SEGMENT_PATHS[i]} fill={`url(#grad-${type})`} />
          ))}
        </Svg>

        {/* Labels overlay */}
        <View className="absolute inset-0" pointerEvents="none">
          {SEGMENT_ORDER.map((type, i) => {
            const challenge = challengeMap[type];
            const pos = LABEL_POSITIONS[i];
            const isDark = DARK_TEXT_SEGMENTS.has(type);

            return (
              <View
                key={type}
                className="absolute items-center justify-center"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: 90,
                  transform: [{ translateX: -45 }, { translateY: -20 }],
                }}
              >
                <Text
                  className="text-center text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: isDark ? alpha.black80 : 'white' }}
                >
                  {challenge.wheelLabel}
                </Text>
                <Text
                  className="mt-0.5 px-1 text-center text-[7px] leading-tight"
                  style={{
                    color: isDark ? alpha.black70 : alpha.white90,
                  }}
                >
                  {challenge.wheelSubtext}
                </Text>
              </View>
            );
          })}
        </View>
      </Animated.View>

      {/* Center lotus button (fixed, not rotating) */}
      <AnimatedPressable
        onPress={spinWheel}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="absolute items-center justify-center rounded-full"
        style={[
          {
            width: CENTER_SIZE,
            height: CENTER_SIZE,
            top: POINTER_SIZE + (WHEEL_SIZE - CENTER_SIZE) / 2,
            backgroundColor: colors.background.dark,
            borderWidth: 4,
            borderColor: 'black',
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 15,
                color: withAlpha(colors.primary.pink, 0.4),
              },
            ],
          },
          lotusAnimatedStyle,
        ]}
      >
        {/* Sparkle/Mystery icon */}
        <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
          {/* Main 4-point sparkle */}
          <Path
            d="M12 2L13.5 9.5L21 12L13.5 14.5L12 22L10.5 14.5L3 12L10.5 9.5L12 2Z"
            fill="white"
            stroke="white"
            strokeWidth={0.5}
            strokeLinejoin="round"
          />
          {/* Small sparkle top-right */}
          <Path
            d="M19 2L19.5 4.5L22 5L19.5 5.5L19 8L18.5 5.5L16 5L18.5 4.5L19 2Z"
            fill="white"
            opacity={0.6}
          />
          {/* Small sparkle bottom-left */}
          <Path
            d="M5 16L5.5 18L7.5 18.5L5.5 19L5 21L4.5 19L2.5 18.5L4.5 18L5 16Z"
            fill="white"
            opacity={0.6}
          />
        </Svg>
      </AnimatedPressable>
    </View>
  );
}
