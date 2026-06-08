import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type { PillarMeta } from '../data/pillars';

interface PillarCardProps {
  pillar: PillarMeta;
  score: number | null;
}

/** Compact tappable pillar tile (icon + score + label) for the My Rhythm grid. */
export function PillarCard({ pillar, score }: PillarCardProps) {
  const scheme = useScheme();
  const router = useRouter();
  const color = accentFor(scheme, pillar.tone);

  return (
    <Card
      variant="raised"
      size="sm"
      onPress={() => router.push(pillar.route)}
      accessibilityLabel={`${pillar.label} score ${score ?? 'no data'}`}
      className="w-full items-center gap-1 py-4"
    >
      <Ionicons name={pillar.icon} size={20} color={color} />
      <Text size="h3" weight="black" allowFontScaling={false}>
        {score ?? '—'}
      </Text>
      <Text size="xs" treatment="caption" tone="secondary">
        {pillar.label}
      </Text>
    </Card>
  );
}
