import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { DailyStreakCard } from '../components/DailyStreakCard';
import { PlanOverviewCard } from '../components/PlanOverviewCard';
import { WeeklyProgressCard } from '../components/WeeklyProgressCard';

const TAGLINE_LINES: { prefix: string; accent: string; suffix?: string }[] = [
  { prefix: 'Set ', accent: 'Goals', suffix: ',' },
  { prefix: 'Track ', accent: 'Progress', suffix: ',' },
  { prefix: 'Turn small ', accent: 'actions' },
  { prefix: 'Into long term ', accent: 'wins' },
];

export default function MyJourney() {
  return (
    <Screen
      scroll
      header={<Header variant="back" title="My Journey" />}
      contentClassName="gap-6 pb-6"
    >
      <View className="gap-1">
        {TAGLINE_LINES.map(({ prefix, accent, suffix }) => (
          <View key={accent} className="flex-row items-baseline">
            <Text size="h2" weight="bold">
              {prefix}
            </Text>
            <GradientText className="text-[22px] font-bold leading-[28px]">
              {accent}
            </GradientText>
            {suffix ? (
              <Text size="h2" weight="bold">
                {suffix}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
      <PlanOverviewCard />
      <WeeklyProgressCard />
      <DailyStreakCard />
    </Screen>
  );
}
