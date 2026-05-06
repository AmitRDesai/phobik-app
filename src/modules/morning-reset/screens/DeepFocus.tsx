import { Card } from '@/components/ui/Card';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Text } from 'react-native';

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
        <Text className="text-base leading-6 text-foreground/70">
          Your peak window opens{' '}
          <Text
            className="font-bold"
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
      <Card variant="toned" tone="pink">
        <Text className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60">
          Press to sync your bio-rhythm
        </Text>
      </Card>
    </StepShell>
  );
}
