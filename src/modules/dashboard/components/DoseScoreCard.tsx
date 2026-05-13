import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useDoseScore } from '../hooks/useDoseScore';
import { ScoreRing } from './ScoreRing';

interface DoseScoreCardProps {
  date: string;
}

export function DoseScoreCard({ date }: DoseScoreCardProps) {
  const router = useRouter();
  const { total, level } = useDoseScore(date);

  return (
    <Card
      variant="raised"
      size="md"
      shadow={{
        color: colors.primary.pink,
        opacity: 0.1,
        blur: 24,
        offsetY: 8,
      }}
      onPress={() => router.push({ pathname: '/energy', params: { date } })}
      className="flex-1 items-center"
    >
      <ScoreRing
        value={total}
        gradient="pink-yellow"
        size={112}
        strokeWidth={10}
        caption={level.label.toUpperCase()}
      />
      <Text size="h3" align="center" className="mt-3">
        Synrgy Score
      </Text>
    </Card>
  );
}
