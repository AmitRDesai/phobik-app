import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { accentFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import type { EFTPointEntry } from '../data/eftPoints';

export function EFTPointCard({ point }: { point: EFTPointEntry }) {
  const scheme = useScheme();
  const tone = point.accent === 'primary' ? 'pink' : 'yellow';
  const base = accentFor(scheme, tone);
  const textOpacity = point.strong ? 1 : 0.7;

  return (
    <Card variant="default">
      <View className="flex-row items-start gap-4">
        <IconChip size="md" shape="circle" tone={tone}>
          <Text
            size="sm"
            weight="bold"
            style={{ color: base, opacity: textOpacity }}
          >
            {point.number}
          </Text>
        </IconChip>
        <View className="flex-1">
          <Text size="lg" weight="bold" className="leading-tight">
            {point.title}
          </Text>
          <Text
            size="xs"
            treatment="caption"
            className="mt-1.5"
            style={{
              color: withAlpha(accentFor(scheme, 'yellow'), 0.8),
              paddingRight: 1.1,
            }}
          >
            {point.meridian}
          </Text>
          <Text size="sm" className="mt-1.5 leading-5 text-foreground/70">
            {point.description}
          </Text>
        </View>
      </View>
    </Card>
  );
}
