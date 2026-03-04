import { Text, View } from 'react-native';
import { DOSE_ACTIVITIES, getChemicalByKey } from '../data/dose-config';

export function DoseActivityLog() {
  return (
    <View className="gap-4">
      <Text className="px-1 text-lg font-semibold text-white">
        Activity Log
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {DOSE_ACTIVITIES.map((activity) => {
          const chem = getChemicalByKey(activity.chemical);
          return (
            <View
              key={activity.activity}
              className="w-[47%] rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <View
                className="mb-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: chem.color }}
              />
              <Text className="text-xs text-white/60">{activity.activity}</Text>
              <Text className="text-sm font-medium text-white">
                +{activity.coins} {chem.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
