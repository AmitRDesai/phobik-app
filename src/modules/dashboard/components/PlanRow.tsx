import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

interface PlanRowProps {
  title: string;
  eyebrow: string;
  image: number;
  route: Href;
  accentColor?: string;
}

/**
 * Compact horizontal practice card. Image bleeds to the card's left, top,
 * and bottom edges (no inner padding) — the rest of the card has interior
 * padding for the text + play CTA.
 */
export function PlanRow({
  title,
  eyebrow,
  image,
  route,
  accentColor,
}: PlanRowProps) {
  const router = useRouter();
  const scheme = useScheme();
  const fg = foregroundFor(scheme, 0.7);

  return (
    <Pressable
      onPress={() => router.push(route)}
      className="h-24 flex-row items-stretch overflow-hidden rounded-3xl border border-foreground/[0.08] bg-surface-elevated active:scale-[0.98]"
    >
      <View className="h-full w-24 overflow-hidden">
        <Image
          source={image}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View className="flex-1 justify-center px-4">
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          style={{ color: accentColor }}
        >
          {eyebrow}
        </Text>
        <Text size="h3" weight="bold" className="mt-1" allowFontScaling={false}>
          {title}
        </Text>
      </View>
      <View className="mr-3 items-center justify-center">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-foreground/5">
          <MaterialIcons name="play-arrow" size={20} color={fg} />
        </View>
      </View>
    </Pressable>
  );
}
