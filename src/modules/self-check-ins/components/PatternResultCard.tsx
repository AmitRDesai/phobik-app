import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import type { PatternArchetype } from '../data/pivot-point-patterns';

interface PatternResultCardProps {
  archetype: PatternArchetype;
  isPrimary?: boolean;
}

export function PatternResultCard({
  archetype,
  isPrimary,
}: PatternResultCardProps) {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');

  if (!isPrimary) {
    return (
      <Card variant="flat" className="p-5">
        <Text size="lg" weight="bold" className="mb-2">
          {archetype.emoji} {archetype.label}
        </Text>
        <Text size="sm" tone="secondary">
          {archetype.tagline}
        </Text>
      </Card>
    );
  }

  return (
    <LinearGradient
      colors={[colors.primary.pink, colors.accent.yellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 16, padding: 1.5 }}
    >
      <View className="rounded-2xl bg-surface p-6">
        <Badge tone="pink" size="sm" className="mb-3 self-start">
          Primary Pattern
        </Badge>

        <Text className="mb-2 text-4xl">{archetype.emoji}</Text>
        <Text size="h2" className="mb-3">
          {archetype.label}
        </Text>
        <Text size="sm" tone="secondary" className="mb-5">
          {archetype.tagline}
        </Text>

        <View className="mb-3 flex-row items-center gap-2">
          <MaterialIcons name="bolt" size={18} color={yellow} />
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="tracking-wider text-foreground/60"
          >
            Strength
          </Text>
        </View>
        <Text size="sm" className="mb-4">
          {archetype.strength}
        </Text>

        <View className="mb-3 flex-row items-center gap-2">
          <MaterialIcons
            name="psychology"
            size={18}
            color={colors.primary.pink}
          />
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="tracking-wider text-foreground/60"
          >
            Growth Edge
          </Text>
        </View>
        <Text size="sm">{archetype.growthEdge}</Text>
      </View>
    </LinearGradient>
  );
}
