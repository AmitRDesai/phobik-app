import { alpha, colors } from '@/constants/colors';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useEffect } from 'react';

import { MYSTERY_CHALLENGES } from '../data/mystery-challenges';

const WHEEL_SIZE = 340;
const CENTER_SIZE = 80;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Segment order matches the design (clockwise from 12 o'clock):
// Breathing (0-60°), Gratitude (60-120°), Affirmations (120-180°),
// Feelings (180-240°), Needs (240-300°), Wants (300-360°)
const SEGMENT_ORDER = [
  'breathing',
  'gratitude',
  'affirmations',
  'feelings',
  'needs',
  'wants',
] as const;

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
  onLotusPress: () => void;
}

export function MysteryWheel({ onLotusPress }: MysteryWheelProps) {
  const glowOpacity = useSharedValue(0.8);
  const glowScale = useSharedValue(1);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [glowOpacity, glowScale]);

  const lotusAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value * pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const challengeMap = Object.fromEntries(
    MYSTERY_CHALLENGES.map((c) => [c.type, c]),
  );

  return (
    <View
      className="items-center justify-center"
      style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
    >
      {/* SVG Wheel */}
      <Svg
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        viewBox="0 0 100 100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
        }}
      >
        <Defs>
          {SEGMENT_ORDER.map((type, i) => {
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

      {/* Center lotus button */}
      <AnimatedPressable
        onPress={onLotusPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="absolute items-center justify-center rounded-full"
        style={[
          {
            width: CENTER_SIZE,
            height: CENTER_SIZE,
            backgroundColor: colors.background.dark,
            borderWidth: 4,
            borderColor: 'black',
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 15,
          },
          lotusAnimatedStyle,
        ]}
      >
        {/* Lotus SVG */}
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 22C12 22 16 18 16 14C16 11.5 14.5 10 12 10C9.5 10 8 11.5 8 14C8 18 12 22 12 22Z"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 10C12 10 15 7 15 4C15 2 13.5 1 12 1C10.5 1 9 2 9 4C9 7 12 10 12 10Z"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M8 14C8 14 4 13 2 10C1 8.5 1 6.5 2 5C3 4 5 4 7 6C9 8 8 14 8 14Z"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 14C16 14 20 13 22 10C23 8.5 23 6.5 22 5C21 4 19 4 17 6C15 8 16 14 16 14Z"
            stroke="white"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </AnimatedPressable>
    </View>
  );
}
