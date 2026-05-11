import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import { useSleepScoreForDate } from '../hooks/useSleepScoreForDate';
import { ScoreRing } from './ScoreRing';

interface SleepScoreCardProps {
  date: string;
}

export function SleepScoreCard({ date }: SleepScoreCardProps) {
  const { score, session } = useSleepScoreForDate(date);

  const totalMinutes = session?.totalMinutes ?? null;
  const hours = totalMinutes != null ? Math.floor(totalMinutes / 60) : null;
  const mins = totalMinutes != null ? Math.round(totalMinutes % 60) : null;

  return (
    <Card variant="raised" size="lg" className="flex-1 items-center">
      <ScoreRing
        value={score}
        gradient="yellow-pink"
        size={144}
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
      <Text size="h2" align="center" className="mt-5">
        Sleep Score
      </Text>
      <Text size="sm" align="center" tone="secondary" className="mt-1">
        {hours != null && mins != null ? `${hours}h ${mins}m total` : 'No data'}
      </Text>
    </Card>
  );
}
