import { Screen } from '@/components/ui/Screen';

import { ActionButtons } from '../components/ActionButtons';
import { AffirmationCard } from '../components/AffirmationCard';
import { ChallengesCard } from '../components/ChallengesCard';
import { CharacterDevLinks } from '../components/CharacterDevLinks';
import { DailyFlowHero } from '../components/DailyFlowHero';
import { DashboardHeader } from '../components/DashboardHeader';
import { QuickAccessGrid } from '../components/QuickAccessGrid';
import { RealTimeAnalysisCard } from '../components/RealTimeAnalysisCard';

export default function Today() {
  return (
    <Screen
      variant="default"
      scroll
      insetTop={false}
      header={<DashboardHeader />}
      className="px-4"
      contentClassName="gap-4"
    >
      <DailyFlowHero />
      <RealTimeAnalysisCard />
      <ActionButtons />
      <ChallengesCard />
      <QuickAccessGrid />
      <AffirmationCard />
      <CharacterDevLinks />
    </Screen>
  );
}
