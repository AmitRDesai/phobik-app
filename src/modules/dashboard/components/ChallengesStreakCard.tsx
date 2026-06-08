import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { StreakGrid } from '@/modules/home/components/StreakGrid';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useChallengeStats } from '../hooks/useChallengeStats';

export function ChallengesStreakCard() {
  const router = useRouter();
  const { total, completedDates } = useChallengeStats();

  return (
    <Card variant="raised" size="md" className="gap-4">
      <View className="flex-row items-start gap-1">
        <View className="gap-1">
          <Text size="xs" treatment="caption" tone="secondary">
            Total{'\n'}Challenges
          </Text>
          <GradientText className="text-[32px] font-black leading-[36px]">
            {String(total)}
          </GradientText>
        </View>
        <View className="flex-1 gap-1.5">
          <Text size="xs" treatment="caption" tone="secondary" align="right">
            Weekly Streak
          </Text>
          {/* Horizontal scroll when the 7 day-cells exceed the column width */}
          <View className="-mr-4">
            <StreakGrid completedDates={completedDates} />
          </View>
        </View>
      </View>

      <Button
        variant="primary"
        prefixIcon={<Ionicons name="refresh" size={18} color="white" />}
        onPress={() => router.push('/practices/micro-challenges')}
        fullWidth
      >
        Daily Challenge
      </Button>
    </Card>
  );
}
