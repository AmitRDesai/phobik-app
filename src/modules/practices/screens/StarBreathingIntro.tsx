import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  EnergyLevel,
  EnergyLevelPicker,
} from '../components/EnergyLevelPicker';
import { EXERCISES } from '../data/exercises';

const exercise = EXERCISES.find((e) => e.id === 'star-breathing')!;

export default function StarBreathingIntro() {
  const router = useRouter();
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(
    null,
  );

  return (
    <Container safeAreaClass="bg-background-charcoal">
      <View className="flex-1 bg-background-charcoal">
        <GlowBg
          bgClassName="bg-background-charcoal"
          centerX={0.8}
          centerY={0.2}
          intensity={0.4}
          radius={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Close button — top-left, glass pill style */}
        <View className="absolute left-6 top-3 z-40">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 active:scale-95"
          >
            <MaterialIcons
              name="close"
              size={24}
              color="rgba(255,255,255,0.7)"
            />
          </Pressable>
        </View>

        {/* Main content — centered */}
        <View className="z-10 flex-1 items-center justify-center px-6 pb-32 pt-24">
          <View className="w-full max-w-md items-center">
            {/* Star icon with glow */}
            <View className="relative mb-4 h-16 w-16 items-center justify-center">
              <View
                className="absolute inset-0"
                style={{
                  backgroundColor: 'rgba(236,72,153,0.2)',
                  borderRadius: 999,
                  // Blur approximation — use shadow
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 24,
                }}
              />
              <MaterialIcons name="auto-awesome" size={36} color="#f472b6" />
            </View>

            {/* Title */}
            <Text className="mb-3 text-center text-3xl font-bold tracking-tight text-white">
              Star Breathing
            </Text>

            {/* Description */}
            <Text className="mx-auto mb-6 max-w-sm text-center text-[13px] leading-relaxed text-white/60">
              {exercise.description}
            </Text>

            {/* Energy level picker */}
            <View className="mb-6 w-full">
              <Text className="mb-4 text-center text-base font-semibold text-white">
                What is your energy level now?
              </Text>
              <EnergyLevelPicker
                selected={selectedEnergy}
                onSelect={setSelectedEnergy}
                variant="icon"
              />
            </View>

            {/* Buttons */}
            <View className="w-full gap-3">
              <GradientButton
                onPress={() => router.push('/practices/star-breathing-session')}
              >
                Start
              </GradientButton>
              <Pressable
                onPress={() => router.back()}
                className="w-full items-center py-1 active:opacity-70"
              >
                <Text className="text-sm font-medium text-white/40">Skip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
