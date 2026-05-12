import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';

import { DoseActivityLog } from '../components/DoseActivityLog';
import { DoseDeficiencyAlert } from '../components/DoseDeficiencyAlert';
import { DoseProgressBar } from '../components/DoseProgressBar';
import { buildDoseChemicals } from '../data/dose-config';
import { useDailyDose } from '../hooks/useDailyDose';

export default function DoseTracking() {
  const { data: totals } = useDailyDose();
  const chemicals = buildDoseChemicals(totals);

  return (
    <Screen
      scroll
      header={<Header title="Daily D.O.S.E." />}
      className="px-6"
      contentClassName="gap-8 pb-4"
    >
      <View className="pt-4">
        <Text size="h1" tone="accent">
          Daily D.O.S.E.
        </Text>
        <Text size="sm" tone="secondary" className="mt-1">
          How well did you nourish your brain today?
        </Text>
      </View>

      <View className="gap-6">
        {chemicals.map((chem, i) => (
          <DoseProgressBar key={chem.key} chemical={chem} index={i} />
        ))}
      </View>

      <DoseDeficiencyAlert totals={totals} />
      <DoseActivityLog />
    </Screen>
  );
}
