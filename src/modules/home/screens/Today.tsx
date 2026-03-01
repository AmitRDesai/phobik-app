import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { ScrollView, View } from 'react-native';

import { ActionButtons } from '../components/ActionButtons';
import { AffirmationCard } from '../components/AffirmationCard';
import { ChallengesCard } from '../components/ChallengesCard';
import { DashboardHeader } from '../components/DashboardHeader';
import { QuickAccessGrid } from '../components/QuickAccessGrid';
import { RealTimeAnalysisCard } from '../components/RealTimeAnalysisCard';

export default function Today() {
  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.25}
        intensity={0.5}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <DashboardHeader />
      <ScrollView
        contentContainerClassName="gap-4 px-4 py-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <AffirmationCard />
        <RealTimeAnalysisCard />
        <ActionButtons />
        <ChallengesCard />
        <QuickAccessGrid />
        {/* Extra bottom padding for tab bar clearance */}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
