import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { colors, withAlpha } from '@/constants/colors';
import {
  formatCount,
  useActiveChallenge,
  useMicroChallengeStats,
} from '@/modules/micro-challenges/hooks/useMicroChallenge';
import { useRouter } from 'expo-router';
import { StreakGrid } from './StreakGrid';

export function ChallengesCard() {
  const router = useRouter();
  const { challenge: activeChallenge } = useActiveChallenge();
  const { totalCompleted, completedToday, completedDates } =
    useMicroChallengeStats();

  const hasActive = !!activeChallenge;

  const handlePress = () => {
    router.push('/practices/micro-challenges');
  };

  return (
    <Card
      variant="raised"
      size="lg"
      shadow={{
        color: colors.primary.pink,
        opacity: 0.1,
        blur: 24,
        offsetY: 8,
      }}
      className="p-5"
    >
      <View className="mb-5 flex-row gap-4">
        <View className="justify-center border-r border-foreground/10 pr-4">
          <Text
            size="xs"
            treatment="caption"
            tone="secondary"
            weight="bold"
            className="mb-1 text-[9px] leading-tight"
            style={{ paddingRight: 1.8 }}
          >
            Total{'\n'}Challenges
          </Text>
          <Text
            tone="accent"
            weight="black"
            className="text-4xl"
            style={{
              textShadowColor: withAlpha(colors.primary.pink, 0.5),
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            {formatCount(totalCompleted)}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            size="xs"
            treatment="caption"
            tone="secondary"
            align="right"
            weight="bold"
            className="mb-3 text-[8px]"
            style={{ paddingRight: 1.6 }}
          >
            Weekly Streak
          </Text>
          <View className="-mx-4">
            <StreakGrid completedDates={completedDates} />
          </View>
        </View>
      </View>

      <View className="items-center">
        <Text
          size="sm"
          align="center"
          weight="medium"
          className="mb-4 text-foreground/70"
        >
          {completedToday
            ? 'Great job today! Want to do another one?'
            : 'Complete one micro challenge to start building your streak.'}
        </Text>
        <Button variant="secondary" size="xs" onPress={handlePress}>
          {hasActive
            ? 'Resume Challenge'
            : completedToday
              ? 'Take Another Challenge'
              : "Start Today's Challenge"}
        </Button>
      </View>
    </Card>
  );
}
