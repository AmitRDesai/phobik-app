import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { ScoreRing } from '@/modules/dashboard/components/ScoreRing';
import { hasConnectedHealthAtom } from '@/modules/home/store/health-connection';
import { useSleepHistory } from '@/modules/insights/hooks/useSleepHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { useAtomValue } from 'jotai';

function scoreLabel(score: number | null): string {
  if (score == null) return 'No data';
  if (score >= 80) return 'Restorative Sleep';
  if (score >= 60) return 'Solid Sleep';
  if (score >= 40) return 'Mixed Sleep';
  return 'Disrupted Sleep';
}

function scoreSubtitle(score: number | null, hasConnected: boolean): string {
  if (score == null) {
    return hasConnected
      ? 'Wear your device overnight to see a score'
      : 'Connect Apple Health or Health Connect';
  }
  if (score >= 80) return 'Your body recovered efficiently last night';
  if (score >= 60) return 'A balanced night — room to optimize stages';
  if (score >= 40) return 'Some recovery — duration or efficiency was off';
  return 'Recovery was limited — try a wind-down practice tonight';
}

export function SleepScoreHeader() {
  const range = useAtomValue(timeRangeAtom);
  const hasConnectedHealth = useAtomValue(hasConnectedHealthAtom);
  const { lastNightScore } = useSleepHistory(range);

  return (
    <View className="items-center pt-4">
      <ScoreRing
        value={lastNightScore}
        gradient="yellow-pink"
        size={176}
        strokeWidth={14}
        caption="LAST NIGHT"
      />
      <Text size="h2" align="center" className="mt-5">
        {scoreLabel(lastNightScore)}
      </Text>
      <Text
        size="sm"
        tone="secondary"
        align="center"
        className="mt-1 max-w-[300px]"
      >
        {scoreSubtitle(lastNightScore, hasConnectedHealth)}
      </Text>
    </View>
  );
}
