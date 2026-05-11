import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors, withAlpha } from '@/constants/colors';
import type { DoseLevelMeta } from '../lib/dose-copy';

interface CenterScoreCircleProps {
  total: number;
  level: DoseLevelMeta;
  size?: number;
}

export function CenterScoreCircle({
  total,
  level,
  size = 180,
}: CenterScoreCircleProps) {
  return (
    <View
      className="items-center justify-center rounded-full border border-foreground/15 bg-surface-elevated"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 50px ${withAlpha(colors.primary.pink, 0.35)}`,
      }}
    >
      <Text
        tone="secondary"
        weight="semibold"
        className="text-[9px] uppercase tracking-[0.25em]"
        style={{ marginBottom: -2 }}
      >
        SYNRGY SCORE
      </Text>
      <Text
        weight="black"
        className="text-6xl leading-[64px]"
        allowFontScaling={false}
      >
        {total}
      </Text>
      <Text
        size="xs"
        weight="bold"
        className="mt-1 tracking-widest text-foreground/50"
      >
        of 100 today
      </Text>
      <Text
        size="xs"
        treatment="caption"
        tone="accent"
        weight="bold"
        className="mt-2 uppercase tracking-widest"
      >
        {level.label}
      </Text>
    </View>
  );
}
