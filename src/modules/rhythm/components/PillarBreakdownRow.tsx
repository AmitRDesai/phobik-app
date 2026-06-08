import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type { PillarMeta } from '../data/pillars';

interface PillarBreakdownRowProps {
  pillar: PillarMeta;
  score: number | null;
}

/** Scientific-breakdown row: icon + label + weight badge, summary, progress. */
export function PillarBreakdownRow({ pillar, score }: PillarBreakdownRowProps) {
  const scheme = useScheme();
  const router = useRouter();
  const color = accentFor(scheme, pillar.tone);

  return (
    <Card
      variant="flat"
      size="md"
      onPress={() => router.push(pillar.route)}
      accessibilityLabel={`${pillar.label}, ${pillar.weightLabel}`}
      className="gap-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Ionicons name={pillar.icon} size={18} color={color} />
          <Text size="md" weight="bold">
            {pillar.label}
          </Text>
        </View>
        <Badge variant="tinted" tone={pillar.tone} size="sm">
          {pillar.weightLabel}
        </Badge>
      </View>
      <Text size="sm" tone="secondary">
        {pillar.summary}
      </Text>
      <ProgressBar
        progress={score != null ? score / 100 : 0}
        gradient
        tone={pillar.tone}
        size="sm"
      />
    </Card>
  );
}
