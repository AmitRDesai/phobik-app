import { colors } from '@/constants/colors';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BREATHING_PHASES = ['Inhale', 'Hold', 'Exhale', 'Hold'] as const;
const PHASE_DURATION = 4; // seconds per phase
const CYCLE_DURATION = PHASE_DURATION * 4; // 16 seconds per cycle

interface BreathingBoxProps {
  /** Elapsed seconds since session start */
  elapsed: number;
  /** Whether the session is paused */
  isPaused: boolean;
}

export function BreathingBox({ elapsed, isPaused }: BreathingBoxProps) {
  // Calculate current phase from elapsed time
  const cyclePosition = elapsed % CYCLE_DURATION;
  const phaseIndex = Math.floor(cyclePosition / PHASE_DURATION);
  const phaseTimeLeft =
    PHASE_DURATION - (cyclePosition - phaseIndex * PHASE_DURATION);
  const displaySeconds = Math.ceil(phaseTimeLeft);
  const currentPhase = BREATHING_PHASES[phaseIndex];

  // Glow pulse animation
  const glowOpacity = useSharedValue(0.15);

  useEffect(() => {
    if (isPaused) return;
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );
    return () => {
      glowOpacity.value = 0.15;
    };
  }, [isPaused, glowOpacity]);

  // Text pulse animation
  const textScale = useSharedValue(0.96);

  useEffect(() => {
    if (isPaused) return;
    textScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.96, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );
    return () => {
      textScale.value = 0.96;
    };
  }, [isPaused, textScale]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const textAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
  }));

  return (
    <View className="items-center justify-center">
      {/* Outer decorative circles */}
      <View
        className="absolute rounded-full border border-primary-pink/5"
        style={{ width: 320, height: 320 }}
      />
      <View
        className="absolute rounded-full border border-accent-yellow/5"
        style={{ width: 380, height: 380 }}
      />

      {/* Breathing square container */}
      <View
        className="items-center justify-center"
        style={{ width: 240, height: 240 }}
      >
        {/* Glow pulse behind the square */}
        <Animated.View
          className="absolute"
          style={[
            {
              width: 264,
              height: 264,
              borderRadius: 40,
            },
            glowStyle,
          ]}
        >
          <View
            className="h-full w-full"
            style={{
              borderRadius: 40,
              backgroundColor: colors.primary.pink,
              opacity: 0.4,
            }}
          />
        </Animated.View>

        {/* The square border */}
        <View
          className="absolute items-center justify-center"
          style={{
            width: 240,
            height: 240,
            borderRadius: 32,
            borderWidth: 4,
            borderColor: colors.primary.pink,
            backgroundColor: 'rgba(236, 72, 153, 0.03)',
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 30,
          }}
        />

        {/* Content inside the square — fixed width to prevent shift */}
        <View className="z-10 items-center gap-2" style={{ width: 200 }}>
          <Animated.View style={textAnimStyle}>
            <Text
              className="text-center text-3xl font-bold text-white"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {currentPhase} {displaySeconds}s
            </Text>
          </Animated.View>

          {/* Phase dots */}
          <View className="flex-row gap-1.5">
            {BREATHING_PHASES.map((_, i) => (
              <View
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === phaseIndex ? 'bg-primary-pink' : 'bg-white/20'
                }`}
                style={
                  i === phaseIndex
                    ? {
                        shadowColor: colors.primary.pink,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 1,
                        shadowRadius: 4,
                      }
                    : undefined
                }
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
