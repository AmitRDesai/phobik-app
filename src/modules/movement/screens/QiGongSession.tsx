import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { MovementSessionShell } from './MovementSessionShell';

const DURATIONS = ['30s', '60s'];

const PRIMER = {
  icon: 'self-improvement' as const,
  title: 'Stand tall. Soften your knees.',
  description: 'Ground your weight through your heels.',
};

const CHECKLIST = [
  { id: 'bounce', title: 'Begin gently bouncing...' },
  { id: 'arms', title: 'Let your arms hang loose...' },
  { id: 'shake', title: 'Allow the shake to move through your body...' },
  { id: 'release', title: 'Release your jaw... your shoulders...' },
];

type StepState = 'completed' | 'current' | 'upcoming';

function classify(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return 'completed';
  if (index === currentIndex) return 'current';
  return 'upcoming';
}

export default function QiGongSession() {
  const [duration, setDuration] = useState('60s');
  const currentIndex = 2; // "Allow the shake..." active per design

  return (
    <MovementSessionShell
      wordmark="Qi Gong Shaking"
      bottom={
        <View className="items-center">
          <Text className="mb-3 text-sm text-foreground/50">
            Let it settle... and feel the difference.
          </Text>
          <View className="w-full">
            <GradientButton onPress={() => {}}>End Session</GradientButton>
          </View>
        </View>
      }
    >
      <View className="items-center pt-6">
        <Text className="text-2xl font-extrabold text-foreground">
          Qi Gong Shaking
        </Text>
        <Text className="mt-2 text-sm text-foreground/60">
          Let your body release stored energy.
        </Text>
      </View>

      {/* Duration tabs */}
      <View className="mt-6 flex-row justify-center gap-3">
        {DURATIONS.map((d) => {
          const active = d === duration;
          return (
            <Pressable
              key={d}
              onPress={() => setDuration(d)}
              className={`rounded-full px-6 py-2 ${
                active
                  ? 'border border-primary-pink/50 bg-primary-pink/20'
                  : 'border border-foreground/10 bg-foreground/5'
              }`}
            >
              <Text
                className={`text-sm font-bold ${active ? 'text-primary-pink' : 'text-foreground/70'}`}
              >
                {d}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Hero state badge */}
      <View className="mt-8 items-center">
        <View
          className="h-[220px] w-[180px] items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 px-6"
          style={{
            shadowColor: colors.accent.yellow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 30,
          }}
        >
          <MaterialIcons name="air" size={56} color={colors.accent.yellow} />
          <Text className="mt-5 text-center text-[10px] uppercase tracking-widest text-foreground/60">
            Flow State Active
          </Text>
        </View>
      </View>

      {/* Primer instruction card (icon + headline + sub-text) */}
      <View className="mt-10 flex-row items-start gap-3 rounded-3xl border border-foreground/10 bg-foreground/5 p-5">
        <View className="h-10 w-10 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10">
          <MaterialIcons
            name={PRIMER.icon}
            size={20}
            color={colors.primary.pink}
          />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground">
            {PRIMER.title}
          </Text>
          <Text className="mt-1 text-sm text-foreground/70">
            {PRIMER.description}
          </Text>
        </View>
      </View>

      {/* Checklist with completed / current / upcoming states */}
      <View className="mt-4 gap-3 pb-8">
        {CHECKLIST.map((step, i) => {
          const state = classify(i, currentIndex);

          if (state === 'completed') {
            return (
              <View
                key={step.id}
                className="flex-row items-center gap-3 rounded-3xl border border-foreground/5 bg-foreground/5 px-5 py-3"
              >
                <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-pink/20">
                  <MaterialIcons
                    name="check"
                    size={14}
                    color={colors.primary.pink}
                  />
                </View>
                <Text className="flex-1 text-sm text-foreground/50">
                  {step.title}
                </Text>
              </View>
            );
          }

          if (state === 'current') {
            return (
              <View
                key={step.id}
                className="flex-row items-center gap-3 rounded-3xl border border-primary-pink/40 bg-primary-pink/10 p-5"
                style={{
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                }}
              >
                <View className="h-7 w-7 items-center justify-center rounded-full">
                  <MaterialIcons
                    name="radio-button-checked"
                    size={24}
                    color={colors.primary.pink}
                  />
                </View>
                <Text className="flex-1 text-base font-bold text-foreground">
                  {step.title}
                </Text>
              </View>
            );
          }

          // upcoming
          return (
            <View
              key={step.id}
              className="flex-row items-center gap-3 rounded-3xl border border-foreground/5 px-5 py-3"
            >
              <MaterialIcons
                name="radio-button-unchecked"
                size={20}
                color="rgba(255,255,255,0.25)"
              />
              <Text className="flex-1 text-sm text-foreground/40">
                {step.title}
              </Text>
            </View>
          );
        })}
      </View>
    </MovementSessionShell>
  );
}
