import { colors } from '@/constants/colors';
import {
  formatCount,
  useActiveChallenge,
  useMicroChallengeStats,
} from '@/modules/micro-challenges/hooks/useMicroChallenge';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { DashboardCard } from '@/components/ui/DashboardCard';
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
    <DashboardCard glow className="p-5">
      {/* Top row: total challenges + streak grid */}
      <View className="mb-5 flex-row gap-4">
        {/* Left: total count */}
        <View className="justify-center border-r border-white/10 pr-4">
          <Text className="mb-1 text-[9px] font-bold uppercase leading-tight tracking-widest text-slate-400">
            Total{'\n'}Challenges
          </Text>
          <Text
            className="text-4xl font-black text-primary-pink"
            style={{
              textShadowColor: `${colors.primary.pink}80`,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            {formatCount(totalCompleted)}
          </Text>
        </View>

        {/* Right: weekly streak */}
        <View className="flex-1">
          <Text className="mb-3 text-right text-[8px] font-bold uppercase tracking-widest text-slate-400">
            Weekly Streak
          </Text>
          <View className="-mx-4">
            <StreakGrid completedDates={completedDates} />
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View className="items-center">
        <Text className="mb-4 text-center text-sm font-medium text-white/70">
          {completedToday
            ? 'Great job today! Want to do another one?'
            : 'Complete one micro challenge to start building your streak.'}
        </Text>
        <Pressable
          onPress={handlePress}
          className="w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3.5 active:scale-[0.98]"
        >
          <Text className="text-sm font-bold uppercase tracking-wide text-accent-yellow">
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
