import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseLibraryHeader } from '../components/ExerciseLibraryHeader';
import { FilterBar, FilterOption } from '../components/FilterBar';
import { EXERCISES } from '../data/exercises';

const EXERCISE_ROUTES: Record<string, string> = {
  'grounding-54321': '/practices/grounding-intro',
  'box-breathing': '/practices/box-breathing-intro',
  'star-breathing': '/practices/star-breathing-intro',
  '478-breathing': '/practices/478-breathing-intro',
  'double-inhale': '/practices/double-inhale-intro',
  'lazy-8-breathing': '/practices/lazy-8-breathing-intro',
  'muscle-relaxation': '/practices/muscle-relaxation-intro',
  'sleep-meditation': '/practices/sleep-meditation-session',
};

export default function ExerciseLibrary() {
  const router = useRouter();
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
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={
                EXERCISE_ROUTES[exercise.id]
                  ? () => router.push(EXERCISE_ROUTES[exercise.id] as any)
                  : undefined
              }
            />
          ))}
        </View>

        {/* Bottom spacer for tab bar clearance */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
