import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import { BenefitCard } from '../components/BenefitCard';
import { StepShell } from '../components/StepShell';
import { Text } from '@/components/themed/Text';

export default function Movement() {
  const scheme = useScheme();
  return (
    <StepShell
      step="movement"
      habitLabel="Habit 4"
      title="4. Movement"
      duration="5-10 min target"
      intro={
        <Text className="text-base leading-6 text-foreground/70">
          Dedicate{' '}
          <Text
            className="font-bold"
            style={{ color: accentFor(scheme, 'yellow') }}
          >
            5-10 minutes
          </Text>{' '}
          to body movement — a walk, stretch, or anything that gets you
          breathing.
        </Text>
      }
    >
      <BenefitCard
        icon="air"
        title="Oxygen"
        description="Increases cerebral blood flow for instant clarity."
        tone="pink"
      />
      <BenefitCard
        icon="bolt"
        title="Motivation"
        description="Spikes dopamine and serotonin for sustained focus."
        tone="yellow"
      />
      <BenefitCard
        icon="psychology"
        title="Memory"
        description="Stimulates BDNF for neuroplasticity and growth."
        tone="orange"
      />
    </StepShell>
  );
}
