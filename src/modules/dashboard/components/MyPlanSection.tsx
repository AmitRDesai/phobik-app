import morningResetImage from '@/assets/images/daily-flow/support-amber-glow.png';
import dailyFlowImage from '@/assets/images/daily-flow/support-neural-bloom.png';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { colors } from '@/constants/colors';
import { isTodayLocal } from '@/modules/daily-flow/data/flow-navigation';
import { useActiveDailyFlowSession } from '@/modules/daily-flow/hooks/useDailyFlowSession';
import { useActiveMorningResetSession } from '@/modules/morning-reset/hooks/useMorningResetSession';
import { PlanRow } from './PlanRow';

export function MyPlanSection() {
  const { session: dailyFlowSession } = useActiveDailyFlowSession();
  const { session: morningResetSession } = useActiveMorningResetSession();

  const canResumeDailyFlow =
    !!dailyFlowSession && isTodayLocal(dailyFlowSession.startedAt);
  const canResumeMorningReset =
    !!morningResetSession && isTodayLocal(morningResetSession.startedAt);

  return (
    <View className="gap-4">
      <View className="flex-row items-baseline justify-between">
        <View className="flex-row items-baseline">
          <Text size="h1">My </Text>
          <GradientText className="text-[28px] font-bold leading-[34px]">
            Plan
          </GradientText>
        </View>
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          tone="secondary"
          className="uppercase tracking-widest"
        >
          Today's Focus
        </Text>
      </View>

      <View className="gap-3">
        <PlanRow
          title="Morning Reset"
          eyebrow={canResumeMorningReset ? 'RESUME' : 'MORNING'}
          image={morningResetImage}
          route="/morning-reset"
          accentColor={
            canResumeMorningReset ? colors.accent.yellow : colors.primary.pink
          }
        />
        <PlanRow
          title="Daily Flow"
          eyebrow={canResumeDailyFlow ? 'RESUME' : 'ONGOING'}
          image={dailyFlowImage}
          route="/daily-flow"
          accentColor={
            canResumeDailyFlow ? colors.accent.yellow : colors.accent.orange
          }
        />
      </View>
    </View>
  );
}
