import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { ScrollView, Text, View } from 'react-native';

import { DetailHeader } from '../components/DetailHeader';
import { DoseActivityLog } from '../components/DoseActivityLog';
import { DoseDeficiencyAlert } from '../components/DoseDeficiencyAlert';
import { DoseProgressBar } from '../components/DoseProgressBar';
import { DOSE_CHEMICALS } from '../data/dose-config';

export default function DoseTracking() {
  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
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
          <Text className="text-3xl font-bold tracking-tight text-primary-pink">
            Daily D.O.S.E.
          </Text>
          <Text className="mt-1 text-sm text-white/60">
            How well did you nourish your brain today?
          </Text>
        </View>
        {/* Progress Bars */}
        <View className="gap-6">
          {DOSE_CHEMICALS.map((chem, i) => (
            <DoseProgressBar key={chem.key} chemical={chem} index={i} />
          ))}
        </View>
        {/* Deficiency Alert */}
        <DoseDeficiencyAlert />
        {/* Activity Log */}
        <DoseActivityLog />
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
