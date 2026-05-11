import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { useScheme } from '@/hooks/useTheme';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import {
  DOSE_REWARDS,
  getActiveDoseRewards,
  type PracticeType,
} from '@/constants/dose-rewards';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { CompletionBadge } from '../components/CompletionBadge';
import { useRecordPracticeCompletion } from '../hooks/usePracticeCompletion';
import { groundingSessionAtom } from '../store/grounding';

const CONFETTI_COLORS = [colors.primary.pink, colors.accent.yellow, 'white'];
const CONFETTI_COUNT = 24;

const REWARD_STYLES: Record<
  string,
  { gradient: [string, string]; glow: string; shadow: string; label: string }
> = {
  dopamine: {
    gradient: [colors.accent.yellow, colors.accent.gold],
    glow: withAlpha(colors.accent.yellow, 0.2),
    shadow: colors.accent.yellow,
    label: colors.accent.yellow,
  },
  oxytocin: {
    gradient: [colors.accent.purple, colors.primary.pink],
    glow: withAlpha(colors.accent.purple, 0.2),
    shadow: colors.accent.purple,
    label: colors.accent.purple,
  },
  serotonin: {
    gradient: [colors.blue[500], colors.cyan[400]],
    glow: withAlpha(colors.blue[400], 0.2),
    shadow: colors.blue[500],
    label: colors.blue[400],
  },
  endorphins: {
    gradient: [colors.primary.pink, colors.gradient['soft-pink']],
    glow: withAlpha(colors.gradient['hot-pink'], 0.2),
    shadow: colors.primary.pink,
    label: colors.primary.pink,
  },
};

function ConfettiPiece({
  color,
  startX,
  startY,
  delay,
  rotation,
  size,
}: {
  color: string;
  startX: number;
  startY: number;
  delay: number;
  rotation: number;
  size: number;
}) {
  const translateY = useSharedValue(-startY - 40);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(rotation);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(startY + 200, { duration: 2800 }),
    );
    rotate.value = withDelay(
      delay,
      withTiming(rotation + 360 * (Math.random() > 0.5 ? 1 : -1), {
        duration: 2800,
      }),
    );
    opacity.value = withDelay(delay + 1800, withTiming(0, { duration: 1000 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: startX,
          top: 0,
          width: size,
          height: size,
          borderRadius: 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

function Confetti() {
  const { width, height } = useWindowDimensions();

  const [randoms] = useState(() =>
    Array.from({ length: CONFETTI_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      delay: Math.random(),
      rotation: Math.random(),
      size: Math.random(),
    })),
  );

  const pieces = useMemo(
    () =>
      randoms.map((r, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        startX: r.x * width,
        startY: r.y * height * 0.6,
        delay: r.delay * 600,
        rotation: r.rotation * 360,
        size: 6 + r.size * 6,
      })),
    [width, height, randoms],
  );

  return (
    <View className="pointer-events-none absolute inset-0">
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
    </View>
  );
}

function PulsingGlow({ color }: { color: string }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className="absolute inset-0 scale-125 rounded-full"
      style={[{ backgroundColor: color }, animatedStyle]}
    />
  );
}

function RewardCircle({
  gradientColors,
  glowColor,
  shadowColor,
  amount,
  label,
  labelColor,
}: {
  gradientColors: [string, string];
  glowColor: string;
  shadowColor: string;
  amount: string;
  label: string;
  labelColor: string;
}) {
  return (
    <View className="items-center gap-3">
      <View className="relative h-16 w-16 items-center justify-center">
        <PulsingGlow color={glowColor} />
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 20,
                color: withAlpha(shadowColor, 0.5),
              },
            ],
          }}
        >
          <MaterialIcons name="toll" size={30} color="white" />
        </LinearGradient>
      </View>
      <View className="items-center">
        <Text size="lg" weight="black">
          {amount}
        </Text>
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          style={{ color: labelColor }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

export default function Completion() {
  const scheme = useScheme();
  const router = useRouter();
  const { practiceType, durationSeconds } = useLocalSearchParams<{
    practiceType?: string;
    durationSeconds?: string;
  }>();
  const setGroundingSession = useSetAtom(groundingSessionAtom);
  const recordCompletion = useRecordPracticeCompletion();
  const hasRecorded = useRef(false);

  const activeRewards = useMemo(
    () =>
      practiceType && practiceType in DOSE_REWARDS
        ? getActiveDoseRewards(practiceType as PracticeType)
        : [
            { chemical: 'endorphins' as const, value: 10, label: 'Endorphins' },
            { chemical: 'serotonin' as const, value: 5, label: 'Serotonin' },
          ],
    [practiceType],
  );

  useEffect(() => {
    setGroundingSession(null);

    if (practiceType && practiceType in DOSE_REWARDS && !hasRecorded.current) {
      hasRecorded.current = true;
      recordCompletion.mutate({
        practiceType: practiceType as PracticeType,
        durationSeconds: Number(durationSeconds) || 0,
      });
    }
  }, [setGroundingSession, practiceType, durationSeconds, recordCompletion]);

  const handleFinish = () => {
    router.dismissAll();
  };

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          right={
            <BackButton onPress={() => router.dismissAll()} icon="close" />
          }
        />
      }
      sticky={
        <View className="gap-4 px-2">
          <GradientButton onPress={handleFinish}>
            Collect Rewards & Finish
          </GradientButton>
          <Button
            variant="ghost"
            onPress={() => {}}
            prefixIcon={
              <MaterialIcons
                name="ios-share"
                size={20}
                color={foregroundFor(scheme, 0.7)}
              />
            }
          >
            Share Victory
          </Button>
        </View>
      }
      className="px-6"
      contentClassName="items-center"
    >
      <Confetti />

      {/* Mandala badge */}
      <View className="mb-8">
        <CompletionBadge />
      </View>

      {/* Title */}
      <View className="mb-8 items-center gap-3">
        <Text
          size="h1"
          align="center"
          weight="black"
          className="uppercase leading-tight"
        >
          {'PRACTICE\nCOMPLETED!'}
        </Text>
        <Text
          size="sm"
          tone="secondary"
          align="center"
          weight="medium"
          className="max-w-[280px]"
        >
          You&apos;ve successfully completed a mindfulness session.
        </Text>
      </View>

      {/* Daily D.O.S.E. Rewards */}
      <View className="mb-12 w-full items-center gap-6">
        <Text
          size="xs"
          treatment="caption"
          tone="secondary"
          weight="bold"
          className="tracking-[0.2em]"
        >
          Daily D.O.S.E. Rewards
        </Text>
        <View className="flex-row justify-center gap-6">
          {activeRewards.map((reward) => (
            <RewardCircle
              key={reward.chemical}
              gradientColors={REWARD_STYLES[reward.chemical].gradient}
              glowColor={REWARD_STYLES[reward.chemical].glow}
              shadowColor={REWARD_STYLES[reward.chemical].shadow}
              amount={`+${reward.value}`}
              label={reward.label}
              labelColor={REWARD_STYLES[reward.chemical].label}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}
