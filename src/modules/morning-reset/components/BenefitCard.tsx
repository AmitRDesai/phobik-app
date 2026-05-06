import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import type { AccentHue } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/themed/Text';

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
  const hue = TONE_HUE[tone];
  return (
    <Card variant="toned" tone={hue}>
      <IconChip size="lg" shape="rounded" tone={hue} className="mb-4">
        {(color) => <MaterialIcons name={icon} size={22} color={color} />}
      </IconChip>
      <Text className="text-lg font-bold text-foreground">{title}</Text>
      {description ? (
        <Text className="mt-1.5 text-[13px] leading-5 text-foreground/60">
          {description}
        </Text>
      ) : null}
    </Card>
  );
}
