import { Text } from '@/components/themed/Text';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import { BenefitCard } from '../components/BenefitCard';
import { StepShell } from '../components/StepShell';

export default function DeepFocus() {
  const scheme = useScheme();
  return (
    <StepShell
      step="deep_focus"
      habitLabel="Final Step"
      title="7. Deep Focus"
      duration="60-120 min after breakfast"
      intro={
        <Text size="lg" className="leading-6 text-foreground/70">
          Your peak window opens{' '}
          <Text
            size="lg"
            weight="bold"
            style={{ color: accentFor(scheme, 'yellow') }}
          >
            60-120 minutes
          </Text>{' '}
          after waking. Spend it on your most demanding work — not on
          notifications.
        </Text>
      }
    >
      <BenefitCard
        icon="schedule"
        title="The Golden Hour"
        description="Cognitive function and alertness intersect perfectly for hard tasks."
        tone="pink"
      />
      <BenefitCard
        icon="bolt"
        title="Why It Works"
        description="Builds a habit of high-quality output and protects creative energy."
        tone="yellow"
      />
    </StepShell>
  );
}
