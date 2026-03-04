import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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
  withTiming,
} from 'react-native-reanimated';

import { CompletionBadge } from '../components/CompletionBadge';
import {
  EnergyLevel,
  EnergyLevelPicker,
} from '../components/EnergyLevelPicker';

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

export default function Completion() {
  const router = useRouter();
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(
    null,
  );

  const handleSave = () => {
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

        {/* Close button */}
        <View className="flex-row items-center justify-end p-6">
          <Pressable
            onPress={() => router.dismissAll()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/5 active:opacity-70"
          >
            <MaterialIcons
              name="close"
              size={24}
              color="rgba(255,255,255,0.4)"
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerClassName="flex-grow items-center px-6 pt-4"
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
              You've successfully completed a mindfulness session.
            </Text>
          </View>

          {/* Energy Level Picker */}
          <View className="mb-12 w-full gap-6">
            <Text className="text-center text-lg font-bold tracking-tight text-white">
              What is your energy level after your session?
            </Text>
            <EnergyLevelPicker
              selected={selectedEnergy}
              onSelect={setSelectedEnergy}
            />
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <View className="gap-4 px-8 pb-8">
          <GradientButton onPress={handleSave}>Save to Insights</GradientButton>
          <Pressable
            onPress={() => {}}
            className="w-full flex-row items-center justify-center gap-2 py-4 active:opacity-70"
          >
            <MaterialIcons
              name="ios-share"
              size={20}
              color="rgba(255,255,255,0.7)"
            />
            <Text className="text-sm font-semibold text-white/70">
              Share Victory
            </Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}
