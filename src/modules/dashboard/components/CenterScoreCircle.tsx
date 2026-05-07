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
        className="text-[9px] font-semibold uppercase tracking-[0.25em] text-foreground/55"
        style={{ marginBottom: -2 }}
      >
        SYNRGY SCORE
      </Text>
      <Text
        className="text-6xl font-black leading-[64px] text-foreground"
        allowFontScaling={false}
      >
        {total}
      </Text>
      <Text
        variant="xs"
        className="mt-1 font-bold tracking-widest text-foreground/50"
      >
        of 100 today
      </Text>
      <Text
        variant="caption"
        className="mt-2 font-bold uppercase tracking-widest text-primary-pink"
      >
        {level.label}
      </Text>
    </View>
  );
}
