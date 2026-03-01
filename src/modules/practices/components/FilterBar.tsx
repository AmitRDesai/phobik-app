import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { AnxietyLevel } from '../types';

type FilterOption = 'all' | AnxietyLevel;

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'Severe', value: 'severe' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Mild', value: 'mild' },
  { label: 'Calm', value: 'calm' },
];

interface FilterBarProps {
  selected: FilterOption;
  onSelect: (value: FilterOption) => void;
}

export function FilterBar({ selected, onSelect }: FilterBarProps) {
  return (
    <View>
      <Text className="mb-3 ml-1 text-[11px] font-medium uppercase tracking-wide text-slate-400/80">
        Filter by anxiety level
      </Text>
      <View className="flex-row items-center rounded-xl bg-white/5 p-1">
        {FILTER_OPTIONS.map((option) => {
          const isActive = selected === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              className="flex-1 items-center"
            >
              {isActive ? (
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: 8,
                    shadowColor: colors.primary.pink,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text className="text-[11px] font-bold text-white">
                    {option.label}
                  </Text>
                </LinearGradient>
              ) : (
                <View className="w-full items-center py-2.5">
                  <Text className="text-[11px] font-bold text-slate-400">
                    {option.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export type { FilterOption };
