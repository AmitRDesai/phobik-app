import { View } from '@/components/themed/View';

import { PillarDetailScaffold } from '../components/PillarDetailScaffold';
import { PillarMetricCard } from '../components/PillarMetricCard';
import { PILLARS, PILLAR_STATUS_LINES } from '../data/pillars';
import { useRecoveryScore } from '../hooks/useRecoveryScore';
import { useRhythmTrend } from '../hooks/useRhythmTrend';
import { trendDeltaLabel } from '../lib/scoring';

function formatDuration(totalMinutes: number | null): string {
  if (totalMinutes == null || totalMinutes <= 0) return '—';
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${h}h ${m}m`;
}

export default function RecoveryDetail() {
  const pillar = PILLARS.recovery;
  const { score, sleepQuality, consistency, totalMinutes } = useRecoveryScore();
  const trend = useRhythmTrend('7D');
  const values = trend.points.map((p) => p.value);

  const sleepOptimal =
    totalMinutes != null && totalMinutes >= 420 && totalMinutes <= 540;

  return (
    <PillarDetailScaffold
      pillar={pillar}
      score={score}
      statusLine={PILLAR_STATUS_LINES.recovery(score)}
      trendValues={values}
      trendTitle="7-Day Recovery"
      trendDelta={trendDeltaLabel(values)}
      trendEmptyLabel="Log a few nights to see your recovery trend"
    >
      <View className="gap-3">
        <PillarMetricCard
          icon="moon"
          tone="gold"
          label="Sleep Duration"
          value={formatDuration(totalMinutes)}
          status={sleepOptimal ? 'Optimal' : undefined}
          note="Range: 7-9h"
        />
        <PillarMetricCard
          icon="sparkles"
          tone="pink"
          label="Sleep Quality"
          value={sleepQuality != null ? sleepQuality.toFixed(0) : '—'}
          unit="%"
          note="REM efficiency"
        />
        <PillarMetricCard
          icon="calendar"
          tone="cyan"
          label="Consistency"
          value={consistency != null ? consistency.toFixed(0) : '—'}
          unit="%"
          note="Regular bedtime"
        />
      </View>
    </PillarDetailScaffold>
  );
}
