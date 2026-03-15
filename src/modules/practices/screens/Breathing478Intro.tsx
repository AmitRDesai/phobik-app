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

const exercise = EXERCISES.find((e) => e.id === '478-breathing')!;

export default function Breathing478Intro() {
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
          centerY={0}
          intensity={0.4}
          radius={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-10 flex-row items-center justify-between px-6 py-4">
          <BackButton icon="close" />
          <Text className="text-lg font-extrabold uppercase tracking-tight text-white">
            4-7-8 Breathing
          </Text>
          {/* Spacer to balance the close button */}
          <View className="h-11 w-11" />
        </View>

        {/* Main content */}
        <ScrollView
          className="z-10 flex-1"
          contentContainerClassName="px-6 pb-12"
          showsVerticalScrollIndicator={false}
        >
          {/* Description */}
          <View className="mt-4">
            <Text className="text-sm leading-relaxed text-slate-400">
              {exercise.description}
            </Text>
          </View>

          {/* Energy level section */}
          <View className="mt-10">
            <Text className="mb-6 text-xl font-semibold text-white">
              What is your energy level before your session?
            </Text>
            <EnergyLevelPicker
              selected={selectedEnergy}
              onSelect={setSelectedEnergy}
              variant="icon"
            />
          </View>

          {/* Buttons */}
          <View className="mt-12 gap-4">
            <GradientButton
              onPress={() => router.push('/practices/478-breathing-session')}
            >
              Start Session
            </GradientButton>
            <Pressable
              onPress={() => router.back()}
              className="h-14 w-full items-center justify-center rounded-2xl bg-white/5 active:bg-white/10"
            >
              <Text className="text-xs font-bold uppercase tracking-widest text-white/60">
                Skip
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
