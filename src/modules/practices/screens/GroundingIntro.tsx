import { BackButton } from '@/components/ui/BackButton';
import { Badge } from '@/components/ui/Badge';
import Container from '@/components/ui/Container';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { GradientText } from '@/components/ui/GradientText';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { SenseCard } from '../components/SenseCard';
import { EXERCISES } from '../data/exercises';
import { groundingSessionAtom } from '../store/grounding';

const exercise = EXERCISES.find((e) => e.id === 'grounding-54321')!;

export default function GroundingIntro() {
  const router = useRouter();
  const [groundingSession, setGroundingSession] = useAtom(groundingSessionAtom);
  const hasSavedSession = groundingSession !== null;

  return (
    <Container safeAreaClass="bg-surface">
      <View className="flex-1 bg-surface">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4">
          <BackButton />
          <Text className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-foreground">
            Technique Intro
          </Text>
          <View className="h-10 w-10" />
        </View>

        <ScrollView
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Badge + Title + Description */}
          <View className="items-center px-6 pb-8 pt-4">
            <Badge tone="pink" size="sm" className="mb-4">
              Grounding Exercise
            </Badge>

            <View className="mb-4 flex-row flex-wrap items-center justify-center">
              <Text className="text-4xl font-extrabold leading-tight text-foreground">
                {'The '}
              </Text>
              <GradientText className="text-4xl font-extrabold">
                5-4-3-2-1
              </GradientText>
              <Text className="text-4xl font-extrabold leading-tight text-foreground">
                {' technique'}
              </Text>
            </View>

            <Text className="max-w-[90%] text-center text-sm leading-relaxed text-foreground/70">
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
              <Text className="text-xl font-bold text-foreground">
                Ready to begin?
              </Text>
              <Text className="mt-1 text-xs text-foreground/40">
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
                <Pressable
                  onPress={() => setGroundingSession(null)}
                  className="w-full items-center rounded-full border border-foreground/5 bg-foreground/5 py-4 active:opacity-70"
                >
                  <Text className="text-sm font-medium text-foreground/60">
                    Restart Progress
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}
