import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { accentFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
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
            className="text-sm font-bold"
            style={{ color: base, opacity: textOpacity }}
          >
            {point.number}
          </Text>
        </IconChip>
        <View className="flex-1">
          <Text className="text-base font-bold leading-tight text-foreground">
            {point.title}
          </Text>
          <Text
            className="mt-1.5 text-xs font-semibold italic"
            style={{ color: withAlpha(accentFor(scheme, 'yellow'), 0.8) }}
          >
            {point.meridian}
          </Text>
          <Text className="mt-1.5 text-sm leading-5 text-foreground/70">
            {point.description}
          </Text>
        </View>
      </View>
    </Card>
  );
}
