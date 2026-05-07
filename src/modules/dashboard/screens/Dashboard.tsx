import { Screen } from '@/components/ui/Screen';
import { DashboardHeader } from '@/modules/home/components/DashboardHeader';
import { MyPlanSection } from '../components/MyPlanSection';
import { MyRhythmSection } from '../components/MyRhythmSection';
import { RealTimeAnalysisSection } from '../components/RealTimeAnalysisSection';
import { useSelectedDashboardDate } from '../hooks/useSelectedDashboardDate';

export default function Dashboard() {
  const nav = useSelectedDashboardDate();

  return (
    <Screen
      variant="default"
      scroll
      insetTop={false}
      header={<DashboardHeader />}
      className="px-4 pt-4"
      contentClassName="gap-8"
    >
      <RealTimeAnalysisSection
        date={nav.date}
        isToday={nav.isToday}
        canGoForward={nav.canGoForward}
        onBack={nav.goBack}
        onForward={nav.goForward}
      />
      <MyRhythmSection />
      <MyPlanSection />
    </Screen>
  );
}
