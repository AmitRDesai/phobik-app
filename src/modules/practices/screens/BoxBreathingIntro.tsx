import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  EnergyLevel,
  EnergyLevelPicker,
} from '../components/EnergyLevelPicker';
import { EXERCISES } from '../data/exercises';

const exercise = EXERCISES.find((e) => e.id === 'box-breathing')!;

export default function BoxBreathingIntro() {
  const router = useRouter();
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(
    null,
  );

  return (
    <Container safeAreaClass="bg-background-dark">
      <View className="flex-1 bg-background-dark">
        <GlowBg
          bgClassName="bg-background-dark"
          centerX={0.85}
          centerY={0.05}
          intensity={0.3}
          radius={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-10 flex-row items-center justify-between px-6 py-4">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 active:scale-95"
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={alpha.white80}
            />
          </Pressable>
          <Text className="text-xl font-bold tracking-tight text-white">
            Box Breathing
          </Text>
          <Pressable className="h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 active:scale-95">
            <MaterialIcons
              name="info-outline"
              size={24}
              color={alpha.white80}
            />
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="z-10 flex-1"
          contentContainerClassName="px-6 pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Description */}
          <View className="mb-8 mt-4">
            <Text className="text-sm leading-relaxed text-white/70">
              {exercise.description}
            </Text>
          </View>

          {/* How-to Guide Card */}
          <View
            className="mb-10 rounded-[2rem] border border-primary-pink/20 p-6"
            style={{
              backgroundColor: 'rgba(236, 72, 153, 0.05)',
            }}
          >
            <View className="mb-3 flex-row items-center gap-2">
              <MaterialIcons
                name="integration-instructions"
                size={24}
                color={colors.primary.pink}
              />
              <Text className="text-xs font-bold uppercase tracking-widest text-primary-pink">
                How-to Guide
              </Text>
            </View>
            <Text className="text-sm italic leading-relaxed text-white/90">
              "Inhale to the count of 4, hold your breath for another slow count
              of 4, exhale through your mouth for the same slow count of 4 and
              then hold your breath again to the count of 4."
            </Text>
          </View>

          {/* Energy Level Section */}
          <View className="mb-8">
            <Text className="mb-4 text-lg font-semibold text-white">
              What is your energy level before your session?
            </Text>
            <EnergyLevelPicker
              selected={selectedEnergy}
              onSelect={setSelectedEnergy}
              variant="icon"
            />
          </View>

          {/* Buttons */}
          <View className="mt-4 gap-3">
            <GradientButton
              onPress={() => router.push('/practices/box-breathing-session')}
            >
              Start Session
            </GradientButton>
            <Pressable
              onPress={() => router.back()}
              className="w-full items-center py-4 active:opacity-70"
            >
              <Text className="text-sm font-semibold text-white/40">Skip</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
