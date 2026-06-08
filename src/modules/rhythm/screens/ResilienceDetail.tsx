import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { SelectionCard } from '@/components/ui/SelectionCard';

import { PillarDetailScaffold } from '../components/PillarDetailScaffold';
import {
  PILLARS,
  PILLAR_STATUS_LINES,
  RESILIENCE_OPTIONS,
} from '../data/pillars';
import {
  useResilienceScore,
  useSaveResilienceCheckIn,
} from '../hooks/useResilienceScore';

export default function ResilienceDetail() {
  const pillar = PILLARS.resilience;
  const { score, index } = useResilienceScore();
  const saveCheckIn = useSaveResilienceCheckIn();

  return (
    <PillarDetailScaffold
      pillar={pillar}
      score={score}
      statusLine={PILLAR_STATUS_LINES.resilience(score)}
      trendValues={[]}
      trendTitle="Capability Trend"
      trendEmptyLabel="Check in daily to see your capability trend"
    >
      <Card variant="raised" size="md" className="gap-3">
        <Text size="h3" weight="bold">
          Daily Check-in
        </Text>
        <Text size="sm" tone="secondary">
          How capable do you feel of handling today&apos;s challenges?
        </Text>
        <View className="mt-1 gap-2">
          {RESILIENCE_OPTIONS.map((label, i) => (
            <SelectionCard
              key={label}
              variant="radio"
              label={label}
              selected={index === i}
              onPress={() => saveCheckIn.mutate(i)}
            />
          ))}
        </View>
      </Card>
    </PillarDetailScaffold>
  );
}
