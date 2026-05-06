import { accentFor, type AccentHue, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type Tone = 'pink' | 'yellow' | 'orange';

const TONE_HUE: Record<Tone, AccentHue> = {
  pink: 'pink',
  yellow: 'yellow',
  orange: 'orange',
};

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  tone?: Tone;
};

export function BenefitCard({
  icon,
  title,
  description,
  tone = 'pink',
}: Props) {
  const scheme = useScheme();
  const accent = accentFor(scheme, TONE_HUE[tone]);
  return (
    <View
      className="rounded-3xl border bg-foreground/[0.04] p-5"
      style={{ borderColor: withAlpha(accent, 0.2) }}
    >
      <View
        className="mb-4 h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: withAlpha(accent, 0.12) }}
      >
        <MaterialIcons name={icon} size={22} color={accent} />
      </View>
      <Text className="text-lg font-bold text-foreground">{title}</Text>
      {description ? (
        <Text className="mt-1.5 text-[13px] leading-5 text-foreground/60">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
