import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { PlanRow } from './PlanRow';

export function MyPlanSection() {
  const plan = useDailyPlan();

  if (plan.length === 0) return null;

  return (
    <View className="gap-4">
      <View>
        <View className="flex-row items-baseline">
          <Text variant="h1" className="font-bold">
            My{' '}
          </Text>
          <GradientText className="text-[28px] font-bold leading-[34px]">
            Plan
          </GradientText>
        </View>
        <Text variant="sm" className="mt-1 text-foreground/55">
          Build your best self with focused micro-habits.
        </Text>
      </View>

      <View className="gap-3">
        {plan.map((entry) => (
          <PlanRow
            key={entry.id}
            title={entry.item.title}
            eyebrow={entry.pillarLabel}
            image={entry.item.image}
            route={entry.item.route!}
            accentColor={entry.item.accentColor}
          />
        ))}
      </View>
    </View>
  );
}
