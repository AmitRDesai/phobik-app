import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

// TODO: wire to real streak data when the backend lands.
const STREAK_DAYS = 12;
const STREAK_GOAL = 14;

export function DailyStreakCard() {
  return (
    <Card variant="raised" size="lg">
      <Text size="xs" treatment="caption" weight="bold" tone="accent">
        Daily Streak
      </Text>
      <View className="mt-2 flex-row items-baseline gap-2">
        <Text size="display" weight="extrabold">
          {STREAK_DAYS}
        </Text>
        <Text size="xs" treatment="caption" weight="bold" tone="secondary">
          Days
        </Text>
      </View>
      <ProgressBar
        progress={STREAK_DAYS / STREAK_GOAL}
        gradient
        size="sm"
        className="mt-4"
      />
      <Text size="xs" tone="secondary" italic className="mt-4">
        Keep your aura glowing.
      </Text>
    </Card>
  );
}
