import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';

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
  const scheme = useScheme();
  const lockColor = foregroundFor(scheme, 0.3);
  const setAnswers = useSetAtom(pivotPointAnswersAtom);
  const setCurrentQuestion = useSetAtom(pivotPointCurrentQuestionAtom);
  const startAssessment = useStartAssessment();
  const inProgress = useInProgressAssessment('pivot-point');

  const handleStart = async () => {
    const result = await startAssessment.mutateAsync({ type: 'pivot-point' });

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
    <Screen
      variant="default"
      scroll
      header={
        <Header
          left={<BackButton />}
          center={
            <Text size="lg" weight="bold">
              The Pivot Point
            </Text>
          }
        />
      }
      sticky={
        <Button onPress={handleStart} loading={startAssessment.isPending}>
          {isResume ? 'Resume Assessment' : 'Start Assessment'}
        </Button>
      }
      className="px-6"
    >
      <View className="pt-2">
        <Badge tone="pink" size="sm" className="mb-4 self-start">
          Assessment
        </Badge>

        <Text size="h1" className="mb-2">
          The Pivot Point
        </Text>
        <Text size="lg" weight="medium" tone="secondary" className="mb-8">
          How do you respond when life gets hard?
        </Text>

        <Card variant="flat" className="mb-4 p-6">
          <Text size="md" className="leading-relaxed text-foreground/80">
            When life gets stressful, we don&apos;t rise to our
            intentions&mdash;we fall back on patterns. This quick assessment
            helps you understand how you react under pressure and how you can
            respond with more clarity and confidence.
          </Text>
        </Card>

        <View className="mb-6 flex-row gap-3">
          <Card variant="flat" className="flex-1 items-center">
            <MaterialIcons
              name="schedule"
              size={24}
              color={colors.primary.pink}
            />
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              className="mt-2 tracking-wider text-foreground/60"
            >
              Duration
            </Text>
            <Text size="lg" weight="bold" className="mt-1">
              8-10 minutes
            </Text>
          </Card>
          <Card variant="flat" className="flex-1 items-center">
            <MaterialIcons
              name="psychology"
              size={24}
              color={colors.primary.pink}
            />
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              className="mt-2 tracking-wider text-foreground/60"
            >
              Insights
            </Text>
            <Text size="lg" align="center" weight="bold" className="mt-1">
              Personalized Pattern
            </Text>
          </Card>
        </View>

        <View className="flex-row items-center justify-center gap-2">
          <MaterialIcons name="lock" size={14} color={lockColor} />
          <Text size="sm" tone="secondary">
            Your responses are private and encrypted.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
