import { Text } from '@/components/themed/Text';

import { BenefitCard } from '../components/BenefitCard';
import { StepShell } from '../components/StepShell';

export default function Stillness() {
  return (
    <StepShell
      step="stillness"
      habitLabel="Habit 2"
      title="2. Just Breathe"
      duration="2-3 min target"
      intro={
        <Text variant="lg" className="leading-6 text-foreground/70">
          Take 2-3 minutes to sit quietly. Allow the world to fade as you anchor
          into the present moment.
        </Text>
      }
    >
      <BenefitCard
        icon="center-focus-strong"
        title="Focus"
        description="Quiets the noise so attention can settle on what matters today."
        tone="pink"
      />
      <BenefitCard
        icon="air"
        title="Stress Control"
        description="Lowers cortisol and tells your nervous system you're safe."
        tone="yellow"
      />
      <BenefitCard
        icon="favorite"
        title="Regulation"
        description="Stabilizes heart rate variability and breathing rhythm."
        tone="orange"
      />
    </StepShell>
  );
}
