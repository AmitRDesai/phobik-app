import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { MoodTabs } from '@/modules/practices/components/MoodTabs';
import { PracticeListRow } from '@/modules/practices/components/PracticeListRow';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import {
  MOVEMENT_EXERCISES,
  MOVEMENT_MOODS,
  type MovementMood,
} from '../data/movement-exercises';

export default function MovementList() {
  const router = useRouter();
  const [mood, setMood] = useState<MovementMood | null>(null);

  const filteredExercises = useMemo(() => {
    if (!mood) return MOVEMENT_EXERCISES;
    return MOVEMENT_EXERCISES.filter((e) => e.moods.includes(mood));
  }, [mood]);

  return (
    <PracticeScreenShell wordmark="FLOW STUDIO">
      <View className="mb-8 mt-4">
        <View className="flex-row flex-wrap items-baseline">
          <Text
            variant="display"
            className="font-extrabold uppercase leading-[1.05]"
          >
            MOVE &{' '}
          </Text>
          <GradientText className="text-4xl font-extrabold uppercase leading-[1.05]">
            RESET
          </GradientText>
        </View>
        <Text variant="lg" muted className="mt-3 max-w-[320px]">
          Move your body, release tension, and come back to yourself.
        </Text>
      </View>

      <MoodTabs
        label="How do you feel?"
        options={MOVEMENT_MOODS}
        active={mood}
        onChange={(value) => setMood(value as MovementMood | null)}
      />

      <View className="gap-5">
        {filteredExercises.length === 0 ? (
          <Text variant="sm" className="py-12 text-center text-foreground/50">
            No practices match this mood yet.
          </Text>
        ) : (
          filteredExercises.map((exercise) => (
            <PracticeListRow
              key={exercise.id}
              image={exercise.listImage}
              title={exercise.title}
              meta={exercise.meta}
              tags={[exercise.category, exercise.duration]}
              onPress={() => router.push(exercise.introRoute)}
            />
          ))
        )}
      </View>

      <Text
        variant="sm"
        className="mt-10 text-center leading-relaxed text-foreground/40"
      >
        The right movement can change how you feel in minutes.
      </Text>
    </PracticeScreenShell>
  );
}
