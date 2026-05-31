import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

// TODO: replace with real weekly progress data when backend lands.
const BARS: readonly { height: number; hero?: boolean }[] = [
  { height: 40 },
  { height: 80 },
  { height: 56 },
  { height: 112, hero: true },
  { height: 28 },
];

export function WeeklyProgressCard() {
  return (
    <Card variant="raised" size="lg">
      <Text size="xs" treatment="caption" weight="bold" tone="accent">
        Weekly Progress
      </Text>
      <Text size="h3" weight="bold" className="mt-2">
        Resilience Mindset
      </Text>
      <View className="mt-8 flex-row items-end gap-3">
        {BARS.map((bar, i) =>
          bar.hero ? (
            <LinearGradient
              key={`hero-${bar.height}-${i}`}
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={{
                width: 6,
                height: bar.height,
                borderRadius: 9999,
                boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.4)}`,
              }}
            />
          ) : (
            <View
              key={`bar-${bar.height}-${i}`}
              className="rounded-full bg-primary-pink/30"
              style={{ width: 6, height: bar.height }}
            />
          ),
        )}
      </View>
    </Card>
  );
}
