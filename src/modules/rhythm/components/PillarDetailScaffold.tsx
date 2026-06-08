import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { ScoreRing } from '@/modules/dashboard/components/ScoreRing';
import type { ReactNode } from 'react';

import type { PillarMeta } from '../data/pillars';
import { ScienceCard } from './ScienceCard';
import { TrendChart } from './TrendChart';

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface PillarDetailScaffoldProps {
  pillar: PillarMeta;
  score: number | null;
  /** One-line interpretation under the ring. */
  statusLine: string;
  /** Metric tiles / cards specific to the pillar. */
  children?: ReactNode;
  /** Trend series values (pillar-specific). */
  trendValues: number[];
  /** Heading above the trend chart, e.g. "7-Day HRV Trend". */
  trendTitle: string;
  /** Optional right-aligned delta note, e.g. "+12% vs last week". */
  trendDelta?: string;
  trendEmptyLabel?: string;
}

/**
 * Shared chrome for the four pillar detail screens: back header + gradient
 * title + weight, hero ScoreRing, status line, pillar-specific metrics,
 * science card, and a titled trend chart.
 */
export function PillarDetailScaffold({
  pillar,
  score,
  statusLine,
  children,
  trendValues,
  trendTitle,
  trendDelta,
  trendEmptyLabel,
}: PillarDetailScaffoldProps) {
  return (
    <Screen
      header={<Header variant="back" />}
      scroll
      className="px-screen-x pt-2"
      contentClassName="gap-6 pb-8"
    >
      <View className="items-center gap-1">
        <GradientText className="text-center text-[30px] font-extrabold leading-[36px]">
          {pillar.title}
        </GradientText>
        <Text size="xs" treatment="caption" tone="secondary">
          {Math.round(pillar.weight * 100)}% of My Rhythm Score
        </Text>
      </View>

      <View className="items-center">
        <ScoreRing
          value={score}
          gradient={pillar.gradient}
          size={180}
          strokeWidth={14}
          caption={pillar.label.toUpperCase()}
        />
      </View>

      <Text size="sm" tone="secondary" align="center">
        {statusLine}
      </Text>

      {children}

      <ScienceCard
        title={pillar.scienceTitle}
        body={pillar.science}
        tone={pillar.tone}
      />

      <View className="gap-3">
        <View className="flex-row items-baseline justify-between">
          <Text size="md" weight="bold">
            {trendTitle}
          </Text>
          {trendDelta ? (
            <Text
              size="xs"
              weight="bold"
              style={{ color: colors.status.success }}
            >
              {trendDelta}
            </Text>
          ) : null}
        </View>
        <TrendChart
          values={trendValues}
          tone={pillar.tone}
          labels={WEEKDAY_LABELS}
          emptyLabel={trendEmptyLabel ?? 'Not enough data yet'}
        />
      </View>
    </Screen>
  );
}
