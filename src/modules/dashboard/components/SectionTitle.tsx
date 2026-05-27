import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import type { ReactNode } from 'react';

interface SectionTitleProps {
  /** Plain "My" prefix word, rendered in foreground. */
  prefix: string;
  /** Gradient-masked accent word ("Rhythm", "Journey", "Vibe"). */
  accent: string;
  /** Optional eyebrow caption rendered right-aligned on the same baseline. */
  eyebrow?: ReactNode;
}

export function SectionTitle({ prefix, accent, eyebrow }: SectionTitleProps) {
  return (
    <View className="flex-row items-baseline justify-between">
      <View className="flex-row items-baseline">
        <Text size="h1">{prefix} </Text>
        <GradientText className="text-[28px] font-bold leading-[34px]">
          {accent}
        </GradientText>
      </View>
      {eyebrow}
    </View>
  );
}
