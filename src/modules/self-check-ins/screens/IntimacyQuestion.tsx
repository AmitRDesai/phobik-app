import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { useScheme } from '@/hooks/useTheme';
import { foregroundFor } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { EaseView } from 'react-native-ease';

import { InsightCard } from '../components/InsightCard';
import { QuestionProgress } from '../components/QuestionProgress';
import { RatingScale } from '../components/RatingScale';
import { INTIMACY_QUESTIONS } from '../data/intimacy-questions';
import {
  useCompleteAssessment,
  useInProgressAssessment,
  useSaveAnswer,
} from '../hooks/useSelfCheckIn';
import {
  intimacyAnswersAtom,
  intimacyCurrentQuestionAtom,
} from '../store/self-check-ins';

const TOTAL = INTIMACY_QUESTIONS.length;

export default function IntimacyQuestion() {
  const router = useRouter();
  const scheme = useScheme();
  const closeIconColor = foregroundFor(scheme, 0.7);
  const [currentIndex, setCurrentIndex] = useAtom(intimacyCurrentQuestionAtom);
  const [answers, setAnswers] = useAtom(intimacyAnswersAtom);
  const saveAnswer = useSaveAnswer();
  const completeAssessment = useCompleteAssessment();
  const inProgress = useInProgressAssessment('intimacy');

  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const question = INTIMACY_QUESTIONS[currentIndex];
  const selectedValue = answers[question.id] ?? null;
  const isLastQuestion = currentIndex === TOTAL - 1;

  const handleClose = async () => {
    const result = await dialog.info({
      title: 'Quit Assessment?',
      message: 'Your progress will be saved.',
      buttons: [
        { label: 'Quit', value: 'quit', variant: 'primary' },
        { label: 'Continue', value: 'continue', variant: 'secondary' },
      ],
    });
    if (result === 'quit') {
      router.back();
    }
  };

  const handleBack = async () => {
    if (currentIndex > 0) {
      setDirection('back');
      setCurrentIndex((i) => i - 1);
      return;
    }
    await handleClose();
  };

  const handleRatingChange = (value: number) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = async () => {
    if (selectedValue === null) return;

    // Persist answer to backend
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
      router.replace('/practices/self-check-ins/intimacy-results');
    } else {
      setDirection('forward');
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          left={<BackButton onPress={handleBack} />}
          center={
            <Text size="lg" weight="bold">
              Intimacy Quiz
            </Text>
          }
          right={
            <Pressable
              onPress={handleClose}
              className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
            >
              <MaterialIcons name="close" size={20} color={closeIconColor} />
            </Pressable>
          }
        />
      }
      sticky={
        <GradientButton onPress={handleNext} disabled={selectedValue === null}>
          {isLastQuestion ? 'Save Response' : 'Next Question'}
        </GradientButton>
      }
      className="px-6"
      contentClassName="pb-8"
    >
      {/* Progress */}
      <QuestionProgress
        current={currentIndex + 1}
        total={TOTAL}
        sectionLabel={question.section}
      />

      <EaseView
        key={currentIndex}
        className="flex-1"
        initialAnimate={{
          opacity: 0,
          translateX: direction === 'forward' ? 40 : -40,
        }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        {/* Question */}
        <Text size="h1" className="mb-10 leading-tight">
          &ldquo;{question.text}&rdquo;
        </Text>

        {/* Rating Scale */}
        <RatingScale
          min={0}
          max={4}
          value={selectedValue}
          onChange={handleRatingChange}
        />

        {/* Insight Card */}
        <View className="mt-14">
          <InsightCard
            title={question.insight.title}
            body={question.insight.body}
          />
        </View>
      </EaseView>
    </Screen>
  );
}
