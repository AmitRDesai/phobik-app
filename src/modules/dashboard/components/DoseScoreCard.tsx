import { Text } from '@/components/themed/Text';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { GlowBg } from '@/components/ui/GlowBg';
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
    <DashboardCard
      glow
      onPress={() => router.push({ pathname: '/energy', params: { date } })}
      className="flex-1 items-center"
    >
      <GlowBg
        centerX={0.5}
        centerY={0}
        intensity={0.8}
        radius={0.5}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        bgClassName="bg-transparent"
      />
      <ScoreRing
        value={total}
        gradient="pink-yellow"
        size={144}
        caption={level.label.toUpperCase()}
      />
      <Text size="h2" align="center" className="mt-5">
        Synrgy Score
      </Text>
      <Text size="sm" align="center" tone="secondary" className="mt-1">
        {level.message}
      </Text>
    </DashboardCard>
  );
}
