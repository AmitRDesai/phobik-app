import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Screen } from '@/components/ui/Screen';
import { CommonActions } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useAtom } from 'jotai';

import { InsightCard } from '../components/InsightCard';
import { INTIMACY_QUESTIONS } from '../data/intimacy-questions';
import {
  useCompleteAssessment,
  useInProgressAssessment,
  useSaveAnswer,
} from '../hooks/useSelfCheckIn';
import { intimacyAnswersAtom } from '../store/self-check-ins';

const TOTAL = INTIMACY_QUESTIONS.length;

export default function IntimacyQuestion() {
  const router = useRouter();
  const navigation = useNavigation();
  const { index } = useLocalSearchParams<{ index?: string }>();
  const currentIndex = Math.min(TOTAL - 1, Math.max(0, Number(index) || 0));
  const [answers, setAnswers] = useAtom(intimacyAnswersAtom);
  const saveAnswer = useSaveAnswer();
  const completeAssessment = useCompleteAssessment();
  const inProgress = useInProgressAssessment('intimacy');

  const question = INTIMACY_QUESTIONS[currentIndex];
  const selectedValue = answers[question.id] ?? null;
  const isLastQuestion = currentIndex === TOTAL - 1;

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
      // Replace the stack with just [Results] — intimacy is launched
      // from Relationship-Based Regulation, so back from Results pops
      // out of this nested stack back to the pillar screen.
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'intimacy-results' }],
        }),
      );
      return;
    }

    router.push({
      pathname: '/practices/self-check-ins/intimacy-question',
      params: { index: String(currentIndex + 1) },
    });
  };

  return (
    <Screen
      scroll
      transparent
      insetTop={false}
      sticky={
        <Button onPress={handleNext} disabled={selectedValue === null}>
          {isLastQuestion ? 'Save Response' : 'Next Question'}
        </Button>
      }
      className="px-6"
      contentClassName="pb-8"
    >
      <Text size="h1" className="mb-10 leading-tight">
        &ldquo;{question.text}&rdquo;
      </Text>

      <Rating
        min={0}
        max={4}
        value={selectedValue}
        onChange={handleRatingChange}
      />

      <View className="mt-14">
        <InsightCard
          title={question.insight.title}
          body={question.insight.body}
        />
      </View>
    </Screen>
  );
}
