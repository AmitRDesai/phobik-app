import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Text, View } from 'react-native';

import type { EFTPointEntry } from '../data/eftPoints';

export function EFTPointCard({ point }: { point: EFTPointEntry }) {
  const scheme = useScheme();
  const base =
    point.accent === 'primary'
      ? accentFor(scheme, 'pink')
      : accentFor(scheme, 'yellow');
  const bgOpacity = point.strong ? 0.16 : 0.08;
  const borderOpacity = point.strong ? 0.35 : 0.12;
  const textOpacity = point.strong ? 1 : 0.7;

  return (
    <View className="rounded-2xl border border-foreground/5 bg-foreground/[0.04] p-5">
      <View className="flex-row items-start gap-4">
        <View
          className="h-10 w-10 items-center justify-center rounded-full border"
          style={{
            backgroundColor: withAlpha(base, bgOpacity),
            borderColor: withAlpha(base, borderOpacity),
          }}
        >
          <Text
            className="text-sm font-bold"
            style={{ color: base, opacity: textOpacity }}
          >
            {point.number}
          </Text>
        </View>
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
    </View>
  );
}
