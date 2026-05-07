import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { useWeekRhythm } from '../hooks/useWeekRhythm';
import { RhythmFlowCard } from './RhythmFlowCard';
import { WeekRhythmStrip } from './WeekRhythmStrip';

import morningResetImage from '@/assets/images/daily-flow/support-amber-glow.png';
import dailyFlowImage from '@/assets/images/daily-flow/support-neural-bloom.png';
import { useActiveDailyFlowSession } from '@/modules/daily-flow/hooks/useDailyFlowSession';
import { useEnterDailyFlow } from '@/modules/daily-flow/hooks/useEnterDailyFlow';
import { useEnterMorningReset } from '@/modules/morning-reset/hooks/useEnterMorningReset';

export function MyRhythmSection() {
  const { days } = useWeekRhythm();

  useActiveDailyFlowSession();
  const enterFlow = useEnterDailyFlow();
  const enterMorningReset = useEnterMorningReset();

  return (
    <View className="gap-4">
      <View>
        <View className="flex-row items-baseline">
          <Text variant="h1" className="font-bold">
            My{' '}
          </Text>
          <GradientText className="text-[28px] font-bold leading-[34px]">
            Rhythm
          </GradientText>
        </View>
        <Text variant="sm" className="mt-1 text-foreground/55">
          Your flow patterns this week.
        </Text>
      </View>

      <Card variant="elevated" className="px-3 py-5">
        <WeekRhythmStrip days={days} />
      </Card>

      <View className="flex-row gap-4">
        <RhythmFlowCard
          title="Morning Quick Reset"
          subtitle="15 Minute Session"
          image={morningResetImage}
          onPress={enterMorningReset}
        />
        <RhythmFlowCard
          title="Daily Flow"
          subtitle="Deep Session"
          image={dailyFlowImage}
          onPress={enterFlow}
        />
      </View>
    </View>
  );
}
