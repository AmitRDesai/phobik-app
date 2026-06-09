import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { useStartDailyFlow } from '@/modules/daily-flow/hooks/useDailyFlowSession';
import { DashboardHeader } from '@/modules/home/components/DashboardHeader';
import { Ionicons } from '@expo/vector-icons';

import { ChallengesStreakCard } from '../components/ChallengesStreakCard';
import { DailyPracticeList } from '../components/DailyPracticeList';
import { DayNavigator } from '../components/DayNavigator';
import { RealTimeAnalysisCard } from '../components/RealTimeAnalysisCard';
import { SectionTitle } from '../components/SectionTitle';
import { useSelectedDashboardDate } from '../hooks/useSelectedDashboardDate';

export default function Dashboard() {
  const nav = useSelectedDashboardDate();
  const { start, canResume } = useStartDailyFlow();

  return (
    <Screen
      scroll
      insetTop={false}
      header={<DashboardHeader />}
      className="px-4 pt-4"
      contentClassName="gap-6"
    >
      <DayNavigator
        date={nav.date}
        isToday={nav.isToday}
        canGoForward={nav.canGoForward}
        onBack={nav.goBack}
        onForward={nav.goForward}
      />

      <View className="gap-3">
        <View className="items-center">
          <Text
            size="h1"
            weight="extrabold"
            align="center"
            className="leading-tight"
          >
            How do you want to
          </Text>
          <GradientText className="text-center text-[28px] font-extrabold leading-tight">
            feel right now?
          </GradientText>
        </View>
        <Text size="sm" tone="secondary" align="center">
          {canResume ? 'Pick up where you left off' : 'Start your Daily Flow'}
        </Text>
        <Button
          variant="primary"
          prefixIcon={<Ionicons name="play" size={18} color="white" />}
          onPress={start}
          fullWidth
        >
          {canResume ? 'Resume Daily Flow' : 'Daily Flow'}
        </Button>
      </View>

      <RealTimeAnalysisCard date={nav.date} />

      <ChallengesStreakCard />

      <View className="gap-3">
        <SectionTitle prefix="Daily" accent="Practice" />
        <DailyPracticeList />
      </View>
    </Screen>
  );
}
