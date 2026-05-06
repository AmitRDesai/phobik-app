import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';

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
      <Text className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground/60">
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
              bg={`${item.color}15`}
              border={`${item.color}30`}
            >
              <Text className="text-xs font-bold" style={{ color: item.color }}>
                +{dose[item.key]}
              </Text>
            </IconChip>
            <View>
              <Text className="text-[10px] font-bold uppercase tracking-tight text-foreground/55">
                {item.label}
              </Text>
              <Text className="text-xs text-foreground/70">{item.sub}</Text>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
