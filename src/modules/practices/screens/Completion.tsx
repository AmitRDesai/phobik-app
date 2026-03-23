import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BackButton } from '@/components/ui/BackButton';
import { CompletionBadge } from '../components/CompletionBadge';
import { groundingSessionAtom } from '../store/grounding';

const CONFETTI_COLORS = [colors.primary.pink, colors.accent.yellow, 'white'];
const CONFETTI_COUNT = 24;

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

  const pieces = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        startX: Math.random() * width,
        startY: Math.random() * height * 0.6,
        delay: Math.random() * 600,
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 6,
      })),
    [width, height],
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
  }, [opacity]);

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
            shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <MaterialIcons name="toll" size={30} color="white" />
        </LinearGradient>
      </View>
      <View className="items-center">
        <Text className="text-xl font-black text-white">{amount}</Text>
        <Text
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: labelColor }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

export default function Completion() {
  const router = useRouter();
  const setGroundingSession = useSetAtom(groundingSessionAtom);

  // Play success trumpets on mount
  const trumpetPlayer = useAudioPlayer(
    require('@/assets/audio/success-trumpets.mp3'),
  );

  useEffect(() => {
    trumpetPlayer.play();
    // Clear saved session state on completion
    setGroundingSession(null);
  }, [trumpetPlayer, setGroundingSession]);

  const handleFinish = () => {
    router.dismissAll();
  };

  return (
    <Container safeAreaClass="bg-black">
      <View className="flex-1 bg-black">
        <GlowBg
          bgClassName="bg-black"
          centerY={0.3}
          intensity={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        <Confetti />

        {/* Close button — absolute positioned */}
        <BackButton
          className="absolute right-6 top-6 z-20"
          onPress={() => router.dismissAll()}
          icon="close"
        />

        <ScrollView
          contentContainerClassName="flex-grow items-center px-6 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Mandala badge */}
          <View className="mb-8">
            <CompletionBadge />
          </View>

          {/* Title */}
          <View className="mb-8 items-center gap-3">
            <Text className="text-center text-3xl font-black uppercase leading-tight tracking-tighter text-white">
              {'PRACTICE\nCOMPLETED!'}
            </Text>
            <Text className="max-w-[280px] text-center text-sm font-medium text-white/60">
              You&apos;ve successfully completed a mindfulness session.
            </Text>
          </View>

          {/* Daily D.O.S.E. Rewards */}
          <View className="mb-12 w-full items-center gap-6">
            <Text className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
              Daily D.O.S.E. Rewards
            </Text>
            <View className="flex-row justify-center gap-6">
              <RewardCircle
                gradientColors={[colors.primary.pink, '#ff4b8b']}
                glowColor="rgba(244,37,106,0.2)"
                shadowColor={colors.primary.pink}
                amount="+10"
                label="Endorphins"
                labelColor={colors.primary.pink}
              />
              <RewardCircle
                gradientColors={[colors.blue[500], colors.cyan[400]]}
                glowColor="rgba(59,130,246,0.2)"
                shadowColor={colors.blue[500]}
                amount="+5"
                label="Serotonin"
                labelColor={colors.blue[400]}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <View className="gap-4 px-8 pb-8">
          <GradientButton onPress={handleFinish}>
            Collect Rewards & Finish
          </GradientButton>
          <Pressable
            onPress={() => {}}
            className="w-full flex-row items-center justify-center gap-2 py-4 active:opacity-70"
          >
            <MaterialIcons name="ios-share" size={20} color={alpha.white70} />
            <Text className="text-sm font-semibold text-white/70">
              Share Victory
            </Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}
