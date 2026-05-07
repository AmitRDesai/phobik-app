import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { ScrollView } from 'react-native';

import { DetailHeader } from '../components/DetailHeader';
import { DoseActivityLog } from '../components/DoseActivityLog';
import { DoseDeficiencyAlert } from '../components/DoseDeficiencyAlert';
import { DoseProgressBar } from '../components/DoseProgressBar';
import { buildDoseChemicals } from '../data/dose-config';
import { useDailyDose } from '../hooks/useDailyDose';

export default function DoseTracking() {
  const { data: totals } = useDailyDose();
  const chemicals = buildDoseChemicals(totals);
  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-surface"
        centerY={0.1}
        intensity={0.4}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <DetailHeader title="Daily D.O.S.E." />
      <ScrollView
        contentContainerClassName="gap-8 px-6 pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-6">
          <Text variant="h1" className="text-primary-pink">
            Daily D.O.S.E.
          </Text>
          <Text variant="sm" muted className="mt-1">
            How well did you nourish your brain today?
          </Text>
        </View>
        {/* Progress Bars */}
        <View className="gap-6">
          {chemicals.map((chem, i) => (
            <DoseProgressBar key={chem.key} chemical={chem} index={i} />
          ))}
        </View>
        {/* Deficiency Alert */}
        <DoseDeficiencyAlert totals={totals} />
        {/* Activity Log */}
        <DoseActivityLog />
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
