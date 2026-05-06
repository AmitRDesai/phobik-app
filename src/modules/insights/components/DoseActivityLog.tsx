import { Text, View } from 'react-native';
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
        <Text className="px-1 text-lg font-semibold text-foreground">
          Activity Log
        </Text>
        <View className="items-center rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
          <Text className="text-sm text-foreground/40">
            Complete a practice to see your activity here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <Text className="px-1 text-lg font-semibold text-foreground">
        Activity Log
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {activities.map((activity, index) => {
          const dominant = getDominantChemical(activity);
          const display = getChemicalDisplay(dominant.key);
          return (
            <View
              key={`${activity.source}-${activity.completedAt}`}
              className="w-[47%] rounded-2xl border border-foreground/10 bg-foreground/5 p-4"
            >
              <View
                className="mb-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: display.color }}
              />
              <Text className="text-xs text-foreground/60">
                {activity.practiceType}
              </Text>
              <Text className="text-sm font-medium text-foreground">
                +{dominant.value} {display.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
