import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BREATHING_PHASES = ['Inhale', 'Hold', 'Exhale', 'Rest'] as const;
const PHASE_DURATION = 4; // seconds per phase
const CYCLE_DURATION = PHASE_DURATION * 4; // 16 seconds per cycle
const PHASE_MS = PHASE_DURATION * 1000;

interface BreathingBoxProps {
  /** Elapsed seconds since session start */
  elapsed: number;
  /** Whether the session is paused */
  isPaused: boolean;
  /** Whether the exercise is active (instruction finished) */
  isActive?: boolean;
  /** Countdown seconds before session starts (3, 2, 1) */
  countdown?: number;
}

export function BreathingBox({
  elapsed,
  isPaused,
  isActive = true,
  countdown,
}: BreathingBoxProps) {
  const cyclePosition = elapsed % CYCLE_DURATION;
  const phaseIndex = Math.floor(cyclePosition / PHASE_DURATION);
  const phaseTimeLeft =
    PHASE_DURATION - (cyclePosition - phaseIndex * PHASE_DURATION);
  const displaySeconds = Math.ceil(phaseTimeLeft);
  const currentPhase = BREATHING_PHASES[phaseIndex];

  // Fill animation — scales from 0 (empty) to 1 (full) from center
  const fillProgress = useSharedValue(0);

  useEffect(() => {
    if (!isActive || isPaused) {
      cancelAnimation(fillProgress);
      return;
    }

    // Compute position within current phase for resume accuracy
    const cp = elapsed % CYCLE_DURATION;
    const timeInPhase = cp - phaseIndex * PHASE_DURATION;
    const remainingMs = (PHASE_DURATION - timeInPhase) * 1000;

    cancelAnimation(fillProgress);

    const startProgress = timeInPhase / PHASE_DURATION;

    switch (phaseIndex) {
      case 0: // Inhale — fill up
        fillProgress.value = withSequence(
          withTiming(startProgress, { duration: 0 }),
          withTiming(1, {
            duration: remainingMs,
            easing: Easing.inOut(Easing.ease),
          }),
        );
        break;
      case 1: // Hold full
        fillProgress.value = 1;
        break;
      case 2: // Exhale — empty out
        fillProgress.value = withSequence(
          withTiming(1 - startProgress, { duration: 0 }),
          withTiming(0, {
            duration: remainingMs,
            easing: Easing.inOut(Easing.ease),
          }),
        );
        break;
      case 3: // Hold empty
        fillProgress.value = 0;
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, isPaused, isActive]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fillProgress.value }],
    opacity: fillProgress.value * 0.85 + 0.05,
  }));

  // Animated shadow on the box — glows stronger as fill increases
  // Precompute RGB for use inside worklet
  const pinkHex = colors.primary.pink.replace('#', '');
  const pinkR = parseInt(pinkHex.substring(0, 2), 16);
  const pinkG = parseInt(pinkHex.substring(2, 4), 16);
  const pinkB = parseInt(pinkHex.substring(4, 6), 16);
  const boxShadowStyle = useAnimatedStyle(() => ({
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: 10 + fillProgress.value * 25,
        color: `rgba(${pinkR},${pinkG},${pinkB},${fillProgress.value * 0.5})`,
      },
    ],
  }));

  // Glow pulse animation
  const glowOpacity = useSharedValue(0.15);

  useEffect(() => {
    if (isPaused) return;
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, {
          duration: PHASE_MS / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.15, {
          duration: PHASE_MS / 2,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );
    return () => {
      glowOpacity.value = 0.15;
    };
  }, [isPaused]);

  // Text pulse animation
  const textScale = useSharedValue(0.96);

  useEffect(() => {
    if (isPaused) return;
    textScale.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: PHASE_MS / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.96, {
          duration: PHASE_MS / 2,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );
    return () => {
      textScale.value = 0.96;
    };
  }, [isPaused]);

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

        {/* The square border with animated shadow */}
        <Animated.View
          className="absolute overflow-hidden"
          style={[
            {
              width: 240,
              height: 240,
              borderRadius: 32,
              borderWidth: 4,
              borderColor: colors.primary.pink,
              backgroundColor: 'transparent',
            },
            boxShadowStyle,
          ]}
        >
          {/* Fill gradient — scales from center */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 28,
              },
              fillStyle,
            ]}
          >
            <LinearGradient
              colors={[
                withAlpha(colors.pink[400], 0.35),
                withAlpha('#b45378', 0.25),
                withAlpha(colors.yellow[400], 0.15),
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 28,
              }}
            />
          </Animated.View>
        </Animated.View>

        {/* Content inside the square */}
        <View className="z-10 items-center gap-2" style={{ width: 200 }}>
          <Animated.View style={textAnimStyle}>
            <Text
              className="text-center text-3xl font-bold text-white"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {isActive
                ? `${currentPhase} ${displaySeconds}s`
                : countdown !== undefined && countdown > 0
                  ? `Starting in ${countdown}s`
                  : 'Listen'}
            </Text>
          </Animated.View>

          {/* Phase dots */}
          {isActive && (
            <View className="flex-row gap-1.5">
              {BREATHING_PHASES.map((phase, i) => (
                <View
                  key={phase}
                  className={`h-2 w-2 rounded-full ${
                    i === phaseIndex ? 'bg-primary-pink' : 'bg-white/20'
                  }`}
                  style={
                    i === phaseIndex
                      ? {
                          boxShadow: [
                            {
                              offsetX: 0,
                              offsetY: 0,
                              blurRadius: 4,
                              color: colors.primary.pink,
                            },
                          ],
                        }
                      : undefined
                  }
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
