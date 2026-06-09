import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ScoreRing } from '@/modules/dashboard/components/ScoreRing';
import { useState } from 'react';

import { useStartDailyFlow } from '@/modules/daily-flow/hooks/useDailyFlowSession';

import { PillarBreakdownRow } from '../components/PillarBreakdownRow';
import { PillarCard } from '../components/PillarCard';
import { TrendChart } from '../components/TrendChart';
import { PILLAR_LIST } from '../data/pillars';
import { useRhythmScore } from '../hooks/useRhythmScore';
import {
  TREND_RANGES,
  useRhythmTrend,
  type TrendRange,
} from '../hooks/useRhythmTrend';

const RANGE_OPTIONS = TREND_RANGES.map((r) => ({ label: r, value: r }));

export default function MyRhythm() {
  const [range, setRange] = useState<TrendRange>('7D');
  const { score, level, pillars } = useRhythmScore();
  const trend = useRhythmTrend(range);
  const { start, canResume } = useStartDailyFlow();

  return (
    <Screen
      header={<Header variant="back" title="My Rhythm" />}
      scroll
      contentClassName="gap-6 pb-8"
    >
      <View className="items-center gap-1">
        <SegmentedControl
          options={RANGE_OPTIONS}
          selected={range}
          onSelect={setRange}
          variant="tinted"
        />
      </View>

      <Card variant="raised" size="md" className="gap-4">
        <TrendChart
          values={trend.points.map((p) => p.value)}
          tone="pink"
          emptyLabel="Log a few days to see your rhythm trend"
        />
      </Card>

      <View className="items-center gap-3">
        <ScoreRing
          value={score}
          gradient="pink-yellow"
          size={180}
          strokeWidth={14}
          caption={level.label.toUpperCase()}
        />
        <AccentPill
          label={level.status}
          variant="tinted"
          tone="pink"
          size="md"
        />
      </View>

      <Button onPress={start} fullWidth>
        {canResume ? "Resume Today's Flow" : "Start Today's Daily Flow"}
      </Button>

      <View className="flex-row flex-wrap justify-between gap-3">
        {PILLAR_LIST.map((pillar) => (
          <View key={pillar.key} className="w-[48%]">
            <PillarCard pillar={pillar} score={pillars[pillar.key]} />
          </View>
        ))}
      </View>

      <View className="gap-3">
        <GradientText className="text-[20px] font-extrabold leading-[26px]">
          Scientific Breakdown
        </GradientText>
        {PILLAR_LIST.map((pillar) => (
          <PillarBreakdownRow
            key={pillar.key}
            pillar={pillar}
            score={pillars[pillar.key]}
          />
        ))}
      </View>
    </Screen>
  );
}
