import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  EnergyLevel,
  EnergyLevelPicker,
} from '../components/EnergyLevelPicker';
import { EXERCISES } from '../data/exercises';

const exercise = EXERCISES.find((e) => e.id === 'double-inhale')!;

export default function DoubleInhaleIntro() {
  const router = useRouter();
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(
    null,
  );

  return (
    <Container safeAreaClass="bg-background-dark">
      <View className="flex-1 bg-background-dark">
        <GlowBg
          bgClassName="bg-background-dark"
          centerX={0.5}
          centerY={0.2}
          intensity={0.4}
          radius={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Header */}
        <View className="z-10 flex-row items-center justify-between px-6 pb-6 pt-3.5">
          <BackButton />
          <Text className="text-xs font-semibold uppercase tracking-widest text-primary-pink">
            PHOBIK Practice
          </Text>
          <Pressable className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 active:opacity-70">
            <MaterialIcons name="more-horiz" size={20} color="white" />
          </Pressable>
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="z-10 flex-1"
          contentContainerClassName="px-6 pb-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Gradient icon */}
          <View className="mb-6 items-center">
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
              }}
            >
              <MaterialIcons name="air" size={30} color="white" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text className="mb-4 text-center text-3xl font-bold tracking-tight text-white">
            Double Inhale Breathing
          </Text>

          {/* Description */}
          <Text className="mb-10 px-2 text-center text-sm leading-relaxed text-white/40">
            {exercise.description}
          </Text>

          {/* Energy level question */}
          <View className="mb-8">
            <Text className="mb-6 text-center text-lg font-medium text-white">
              What is your energy level before your session?
            </Text>
            <EnergyLevelPicker
              selected={selectedEnergy}
              onSelect={setSelectedEnergy}
              variant="icon"
            />
          </View>

          {/* Buttons */}
          <View className="gap-4">
            <GradientButton
              onPress={() => router.push('/practices/double-inhale-session')}
            >
              Start
            </GradientButton>
            <Pressable
              onPress={() => router.back()}
              className="w-full items-center py-2 active:opacity-70"
            >
              <Text className="font-medium text-white/40">Skip</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
