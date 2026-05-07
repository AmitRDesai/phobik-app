import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';

import { BenefitCard } from '../components/BenefitCard';
import { StepShell } from '../components/StepShell';

export default function ColdExposure() {
  return (
    <StepShell
      step="cold_exposure"
      habitLabel="Habit 5"
      title="5. Cold Shower"
      duration="1-3 min cold water"
      intro={
        <Text variant="lg" className="leading-6 text-foreground/70">
          Brief cold exposure forces your biology to adapt. Focus on steady,
          deep breaths as you enter the water.
        </Text>
      }
    >
      <Card variant="glass" className="p-5">
        <Text
          variant="caption"
          className="mb-2 font-bold tracking-[0.3em] text-foreground/50"
          style={{ paddingRight: 3 }}
        >
          The Protocol
        </Text>
        <Text variant="md" className="leading-6 text-foreground/80">
          Embrace the shock. Train the spirit. Stay calm and breathe through the
          first 30 seconds.
        </Text>
      </Card>
      <BenefitCard
        icon="bolt"
        title="Peak Alertness"
        description="A massive dopamine release that lasts for hours."
        tone="pink"
      />
      <BenefitCard
        icon="favorite"
        title="Nervous System"
        description="Strengthens the vagus nerve and heart rate variability."
        tone="yellow"
      />
      <BenefitCard
        icon="shield"
        title="Resilience"
        description="Mental training to lean into discomfort and stay calm."
        tone="orange"
      />
    </StepShell>
  );
}
