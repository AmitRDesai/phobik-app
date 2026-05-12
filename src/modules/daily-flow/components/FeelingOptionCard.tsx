import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, Pressable } from 'react-native';

import type { FeelingContent } from '../data/feelings';

type Props = {
  feeling: FeelingContent;
  onPress: () => void;
};

const ACCENT_COLORS = {
  primary: colors.primary.pink,
  secondary: colors.accent.yellow,
  tertiary: colors.accent.purple,
} as const;

export function FeelingOptionCard({ feeling, onPress }: Props) {
  const accent = ACCENT_COLORS[feeling.accentToken];
  return (
    <Pressable
      onPress={onPress}
      className="h-[340px] overflow-hidden rounded-[32px] border border-foreground/5 bg-surface-elevated"
    >
      <Image
        source={feeling.image}
        className="absolute h-full w-full"
        resizeMode="cover"
      />
      <ImageScrim strength={0.95} start={0} />
      <View className="flex-1 p-7">
        <View
          className="size-14 items-center justify-center rounded-full"
          style={{ backgroundColor: withAlpha(accent, 0.2) }}
        >
          <MaterialIcons
            name={feeling.icon as keyof typeof MaterialIcons.glyphMap}
            size={26}
            color={accent}
          />
        </View>
        <View className="mt-auto">
          <Text size="h1" tone="inverse" weight="black">
            {feeling.label}
          </Text>
          <Text size="md" tone="inverse" className="mt-2 leading-6 /65">
            {feeling.description}
          </Text>
          <View className="mt-5 flex-row items-center gap-1.5">
            <Text
              size="xs"
              treatment="caption"
              weight="black"
              className="tracking-[0.25em]"
              style={{ color: accent, paddingRight: 2.75 }}
            >
              {feeling.ctaLabel}
            </Text>
            <MaterialIcons name="arrow-forward" size={14} color={accent} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
