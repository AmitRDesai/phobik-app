import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { withAlpha } from '@/constants/colors';
import { CHEMICAL_COLORS } from '@/constants/dose-chemicals';

import type { DoseReward } from '@/modules/courage/data/mystery-challenges';

interface DoseRewardsGridProps {
  dose: DoseReward;
}

const DOSE_CONFIG = [
  {
    key: 'serotonin' as const,
    label: 'Serotonin',
    sub: 'Mood Stabilizer',
    color: CHEMICAL_COLORS.serotonin,
  },
  {
    key: 'oxytocin' as const,
    label: 'Oxytocin',
    sub: 'Social Safety',
    color: CHEMICAL_COLORS.oxytocin,
  },
  {
    key: 'dopamine' as const,
    label: 'Dopamine',
    sub: 'Reward Drive',
    color: CHEMICAL_COLORS.dopamine,
  },
  {
    key: 'endorphins' as const,
    label: 'Endorphins',
    sub: 'Pain Relief',
    color: CHEMICAL_COLORS.endorphins,
  },
];

export function DoseRewardsGrid({ dose }: DoseRewardsGridProps) {
  const active = DOSE_CONFIG.filter((d) => dose[d.key] > 0);

  if (active.length === 0) return null;

  return (
    <View>
      <Text size="xs" treatment="caption" tone="secondary" className="mb-4">
        Daily D.O.S.E. Rewards
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {active.map((item) => (
          <Card
            key={item.key}
            variant="flat"
            className="flex-1 flex-row items-center gap-3"
            style={{ minWidth: '45%' }}
          >
            <IconChip
              size="md"
              shape="circle"
              bg={withAlpha(item.color, 0.08)}
              border={withAlpha(item.color, 0.2)}
            >
              <Text size="xs" weight="bold" style={{ color: item.color }}>
                +{dose[item.key]}
              </Text>
            </IconChip>
            <View>
              <Text size="xs" treatment="caption" tone="secondary">
                {item.label}
              </Text>
              <Text size="xs" className="text-foreground/70">
                {item.sub}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
