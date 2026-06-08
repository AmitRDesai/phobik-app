import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { Ionicons } from '@expo/vector-icons';

import { PillarDetailScaffold } from '../components/PillarDetailScaffold';
import { PillarMetricCard } from '../components/PillarMetricCard';
import { PILLARS, PILLAR_STATUS_LINES } from '../data/pillars';
import { STEP_GOAL } from '../lib/scoring';
import { useMovementScore } from '../hooks/useMovementScore';

const EDU_CARDS = [
  {
    icon: 'flash' as const,
    tone: 'orange' as const,
    title: 'Mind-Body Sync',
    body: 'Movement releases BDNF, fueling neuroplasticity and focus.',
  },
  {
    icon: 'leaf' as const,
    tone: 'cyan' as const,
    title: 'Cortisol Reset',
    body: 'Light physical activity helps flush stress hormones effectively.',
  },
];

export default function MovementDetail() {
  const pillar = PILLARS.movement;
  const { score, steps, exerciseMinutes } = useMovementScore();

  const stepsStatus =
    steps != null ? `${Math.round((steps / STEP_GOAL) * 100)}%` : undefined;

  return (
    <PillarDetailScaffold
      pillar={pillar}
      score={score}
      statusLine={PILLAR_STATUS_LINES.movement(score)}
      trendValues={[]}
      trendTitle="Active Intensity"
      trendEmptyLabel="Connect a wearable to see your movement trend"
    >
      <View className="gap-3">
        <PillarMetricCard
          icon="footsteps"
          tone="orange"
          label="Steps"
          value={steps != null ? Math.round(steps).toLocaleString() : '—'}
          status={stepsStatus}
          note={`Goal: ${STEP_GOAL.toLocaleString()}`}
        />
        <PillarMetricCard
          icon="fitness"
          tone="yellow"
          label="Exercise"
          value={exerciseMinutes != null ? exerciseMinutes.toFixed(0) : '—'}
          unit="min"
          note="Active minutes"
        />
        <PillarMetricCard
          icon="walk"
          tone="cyan"
          label="Daily Movement"
          value="—"
          unit="min"
          note="Session"
        />
      </View>

      <View className="flex-row justify-between">
        {EDU_CARDS.map((edu) => (
          <View key={edu.title} className="w-[48%]">
            <Card variant="flat" size="sm" className="gap-2">
              <IconChip size="sm" tone={edu.tone}>
                {(color) => (
                  <Ionicons name={edu.icon} size={16} color={color} />
                )}
              </IconChip>
              <Text size="sm" weight="bold">
                {edu.title}
              </Text>
              <Text size="xs" tone="secondary">
                {edu.body}
              </Text>
            </Card>
          </View>
        ))}
      </View>
    </PillarDetailScaffold>
  );
}
