import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { getChemicalDisplay } from '../data/dose-config';
import { useDoseActivityLog } from '../hooks/useDoseActivityLog';
import type { DoseTotals } from '../hooks/useDailyDose';

/** Find the dominant chemical (highest non-zero value) for an activity */
function getDominantChemical(activity: {
  dopamine: number;
  oxytocin: number;
  serotonin: number;
  endorphins: number;
}): { key: keyof DoseTotals; value: number } {
  const entries: [keyof DoseTotals, number][] = [
    ['dopamine', activity.dopamine],
    ['oxytocin', activity.oxytocin],
    ['serotonin', activity.serotonin],
    ['endorphins', activity.endorphins],
  ];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return { key: sorted[0]![0], value: sorted[0]![1] };
}

export function DoseActivityLog() {
  const { data: activities } = useDoseActivityLog();

  if (!activities.length) {
    return (
      <View className="gap-4">
        <Text size="h3" className="px-1">
          Activity Log
        </Text>
        <Card className="items-center p-6">
          <Text size="sm" className="text-foreground/40">
            Complete a practice to see your activity here
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <Text size="h3" className="px-1">
        Activity Log
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {activities.map((activity) => {
          const dominant = getDominantChemical(activity);
          const display = getChemicalDisplay(dominant.key);
          return (
            <Card
              key={`${activity.source}-${activity.completedAt}`}
              className="w-[47%]"
            >
              <View
                className="mb-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: display.color }}
              />
              <Text size="xs" tone="secondary">
                {activity.practiceType}
              </Text>
              <Text size="sm" weight="medium">
                +{dominant.value} {display.label}
              </Text>
            </Card>
          );
        })}
      </View>
    </View>
  );
}
