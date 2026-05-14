import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { MoodTabs } from '@/modules/practices/components/MoodTabs';
import { PracticeListRow } from '@/modules/practices/components/PracticeListRow';
import { PracticeScreenShell } from '@/modules/practices/components/PracticeScreenShell';
import {
  BREATHE_EXERCISES,
  BREATHE_LEVEL_FILTERS,
  type AnxietyLevel,
  type BreatheLevelFilter,
} from '../data/breathe-exercises';
import { useResumableBreatheSession } from '../hooks/useResumableBreatheSession';

export default function BreatheList() {
  const router = useRouter();
  const [filter, setFilter] = useState<BreatheLevelFilter>('All');
  const resumable = useResumableBreatheSession();

  const filteredExercises = useMemo(() => {
    if (filter === 'All') return BREATHE_EXERCISES;
    return BREATHE_EXERCISES.filter((e) =>
      e.levels.includes(filter as AnxietyLevel),
    );
  }, [filter]);

  return (
    <PracticeScreenShell wordmark="FLOW STUDIO">
      <View className="mb-8 mt-4">
        <View className="flex-row flex-wrap items-baseline">
          <Text size="display" className="uppercase leading-[1.05]">
            BREATHE &{' '}
          </Text>
          <GradientText className="text-4xl font-extrabold uppercase leading-[1.05]">
            REGULATE
          </GradientText>
        </View>
        <Text size="lg" tone="secondary" className="mt-3 max-w-[320px]">
          Steady your breath to settle your body in seconds.
        </Text>
      </View>

      {resumable ? (
        <Card
          variant="toned"
          tone="pink"
          onPress={() => router.push(resumable.introRoute)}
          className="mb-6 flex-row items-center gap-4"
        >
          <IconChip size="lg" shape="circle" tone="pink">
            {(color) => (
              <MaterialIcons name="play-arrow" size={24} color={color} />
            )}
          </IconChip>
          <View className="flex-1">
            <Text
              size="xs"
              treatment="caption"
              tone="accent"
              weight="bold"
              numberOfLines={1}
            >
              Unfinished
            </Text>
            <Text size="lg" numberOfLines={1} weight="bold" className="mt-0.5">
              {resumable.title}
            </Text>
          </View>
          <View>
            <Button size="xs" onPress={() => router.push(resumable.introRoute)}>
              Resume
            </Button>
          </View>
        </Card>
      ) : null}

      <MoodTabs
        options={[...BREATHE_LEVEL_FILTERS]}
        active={filter}
        onChange={(value) => setFilter((value ?? 'All') as BreatheLevelFilter)}
        allowDeselect={false}
      />

      <View className="gap-5">
        {filteredExercises.length === 0 ? (
          <Text size="sm" tone="secondary" align="center" className="py-12">
            No practices match this level.
          </Text>
        ) : (
          filteredExercises.map((exercise) => (
            <PracticeListRow
              key={exercise.id}
              image={exercise.image}
              title={exercise.title}
              meta={exercise.meta}
              tags={[exercise.category, exercise.duration]}
              onPress={() => router.push(exercise.introRoute)}
            />
          ))
        )}
      </View>
    </PracticeScreenShell>
  );
}
