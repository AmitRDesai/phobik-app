import { Text, View } from 'react-native';

import { BenefitCard } from '../components/BenefitCard';
import { StepShell } from '../components/StepShell';

export default function Nourishment() {
  return (
    <StepShell
      step="nourishment"
      habitLabel="Habit 6"
      title="6. Nourishment"
      duration="Within 1-2 hours of waking"
      intro={
        <Text className="text-base leading-6 text-white/70">
          Eat within{' '}
          <Text className="font-bold text-accent-yellow">1-2 hours</Text> of
          waking to fuel your biological rhythm. Focus on nutrient density.
        </Text>
      }
    >
      <BenefitCard
        icon="egg-alt"
        title="Protein"
        description="Supports muscle recovery and steady amino acid supply."
        tone="pink"
      />
      <BenefitCard
        icon="opacity"
        title="Healthy Fats"
        description="Brain energy — long-burning fuel for cognitive work."
        tone="yellow"
      />
      <BenefitCard
        icon="grass"
        title="Fiber"
        description="Supports digestion and a slow, even glucose curve."
        tone="orange"
      />
      <BenefitCard
        icon="water-drop"
        title="Hydration"
        description="Cellular reset after a night of fluid loss."
        tone="pink"
      />
      <View className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <Text className="mb-2 text-xl font-bold text-white">
          Scientific Benefits
        </Text>
        <Text className="text-[14px] leading-6 text-white/65">
          Stabilizes blood sugar, prevents brain fog, supports dopamine and
          serotonin production, and improves sustained attention.
        </Text>
      </View>
    </StepShell>
  );
}
