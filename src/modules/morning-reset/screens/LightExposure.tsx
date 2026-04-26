import { Text, View } from 'react-native';

import { BenefitCard } from '../components/BenefitCard';
import { StepShell } from '../components/StepShell';

export default function LightExposure() {
  return (
    <StepShell
      step="light_exposure"
      habitLabel="Habit 1"
      title="1. Sunlight"
      duration="2-3 min target"
      intro={
        <Text className="text-base leading-6 text-white/70">
          Step outside within{' '}
          <Text className="font-bold text-accent-yellow">30 min</Text> of
          waking. Even on cloudy days.
        </Text>
      }
    >
      <BenefitCard
        icon="schedule"
        title="Internal Clock"
        description="Resets your circadian rhythm, telling your body exactly when the day has begun."
        tone="pink"
      />
      <BenefitCard
        icon="psychology"
        title="Brain Wakefulness"
        description="Triggers a steady cortisol release for natural energy without caffeine."
        tone="yellow"
      />
      <BenefitCard
        icon="nightlight-round"
        title="Sleep Regulation"
        description="Sets a timer for melatonin production 16 hours later — you fall asleep faster tonight."
        tone="orange"
      />
      <View className="h-2" />
    </StepShell>
  );
}
