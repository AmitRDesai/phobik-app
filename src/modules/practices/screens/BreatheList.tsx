import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { IconChip } from '@/components/ui/IconChip';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text } from '@/components/themed/Text';
import { Pressable, View } from 'react-native';
import { GradientText } from '@/components/ui/GradientText';
import { MoodTabs } from '../components/MoodTabs';
import { PracticeListRow } from '../components/PracticeListRow';
import { PracticeScreenShell } from '../components/PracticeScreenShell';
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
    <PracticeScreenShell
      wordmark="FLOW STUDIO"
      bgClassName="bg-surface"
      glowCenterY={0.25}
      glowIntensity={0.5}
    >
      <View className="mb-8 mt-4">
        <View className="flex-row flex-wrap items-baseline">
          <Text className="text-[44px] font-extrabold uppercase leading-none tracking-tighter text-foreground">
            BREATHE &{' '}
          </Text>
          <GradientText className="text-[44px] font-extrabold uppercase leading-none tracking-tighter">
            REGULATE
          </GradientText>
        </View>
        <Text className="mt-3 max-w-[320px] text-base leading-relaxed text-foreground/60">
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
            <MaterialIcons name="play-arrow" size={24} color="white" />
          </IconChip>
          <View className="flex-1">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
              Unfinished session
            </Text>
            <Text className="mt-0.5 text-base font-bold text-foreground">
              {resumable.title}
            </Text>
          </View>
          <View>
            <GradientButton
              compact
              onPress={() => router.push(resumable.introRoute)}
            >
              Resume
            </GradientButton>
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
          <Text className="py-12 text-center text-sm text-foreground/50">
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
