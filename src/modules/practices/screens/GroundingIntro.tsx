import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';

import { SenseCard } from '../components/SenseCard';
import { EXERCISES } from '../data/exercises';
import { groundingSessionAtom } from '../store/grounding';

const exercise = EXERCISES.find((e) => e.id === 'grounding-54321')!;

export default function GroundingIntro() {
  const router = useRouter();
  const [groundingSession, setGroundingSession] = useAtom(groundingSessionAtom);
  const hasSavedSession = groundingSession !== null;

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          left={<BackButton />}
          center={
            <Text variant="lg" className="font-bold">
              Technique Intro
            </Text>
          }
        />
      }
      className="px-0"
      contentClassName="pb-10"
    >
      {/* Badge + Title + Description */}
      <View className="items-center px-6 pb-8 pt-4">
        <Badge tone="pink" size="sm" className="mb-4">
          Grounding Exercise
        </Badge>

        <View className="mb-4 flex-row flex-wrap items-center justify-center">
          <Text variant="display" className="font-extrabold leading-tight">
            {'The '}
          </Text>
          <GradientText className="text-4xl font-extrabold">
            5-4-3-2-1
          </GradientText>
          <Text variant="display" className="font-extrabold leading-tight">
            {' technique'}
          </Text>
        </View>

        <Text
          variant="sm"
          className="max-w-[90%] text-center leading-relaxed text-foreground/70"
        >
          {exercise.description}
        </Text>
      </View>

      {/* Sense cards */}
      <View className="gap-3 px-6">
        {exercise.steps?.map((step) => (
          <SenseCard
            key={step.count}
            count={step.count}
            title={step.title}
            subtitle={step.subtitle}
          />
        ))}
      </View>

      {/* Ready to begin */}
      <View className="mb-8 mt-10 px-6">
        <View className="mb-6 items-center">
          <Text variant="h3" className="font-bold">
            Ready to begin?
          </Text>
          <Text variant="caption" className="mt-1 text-foreground/40">
            Estimated duration: 3-5 minutes
          </Text>
        </View>
        <View className="gap-3">
          <GradientButton
            onPress={() => router.push('/practices/grounding-session')}
          >
            {hasSavedSession ? 'Resume Session' : 'Start Session'}
          </GradientButton>
          {hasSavedSession && (
            <Button
              variant="secondary"
              onPress={() => setGroundingSession(null)}
            >
              Restart Progress
            </Button>
          )}
        </View>
      </View>
    </Screen>
  );
}
