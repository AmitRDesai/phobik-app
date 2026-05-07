import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import type { AccentHue } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

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
      <Text variant="h3" className="font-bold">
        {title}
      </Text>
      {description ? (
        <Text variant="sm" muted className="mt-1.5 leading-5">
          {description}
        </Text>
      ) : null}
    </Card>
  );
}
