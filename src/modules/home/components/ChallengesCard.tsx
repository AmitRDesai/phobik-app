import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import {
  formatCount,
  useActiveChallenge,
  useMicroChallengeStats,
} from '@/modules/micro-challenges/hooks/useMicroChallenge';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { StreakGrid } from './StreakGrid';

export function ChallengesCard() {
  const scheme = useScheme();
  const router = useRouter();
  const { challenge: activeChallenge } = useActiveChallenge();
  const { totalCompleted, completedToday, completedDates } =
    useMicroChallengeStats();

  const hasActive = !!activeChallenge;

  const handlePress = () => {
    router.push('/practices/micro-challenges');
  };

  return (
    <DashboardCard glow className="p-5">
      <View className="mb-5 flex-row gap-4">
        <View className="justify-center border-r border-foreground/10 pr-4">
          <Text
            variant="caption"
            muted
            className="mb-1 text-[9px] font-bold leading-tight"
            style={{ paddingRight: 1.8 }}
          >
            Total{'\n'}Challenges
          </Text>
          <Text
            className="text-4xl font-black text-primary-pink"
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
            variant="caption"
            muted
            className="mb-3 text-right text-[8px] font-bold"
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
          variant="sm"
          className="mb-4 text-center font-medium text-foreground/70"
        >
          {completedToday
            ? 'Great job today! Want to do another one?'
            : 'Complete one micro challenge to start building your streak.'}
        </Text>
        <Pressable
          onPress={handlePress}
          className="w-full items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 px-6 py-3.5 active:scale-[0.98]"
        >
          <Text
            variant="sm"
            className="font-bold uppercase tracking-wide"
            style={{ color: accentFor(scheme, 'yellow') }}
          >
            {hasActive
              ? 'Resume Challenge'
              : completedToday
                ? 'Take Another Challenge'
                : "Start Today's Challenge"}
          </Text>
        </Pressable>
      </View>
    </DashboardCard>
  );
}
