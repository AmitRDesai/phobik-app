import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseLibraryHeader } from '../components/ExerciseLibraryHeader';
import { FilterBar, FilterOption } from '../components/FilterBar';
import { EXERCISES } from '../data/exercises';

export default function ExerciseLibrary() {
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredExercises =
    filter === 'all'
      ? EXERCISES
      : EXERCISES.filter((e) => e.anxietyLevels.includes(filter));

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-dashboard"
        centerY={0.25}
        intensity={0.5}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <ExerciseLibraryHeader />
      <ScrollView
        contentContainerClassName="px-6 py-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <FilterBar selected={filter} onSelect={setFilter} />

        {/* 2-column grid */}
        <View className="mt-8 flex-row flex-wrap justify-between gap-y-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </View>

        {/* Bottom spacer for tab bar clearance */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
