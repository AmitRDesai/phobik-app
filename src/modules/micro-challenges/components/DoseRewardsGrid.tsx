import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { colors, withAlpha } from '@/constants/colors';

import type { DoseReward } from '@/modules/courage/data/mystery-challenges';

interface DoseRewardsGridProps {
  dose: DoseReward;
}

const DOSE_CONFIG = [
  {
    key: 'serotonin' as const,
    label: 'Serotonin',
    sub: 'Mood Stabilizer',
    color: '#60A5FA',
  },
  {
    key: 'oxytocin' as const,
    label: 'Oxytocin',
    sub: 'Social Safety',
    color: colors.primary.pink,
  },
  {
    key: 'dopamine' as const,
    label: 'Dopamine',
    sub: 'Reward Drive',
    color: colors.accent.yellow,
  },
  {
    key: 'endorphins' as const,
    label: 'Endorphins',
    sub: 'Pain Relief',
    color: '#86EFAC',
  },
];

export function DoseRewardsGrid({ dose }: DoseRewardsGridProps) {
  const active = DOSE_CONFIG.filter((d) => dose[d.key] > 0);

  if (active.length === 0) return null;

  return (
    <View>
      <Text variant="caption" muted className="mb-4">
        Daily D.O.S.E. Rewards
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {active.map((item) => (
          <Card
            key={item.key}
            variant="surface"
            className="flex-1 flex-row items-center gap-3"
            style={{ minWidth: '45%' }}
          >
            <IconChip
              size="md"
              shape="circle"
              bg={withAlpha(item.color, 0.08)}
              border={withAlpha(item.color, 0.2)}
            >
              <Text
                variant="xs"
                className="font-bold"
                style={{ color: item.color }}
              >
                +{dose[item.key]}
              </Text>
            </IconChip>
            <View>
              <Text variant="caption" muted>
                {item.label}
              </Text>
              <Text variant="xs" className="text-foreground/70">
                {item.sub}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
