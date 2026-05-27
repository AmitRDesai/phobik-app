import { Screen } from '@/components/ui/Screen';
import { DashboardHeader } from '@/modules/home/components/DashboardHeader';
import { MyJourneySection } from '../components/MyJourneySection';
import { MyRhythmSection } from '../components/MyRhythmSection';
import { MyVibeSection } from '../components/MyVibeSection';
import { useSelectedDashboardDate } from '../hooks/useSelectedDashboardDate';

export default function Dashboard() {
  const nav = useSelectedDashboardDate();

  return (
    <Screen
      scroll
      insetTop={false}
      header={<DashboardHeader />}
      className="px-4 pt-4"
      contentClassName="gap-8"
    >
      <MyRhythmSection
        date={nav.date}
        isToday={nav.isToday}
        canGoForward={nav.canGoForward}
        onBack={nav.goBack}
        onForward={nav.goForward}
      />
      <MyJourneySection />
      <MyVibeSection />
    </Screen>
  );
}
