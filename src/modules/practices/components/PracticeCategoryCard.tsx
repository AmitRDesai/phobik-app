import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { IconChip } from '@/components/ui/IconChip';
import { accentFor, colors, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { Pressable } from 'react-native';

type PracticeCategoryCardProps = {
  image: ImageSource | number;
  /** Single-word category name (e.g. "BODY"). */
  label: string;
  tagline: string;
  /** Preview list of practices shown as bullets. */
  practices: string[];
  icon: keyof typeof MaterialIcons.glyphMap;
  /** Accent color (one of the brand hues) — drives the icon + bullet tint. */
  accentColor: string;
  onPress: () => void;
};

export function PracticeCategoryCard({
  image,
  label,
  tagline,
  practices,
  icon,
  accentColor,
  onPress,
}: PracticeCategoryCardProps) {
  const scheme = useScheme();
  const tone: AccentHue =
    accentColor === colors.primary.pink ? 'pink' : 'yellow';
  const dotColor = accentFor(scheme, tone);
  // Rich tint over the near-black dark surface; very faint over the white
  // light surface so the themed (dark) text keeps its contrast.
  const imageOpacity = scheme === 'dark' ? 0.32 : 0.12;

  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-surface-elevated">
        <Image
          source={image}
          style={{ position: 'absolute', inset: 0, opacity: imageOpacity }}
          contentFit="cover"
        />
        <View className="relative p-6">
          <View className="mb-4 flex-row items-center gap-3">
            <IconChip size="lg" shape="rounded" tone={tone}>
              {(color) => <MaterialIcons name={icon} size={26} color={color} />}
            </IconChip>
            <Text size="h3" weight="extrabold" className="uppercase">
              {label}
            </Text>
          </View>
          <Text size="sm" tone="secondary" className="mb-4">
            {tagline}
          </Text>
          <View className="gap-2">
            {practices.map((practice) => (
              <View key={practice} className="flex-row items-center gap-3">
                <View
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: dotColor }}
                />
                <Text size="sm" tone="body">
                  {practice}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
