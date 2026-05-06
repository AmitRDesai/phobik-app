import { Card } from '@/components/ui/Card';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Text } from 'react-native';

import { BenefitCard } from '../components/BenefitCard';
import { StepShell } from '../components/StepShell';

export default function Nourishment() {
  const scheme = useScheme();
  return (
    <StepShell
      step="nourishment"
      habitLabel="Habit 6"
      title="6. Nourishment"
      duration="Within 1-2 hours of waking"
      intro={
        <Text className="text-base leading-6 text-foreground/70">
          Eat within{' '}
          <Text
            className="font-bold"
            style={{ color: accentFor(scheme, 'yellow') }}
          >
            1-2 hours
          </Text>{' '}
          of waking to fuel your biological rhythm. Focus on nutrient density.
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
      <Card variant="glass">
        <Text className="mb-2 text-xl font-bold text-foreground">
          Scientific Benefits
        </Text>
        <Text className="text-[14px] leading-6 text-foreground/65">
          Stabilizes blood sugar, prevents brain fog, supports dopamine and
          serotonin production, and improves sustained attention.
        </Text>
      </Card>
    </StepShell>
  );
}
