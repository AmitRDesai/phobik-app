import { Text } from 'react-native';

import { BenefitCard } from '../components/BenefitCard';
import { StepShell } from '../components/StepShell';

export default function MentalReset() {
  return (
    <StepShell
      step="mental_reset"
      habitLabel="Habit 3"
      title="3. Journaling"
      duration="2-3 min target"
      intro={
        <Text className="text-base leading-6 text-white/70">
          Reset your mind before the noise hits. A few honest sentences about
          what matters to you today.
        </Text>
      }
    >
      <BenefitCard
        icon="auto-awesome"
        title="Mental Clarity"
        description="Dissolves mental fog and sharpens focus for the tasks ahead."
        tone="pink"
      />
      <BenefitCard
        icon="cloud-off"
        title="Reduces Rumination"
        description="Moves looping thoughts out of your head and onto the page."
        tone="yellow"
      />
    </StepShell>
  );
}
