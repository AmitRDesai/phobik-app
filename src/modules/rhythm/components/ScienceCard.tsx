import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import type { AccentHue } from '@/constants/colors';

interface ScienceCardProps {
  title: string;
  body: string;
  tone?: AccentHue;
}

/** Educational "Science of…" callout used on each pillar detail screen. */
export function ScienceCard({ title, body, tone = 'pink' }: ScienceCardProps) {
  return (
    <Card variant="toned" tone={tone} size="md" className="gap-2">
      <Text size="sm" treatment="caption" weight="bold" tone="accent">
        {title}
      </Text>
      <Text size="sm" tone="body">
        {body}
      </Text>
    </Card>
  );
}
