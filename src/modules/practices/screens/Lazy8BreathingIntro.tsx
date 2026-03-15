import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { type EnergyLevel } from '../components/EnergyLevelPicker';
import { EXERCISES } from '../data/exercises';

const exercise = EXERCISES.find((e) => e.id === 'lazy-8-breathing')!;

// Energy options matching the design exactly (vertical emoji cards)
const ENERGY_OPTIONS: { id: EnergyLevel; emoji: string; label: string }[] = [
  {
    id: 'peak-positive',
    emoji: String.fromCodePoint(0x26a1),
    label: 'Peak Positive',
  },
  {
    id: 'positive-calm',
    emoji: String.fromCodePoint(0x2728),
    label: 'Positive Calm',
  },
  {
    id: 'low-energy',
    emoji: String.fromCodePoint(0x1f56f) + '\uFE0F',
    label: 'Low Energy',
  },
  { id: 'stressed', emoji: String.fromCodePoint(0x1f30a), label: 'Stressed' },
  {
    id: 'intense-negative',
    emoji: String.fromCodePoint(0x1f32a) + '\uFE0F',
    label: 'Intense Negative',
  },
  { id: 'dont-know', emoji: String.fromCodePoint(0x2754), label: "Don't Know" },
];

function InfinityIcon() {
  return (
    <View
      className="relative mb-8 items-center justify-center"
      style={{ width: 96, height: 48 }}
    >
      <Svg width={96} height={48} viewBox="0 0 100 50">
        <Defs>
          <LinearGradient id="introGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.primary.pink} stopOpacity={1} />
            <Stop
              offset="100%"
              stopColor={colors.accent.yellow}
              stopOpacity={1}
            />
          </LinearGradient>
        </Defs>
        <Path
          d="M25,25 C25,5 45,5 50,25 C55,45 75,45 75,25 C75,5 55,5 50,25 C45,45 25,45 25,25"
          fill="none"
          stroke="url(#introGrad)"
          strokeLinecap="round"
          strokeWidth={3}
        />
      </Svg>
      <View
        className="absolute"
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.primary.pink,
          top: '50%',
          left: '50%',
          marginTop: -8,
          marginLeft: -8,
          opacity: 0.9,
        }}
      />
    </View>
  );
}

export default function Lazy8BreathingIntro() {
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

        {/* Header */}
        <View className="z-10 flex-row items-center justify-between px-6 pt-6">
          <BackButton />
          <Text className="text-xl font-bold tracking-tight text-white">
            Lazy 8 Breathing
          </Text>
          <View className="h-10 w-10" />
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="z-10 flex-1"
          contentContainerClassName="items-center px-6 pt-8 pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Infinity icon */}
          <InfinityIcon />

          {/* Description */}
          <Text className="mb-10 max-w-sm text-center text-sm leading-relaxed text-slate-300">
            {exercise.description}
          </Text>

          {/* Energy level heading */}
          <Text className="mb-6 text-center text-lg font-semibold text-white">
            What is your energy level before your session?
          </Text>

          {/* Energy picker grid (vertical emoji cards matching design) */}
          <View className="mb-10 w-full flex-row flex-wrap justify-between gap-y-4">
            {ENERGY_OPTIONS.map((option) => {
              const isActive = selectedEnergy === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => setSelectedEnergy(option.id)}
                  className="active:scale-95"
                  style={{ width: '48%' }}
                >
                  <View
                    className={`items-center rounded-2xl border p-4 ${
                      isActive
                        ? 'border-primary-pink bg-primary-pink/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <Text className="mb-1 text-xl">{option.emoji}</Text>
                    <Text
                      className={`text-xs font-medium uppercase tracking-wider ${
                        isActive ? 'text-white' : 'text-slate-200'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Buttons */}
          <View className="w-full gap-4">
            <GradientButton
              onPress={() => router.push('/practices/lazy-8-breathing-session')}
            >
              Start Session
            </GradientButton>
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-full items-center justify-center active:opacity-60"
            >
              <Text className="text-sm font-medium text-slate-400">
                Skip for now
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
