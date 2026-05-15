import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useSleepScoreForDate } from '../hooks/useSleepScoreForDate';
import { ScoreRing } from './ScoreRing';

interface SleepScoreCardProps {
  date: string;
}

export function SleepScoreCard({ date }: SleepScoreCardProps) {
  const router = useRouter();
  const { score, session } = useSleepScoreForDate(date);

  const totalMinutes = session?.totalMinutes ?? null;
  const hours = totalMinutes != null ? Math.floor(totalMinutes / 60) : null;
  const mins = totalMinutes != null ? Math.round(totalMinutes % 60) : null;

  return (
    <Card
      variant="raised"
      size="md"
      shadow={{
        color: colors.accent.yellow,
        opacity: 0.1,
        blur: 24,
        offsetY: 8,
      }}
      onPress={() => router.push('/insights/sleep-quality')}
      className="flex-1 items-center"
    >
      <ScoreRing
        value={score}
        gradient="yellow-pink"
        size={160}
        strokeWidth={14}
        caption={
          score == null
            ? 'No data'
            : score >= 75
              ? 'Deep Rest'
              : score >= 50
                ? 'Restored'
                : 'Light Rest'
        }
      />
      <Text size="h3" align="center" className="mt-3">
        Sleep Score
      </Text>
      <Text size="xs" align="center" tone="secondary" className="mt-0.5">
        {hours != null && mins != null ? `${hours}h ${mins}m total` : 'No data'}
      </Text>
    </Card>
  );
}
