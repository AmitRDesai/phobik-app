import Container from '@/components/ui/Container';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  EnergyLevel,
  EnergyLevelPicker,
} from '../components/EnergyLevelPicker';
import { SenseCard } from '../components/SenseCard';
import { EXERCISES } from '../data/exercises';

const exercise = EXERCISES.find((e) => e.id === 'grounding-54321')!;

export default function GroundingIntro() {
  const router = useRouter();
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(
    null,
  );

  return (
    <Container safeAreaClass="bg-background-dashboard">
      <View className="flex-1 bg-background-dashboard">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-start active:opacity-70"
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color="white"
              style={{ marginTop: 8 }}
            />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-white">
            Technique Intro
          </Text>
          <View className="h-10 w-10 items-center justify-end">
            <MaterialIcons
              name="info-outline"
              size={24}
              color="rgba(255,255,255,0.6)"
              style={{ marginTop: 8 }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Badge + Title + Description */}
          <View className="items-center px-6 pb-8 pt-4">
            <View className="mb-4 rounded-full border border-primary-pink/20 bg-primary-pink/10 px-3 py-1">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
                Grounding Exercise
              </Text>
            </View>

            <View className="mb-4 flex-row flex-wrap items-center justify-center">
              <Text className="text-4xl font-extrabold leading-tight text-white">
                {'The '}
              </Text>
              <MaskedView
                maskElement={
                  <Text className="text-4xl font-extrabold">5-4-3-2-1</Text>
                }
              >
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-4xl font-extrabold opacity-0">
                    5-4-3-2-1
                  </Text>
                </LinearGradient>
              </MaskedView>
              <Text className="text-4xl font-extrabold leading-tight text-white">
                {' technique'}
              </Text>
            </View>

            <Text className="max-w-[90%] text-center text-sm leading-relaxed text-white/70">
              {exercise.description}
            </Text>
          </View>

          {/* Sense cards */}
          <View className="gap-3 px-6">
            {exercise.steps?.map((step) => (
              <SenseCard
                key={step.count}
                count={step.count}
                title={step.title}
                subtitle={step.subtitle}
              />
            ))}
          </View>

          {/* Energy Level */}
          <View className="mb-12 mt-10 px-6">
            <View className="mb-6 flex-row items-end justify-between">
              <Text className="flex-1 text-lg font-bold text-white">
                What is your energy level before your session?
              </Text>
              <Pressable className="pb-1 active:opacity-70">
                <Text className="text-xs font-medium text-white/40">Skip</Text>
              </Pressable>
            </View>
            <EnergyLevelPicker
              selected={selectedEnergy}
              onSelect={setSelectedEnergy}
              variant="centered-icon"
            />
          </View>

          {/* Ready to begin */}
          <View className="mb-8 px-6">
            <View className="mb-6 items-center">
              <Text className="text-xl font-bold text-white">
                Ready to begin?
              </Text>
              <Text className="mt-1 text-xs text-white/40">
                Estimated duration: 3-5 minutes
              </Text>
            </View>
            <View className="gap-3">
              <GradientButton
                onPress={() => router.push('/practices/grounding-session')}
              >
                Start Session
              </GradientButton>
              <Pressable className="w-full items-center rounded-2xl border border-white/5 bg-white/5 py-4 active:opacity-70">
                <Text className="text-sm font-medium text-white/60">
                  Restart Progress
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
