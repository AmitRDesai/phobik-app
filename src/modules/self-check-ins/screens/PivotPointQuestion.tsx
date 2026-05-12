import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Rating } from '@/components/ui/Rating';
import { Screen } from '@/components/ui/Screen';
import { CommonActions } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useAtom } from 'jotai';

import {
  PIVOT_QUESTIONS,
  PIVOT_RATING_LABELS,
  PIVOT_SECTIONS,
  TOTAL_PIVOT_QUESTIONS,
} from '../data/pivot-point-questions';
import {
  useCompleteAssessment,
  useInProgressAssessment,
  useSaveAnswer,
} from '../hooks/useSelfCheckIn';
import { pivotPointAnswersAtom } from '../store/self-check-ins';

export default function PivotPointQuestion() {
  const router = useRouter();
  const navigation = useNavigation();
  const { index } = useLocalSearchParams<{ index?: string }>();
  const currentIndex = Math.min(
    TOTAL_PIVOT_QUESTIONS - 1,
    Math.max(0, Number(index) || 0),
  );
  const [answers, setAnswers] = useAtom(pivotPointAnswersAtom);
  const saveAnswer = useSaveAnswer();
  const completeAssessment = useCompleteAssessment();
  const inProgress = useInProgressAssessment('pivot-point');

  const question = PIVOT_QUESTIONS[currentIndex];
  const section = PIVOT_SECTIONS.find((s) => s.id === question.sectionId);
  const selectedValue = answers[question.id] ?? null;
  const isLastQuestion = currentIndex === TOTAL_PIVOT_QUESTIONS - 1;

  const handleRatingChange = (value: number) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = () => {
    if (selectedValue === null) return;

    if (inProgress) {
      const nextIndex = isLastQuestion ? currentIndex : currentIndex + 1;
      saveAnswer.mutate({
        id: inProgress.id,
        questionId: question.id,
        answer: selectedValue,
        currentQuestion: nextIndex,
      });
    }

    if (isLastQuestion) {
      if (inProgress) {
        completeAssessment.mutate({ id: inProgress.id });
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'index' }, { name: 'pivot-point-results' }],
        }),
      );
      return;
    }

    router.push({
      pathname: '/practices/self-check-ins/pivot-point-question',
      params: { index: String(currentIndex + 1) },
    });
  };

  const ratingLabel =
    selectedValue !== null
      ? `${selectedValue} = ${PIVOT_RATING_LABELS[selectedValue - 1]}`
      : '';

  return (
    <Screen
      scroll
      transparent
      insetTop={false}
      sticky={
        <Button onPress={handleNext} disabled={selectedValue === null}>
          {isLastQuestion ? 'See Results' : 'Next Question'}
        </Button>
      }
      className="px-6"
    >
      {section && (
        <View className="mb-4">
          <Text
            size="xs"
            treatment="caption"
            tone="accent"
            weight="bold"
            className="tracking-widest"
          >
            Section {section.id}: {section.title}
          </Text>
          <Text size="sm" tone="secondary" className="mt-1">
            {section.subtitle}
          </Text>
        </View>
      )}

      <Text size="h1" className="mb-10 leading-tight">
        {question.text}
      </Text>

      <Rating
        min={1}
        max={5}
        value={selectedValue}
        onChange={handleRatingChange}
        startLabel="Not like me"
        endLabel="Very much like me"
      />

      <Text
        size="sm"
        align="center"
        weight="medium"
        className="mt-4 text-foreground/60"
      >
        {ratingLabel || ' '}
      </Text>

      <View className="mt-12 rounded-2xl border border-foreground/5 bg-foreground/[0.03] p-6">
        <Text size="sm" italic tone="secondary" className="leading-relaxed">
          &ldquo;The Pivot Point is that split second between a stimulus and
          your response where your freedom lies.&rdquo;
        </Text>
      </View>
    </Screen>
  );
}
