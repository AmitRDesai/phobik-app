import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { useLastNightRestingHr } from '@/modules/insights/hooks/useSleepHistory';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { CenterScoreCircle } from '../components/CenterScoreCircle';
import { ChemicalPetal } from '../components/ChemicalPetal';
import { DayNavigator } from '../components/DayNavigator';
import { DoseActionRow } from '../components/DoseActionRow';
import { EnergyMetricCard } from '../components/EnergyMetricCard';
import { NextBestBoostCard } from '../components/NextBestBoostCard';
import { ScientificInsightCard } from '../components/ScientificInsightCard';
import { useDoseScore } from '../hooks/useDoseScore';
import { useSelectedDashboardDate } from '../hooks/useSelectedDashboardDate';
import { useSleepScoreForDate } from '../hooks/useSleepScoreForDate';
import { CHEMICAL_META, type Chemical } from '../lib/dose-copy';

type ChemicalRender = {
  chemical: Chemical;
  pillarLabel: string;
  chemicalLabel: string;
  color: string;
  icon: 'bolt' | 'auto-awesome' | 'wb-sunny' | 'favorite';
};

const CHEMICAL_RENDER: Record<Chemical, ChemicalRender> = {
  endorphins: {
    chemical: 'endorphins',
    pillarLabel: 'BODY',
    chemicalLabel: 'Endorphins',
    color: colors.primary.pink,
    icon: 'bolt',
  },
  dopamine: {
    chemical: 'dopamine',
    pillarLabel: 'MIND',
    chemicalLabel: 'Dopamine',
    color: colors.accent.orange,
    icon: 'auto-awesome',
  },
  serotonin: {
    chemical: 'serotonin',
    pillarLabel: 'EMOTION',
    chemicalLabel: 'Serotonin',
    color: colors.accent.yellow,
    icon: 'wb-sunny',
  },
  oxytocin: {
    chemical: 'oxytocin',
    pillarLabel: 'CONNECTION',
    chemicalLabel: 'Oxytocin',
    color: colors.primary['pink-dark'],
    icon: 'favorite',
  },
};

function statusFor(score: number): 'check' | 'critical' | 'neutral' {
  if (score >= 20) return 'check';
  if (score < 10) return 'critical';
  return 'neutral';
}

export default function EnergyDetails() {
  const params = useLocalSearchParams<{ date?: string }>();
  const initialDate = typeof params.date === 'string' ? params.date : undefined;
  const { date, isToday, canGoForward, goBack, goForward } =
    useSelectedDashboardDate(initialDate);

  const dose = useDoseScore(date);
  const { score: sleepScore, session: sleepSession } =
    useSleepScoreForDate(date);
  const restingHr = useLastNightRestingHr(
    sleepSession?.startTime ?? null,
    sleepSession?.endTime ?? null,
  );

  const lowestRender = CHEMICAL_RENDER[dose.lowest];
  const insight = CHEMICAL_META[dose.lowest].insight;

  const orderedChemicals: Chemical[] = useMemo(
    () => ['endorphins', 'dopamine', 'serotonin', 'oxytocin'],
    [],
  );

  return (
    <Screen
      scroll
      header={<Header variant="back" title="Synrgy Score" />}
      className="px-4 pt-2"
      contentClassName="gap-6 pb-4"
    >
      <DayNavigator
        date={date}
        isToday={isToday}
        canGoForward={canGoForward}
        onBack={goBack}
        onForward={goForward}
      />

      <View className="items-center gap-3">
        <View className="relative w-full">
          <View className="gap-y-16">
            <View className="flex-row gap-3">
              {(['endorphins', 'dopamine'] as const).map((c, i) => {
                const r = CHEMICAL_RENDER[c];
                return (
                  <ChemicalPetal
                    key={c}
                    pillarLabel={r.pillarLabel}
                    chemicalLabel={r.chemicalLabel}
                    score={dose[c]}
                    color={r.color}
                    icon={r.icon}
                    isLowest={dose.lowest === c}
                    shape={i === 0 ? 'tl' : 'tr'}
                  />
                );
              })}
            </View>
            <View className="flex-row gap-3">
              {(['serotonin', 'oxytocin'] as const).map((c, i) => {
                const r = CHEMICAL_RENDER[c];
                return (
                  <ChemicalPetal
                    key={c}
                    pillarLabel={r.pillarLabel}
                    chemicalLabel={r.chemicalLabel}
                    score={dose[c]}
                    color={r.color}
                    icon={r.icon}
                    isLowest={dose.lowest === c}
                    shape={i === 0 ? 'bl' : 'br'}
                  />
                );
              })}
            </View>
          </View>

          <View
            pointerEvents="none"
            className="absolute inset-0 items-center justify-center"
          >
            <CenterScoreCircle total={dose.total} level={dose.level} />
          </View>
        </View>

        <Text size="sm" align="center" weight="medium" tone="secondary">
          {insight}
        </Text>
      </View>

      <NextBestBoostCard
        lowest={dose.lowest}
        color={lowestRender.color}
        icon={lowestRender.icon}
      />

      <View className="gap-3">
        <View className="flex-row items-baseline">
          <Text size="h2">Daily </Text>
          <GradientText className="text-[22px] font-bold leading-[28px]">
            D.O.S.E.
          </GradientText>
        </View>
        <Text size="sm" tone="secondary">
          Your brain needs this right now. Micro-actions to balance your
          chemistry.
        </Text>
        {orderedChemicals.map((c) => {
          const r = CHEMICAL_RENDER[c];
          return (
            <DoseActionRow
              key={c}
              label={r.chemicalLabel}
              score={dose[c]}
              color={r.color}
              icon={r.icon}
              status={statusFor(dose[c])}
            />
          );
        })}
      </View>

      <ScientificInsightCard lowest={dose.lowest} />

      <View className="flex-row gap-3">
        <EnergyMetricCard
          label="Resting HR"
          value={restingHr != null ? `${restingHr} BPM` : '—'}
          icon="favorite"
          color={colors.primary.pink}
        />
        <EnergyMetricCard
          label="Sleep Quality"
          value={sleepScore != null ? `${sleepScore}%` : '—'}
          icon="bedtime"
          color={colors.accent.orange}
        />
      </View>
    </Screen>
  );
}
