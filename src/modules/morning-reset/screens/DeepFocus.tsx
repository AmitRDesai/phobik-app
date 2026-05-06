import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Text, View } from 'react-native';

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
      <View className="rounded-3xl border border-primary-pink/20 bg-primary-pink/[0.06] p-6">
        <Text className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60">
          Press to sync your bio-rhythm
        </Text>
      </View>
    </StepShell>
  );
}
