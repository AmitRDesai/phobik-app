import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';

import type { EFTPointEntry } from '../data/eftPoints';

function toHex(opacity: number) {
  return Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
}

export function EFTPointCard({ point }: { point: EFTPointEntry }) {
  const base =
    point.accent === 'primary' ? colors.primary.pink : colors.accent.yellow;
  const bgOpacity = point.strong ? 0.16 : 0.08;
  const borderOpacity = point.strong ? 0.35 : 0.12;
  const textOpacity = point.strong ? 1 : 0.7;

  return (
    <View className="rounded-2xl border border-white/5 bg-white/[0.04] p-5">
      <View className="flex-row items-start gap-4">
        <View
          className="h-10 w-10 items-center justify-center rounded-full border"
          style={{
            backgroundColor: `${base}${toHex(bgOpacity)}`,
            borderColor: `${base}${toHex(borderOpacity)}`,
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
          <Text className="text-base font-bold leading-tight text-white">
            {point.title}
          </Text>
          <Text
            className="mt-1.5 text-xs font-semibold italic"
            style={{ color: `${colors.accent.yellow}cc` }}
          >
            {point.meridian}
          </Text>
          <Text className="mt-1.5 text-sm leading-5 text-white/70">
            {point.description}
          </Text>
        </View>
      </View>
    </View>
  );
}
