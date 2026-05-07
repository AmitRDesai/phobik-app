import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { EaseView } from 'react-native-ease';

import { QuestionProgress } from '../components/QuestionProgress';
import { RatingScale } from '../components/RatingScale';
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
import {
  pivotPointAnswersAtom,
  pivotPointCurrentQuestionAtom,
} from '../store/self-check-ins';

export default function PivotPointQuestion() {
  const router = useRouter();
  const scheme = useScheme();
  const closeIconColor = foregroundFor(scheme, 0.7);
  const [currentIndex, setCurrentIndex] = useAtom(
    pivotPointCurrentQuestionAtom,
  );
  const [answers, setAnswers] = useAtom(pivotPointAnswersAtom);

  const saveAnswer = useSaveAnswer();
  const completeAssessment = useCompleteAssessment();
  const inProgress = useInProgressAssessment('pivot-point');

  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const question = PIVOT_QUESTIONS[currentIndex];
  const section = PIVOT_SECTIONS.find((s) => s.id === question.sectionId);
  const selectedValue = answers[question.id] ?? null;
  const isLastQuestion = currentIndex === TOTAL_PIVOT_QUESTIONS - 1;

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
      router.replace('/practices/self-check-ins/pivot-point-results');
    } else {
      setDirection('forward');
      setCurrentIndex((i) => i + 1);
    }
  };

  const ratingLabel =
    selectedValue !== null
      ? `${selectedValue} = ${PIVOT_RATING_LABELS[selectedValue - 1]}`
      : '';

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          left={<BackButton onPress={handleBack} />}
          center={
            <Text variant="lg" className="font-bold">
              The Pivot Point
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
          {isLastQuestion ? 'See Results' : 'Next Question'}
        </GradientButton>
      }
      className="px-6"
    >
      <QuestionProgress
        current={currentIndex + 1}
        total={TOTAL_PIVOT_QUESTIONS}
        showPercentage
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
        {section && (
          <View className="mb-4">
            <Text
              variant="caption"
              className="font-bold tracking-widest text-primary-pink"
            >
              Section {section.id}: {section.title}
            </Text>
            <Text variant="sm" className="mt-1 text-foreground/55">
              {section.subtitle}
            </Text>
          </View>
        )}

        <Text variant="h1" className="mb-10 font-bold leading-tight">
          {question.text}
        </Text>

        <RatingScale
          min={1}
          max={5}
          value={selectedValue}
          onChange={handleRatingChange}
          startLabel="Not like me"
          endLabel="Very much like me"
        />

        <Text
          variant="sm"
          className="mt-4 text-center font-medium text-foreground/60"
        >
          {ratingLabel || ' '}
        </Text>

        <View className="mt-12 rounded-2xl border border-foreground/5 bg-foreground/[0.03] p-6">
          <Text
            variant="sm"
            className="italic leading-relaxed text-foreground/55"
          >
            &ldquo;The Pivot Point is that split second between a stimulus and
            your response where your freedom lies.&rdquo;
          </Text>
        </View>
      </EaseView>
    </Screen>
  );
}
