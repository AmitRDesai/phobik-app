import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  EnergyLevel,
  EnergyLevelPicker,
} from '../components/EnergyLevelPicker';
import { EXERCISES } from '../data/exercises';

const exercise = EXERCISES.find((e) => e.id === 'muscle-relaxation')!;

export default function MuscleRelaxationIntro() {
  const router = useRouter();
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(
    null,
  );

  return (
    <Container safeAreaClass="bg-background-charcoal">
      <View className="flex-1 bg-background-charcoal">
        {/* Top-right pink glow */}
        <GlowBg
          bgClassName="bg-background-charcoal"
          centerX={0.9}
          centerY={0.0}
          intensity={0.35}
          radius={0.35}
          startColor={colors.primary.pink}
          endColor={colors.primary.pink}
        />

        {/* Bottom-left warm yellow glow */}
        <View
          className="absolute -bottom-[5%] -left-[5%] h-[350px] w-[350px]"
          style={{
            backgroundColor: 'transparent',
            shadowColor: colors.accent.yellow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 120,
          }}
        />

        {/* Header */}
        <View className="z-10 flex-row items-center justify-between px-6 pb-4 pt-3">
          <BackButton />
          <View className="flex-1 px-4">
            <Text className="text-center text-lg font-bold leading-tight tracking-tight text-white">
              Progressive Muscle Relaxation
            </Text>
          </View>
          <View className="h-10 w-10" />
        </View>

        {/* Main scrollable content */}
        <ScrollView
          className="z-10 flex-1"
          contentContainerClassName="px-6 pt-4 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Description */}
          <View className="mb-10">
            <Text className="mx-auto max-w-sm text-center text-sm leading-relaxed text-white/70">
              {exercise.description}
            </Text>
          </View>

          {/* Energy level question */}
          <View className="mb-6">
            <Text className="mb-6 text-center text-lg font-semibold text-white/90">
              What is your energy level before your session?
            </Text>
            <EnergyLevelPicker
              selected={selectedEnergy}
              onSelect={setSelectedEnergy}
              variant="emoji"
            />
          </View>

          {/* Buttons */}
          <View className="mt-12 gap-4">
            <GradientButton
              onPress={() =>
                router.push('/practices/muscle-relaxation-session')
              }
            >
              Start
            </GradientButton>
            <Pressable
              onPress={() => router.back()}
              className="w-full items-center py-2 active:opacity-70"
            >
              <Text className="text-sm font-medium text-white/40">Skip</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
