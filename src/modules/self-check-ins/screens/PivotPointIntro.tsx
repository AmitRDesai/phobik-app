import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { Text } from '@/components/themed/Text';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  useInProgressAssessment,
  useStartAssessment,
} from '../hooks/useSelfCheckIn';
import {
  pivotPointAnswersAtom,
  pivotPointCurrentQuestionAtom,
} from '../store/self-check-ins';

export default function PivotPointIntro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAnswers = useSetAtom(pivotPointAnswersAtom);
  const setCurrentQuestion = useSetAtom(pivotPointCurrentQuestionAtom);
  const startAssessment = useStartAssessment();
  const inProgress = useInProgressAssessment('pivot-point');

  const handleStart = async () => {
    const result = await startAssessment.mutateAsync({ type: 'pivot-point' });

    // Restore state from API response
    const answers: Record<number, number> = {};
    if (result.answers) {
      for (const [key, value] of Object.entries(
        result.answers as Record<string, number>,
      )) {
        answers[Number(key)] = value;
      }
    }
    setAnswers(answers);
    setCurrentQuestion(result.currentQuestion);

    router.replace('/practices/self-check-ins/pivot-point-question');
  };

  const isResume = !!inProgress;

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="flex-row items-center justify-between bg-surface/90 px-6 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="text-lg font-bold tracking-tight text-foreground">
          The Pivot Point
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Badge */}
        <View className="mb-4 mt-2 self-start rounded-full bg-foreground/5 px-4 py-1.5">
          <Text className="text-xs font-bold uppercase tracking-widest text-primary-pink">
            Assessment
          </Text>
        </View>

        {/* Hero Title */}
        <Text className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          The Pivot Point
        </Text>
        <Text className="mb-8 text-lg font-medium text-foreground/60">
          How do you respond when life gets hard?
        </Text>

        {/* Description Card */}
        <Card variant="surface" className="mb-4 p-6">
          <Text className="text-[15px] leading-relaxed text-foreground/80">
            When life gets stressful, we don&apos;t rise to our
            intentions&mdash;we fall back on patterns. This quick assessment
            helps you understand how you react under pressure and how you can
            respond with more clarity and confidence.
          </Text>
        </Card>

        {/* Info Cards */}
        <View className="mb-6 flex-row gap-3">
          <Card variant="surface" className="flex-1 items-center">
            <MaterialIcons
              name="schedule"
              size={24}
              color={colors.primary.pink}
            />
            <Text className="mt-2 text-xs font-bold uppercase tracking-wider text-foreground/60">
              Duration
            </Text>
            <Text className="mt-1 text-base font-bold text-foreground">
              8-10 minutes
            </Text>
          </Card>
          <Card variant="surface" className="flex-1 items-center">
            <MaterialIcons
              name="psychology"
              size={24}
              color={colors.primary.pink}
            />
            <Text className="mt-2 text-xs font-bold uppercase tracking-wider text-foreground/60">
              Insights
            </Text>
            <Text className="mt-1 text-center text-base font-bold text-foreground">
              Personalized Pattern
            </Text>
          </Card>
        </View>

        {/* Privacy Notice */}
        <View className="mb-8 flex-row items-center justify-center gap-2">
          <MaterialIcons name="lock" size={14} color="rgba(255,255,255,0.3)" />
          <Text className="text-xs text-foreground/55">
            Your responses are private and encrypted.
          </Text>
        </View>

        {/* CTA */}
        <GradientButton
          onPress={handleStart}
          loading={startAssessment.isPending}
        >
          {isResume ? 'Resume Assessment' : 'Start Assessment'}
        </GradientButton>
      </ScrollView>
    </View>
  );
}
