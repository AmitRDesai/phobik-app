import { Text } from '@/components/themed/Text';
import { DashboardCard } from '@/components/ui/DashboardCard';
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
    <DashboardCard className="flex-1 items-center">
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
      <Text variant="h2" className="mt-5 text-center font-bold">
        Sleep Score
      </Text>
      <Text variant="sm" className="mt-1 text-center text-foreground/55">
        {hours != null && mins != null ? `${hours}h ${mins}m total` : 'No data'}
      </Text>
    </DashboardCard>
  );
}
