import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { Text } from '@/components/themed/Text';
import { Pressable, ScrollView, View } from 'react-native';
import { EaseView } from 'react-native-ease';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useAtom(
    pivotPointCurrentQuestionAtom,
  );
  const [answers, setAnswers] = useAtom(pivotPointAnswersAtom);

  const saveAnswer = useSaveAnswer();
  const completeAssessment = useCompleteAssessment();
  const inProgress = useInProgressAssessment('pivot-point');

  const scrollRef = useRef<ScrollView>(null);
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
      router.replace('/practices/self-check-ins/pivot-point-results');
    } else {
      setDirection('forward');
      setCurrentIndex((i) => i + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const ratingLabel =
    selectedValue !== null
      ? `${selectedValue} = ${PIVOT_RATING_LABELS[selectedValue - 1]}`
      : '';

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="flex-row items-center justify-between bg-surface px-6 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton onPress={handleBack} />
        <Text className="text-lg font-bold tracking-tight text-foreground">
          The Pivot Point
        </Text>
        <Pressable
          onPress={handleClose}
          className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
        >
          <MaterialIcons name="close" size={20} color="white" />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
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
          {/* Section Label */}
          {section && (
            <View className="mb-4">
              <Text className="text-xs font-bold uppercase tracking-widest text-primary-pink">
                Section {section.id}: {section.title}
              </Text>
              <Text className="mt-1 text-sm text-foreground/55">
                {section.subtitle}
              </Text>
            </View>
          )}

          {/* Question */}
          <Text className="mb-10 text-2xl font-bold leading-tight tracking-tight text-foreground">
            {question.text}
          </Text>

          {/* Rating Scale */}
          <RatingScale
            min={1}
            max={5}
            value={selectedValue}
            onChange={handleRatingChange}
            startLabel="Not like me"
            endLabel="Very much like me"
          />

          {/* Rating Label — always rendered to keep layout stable */}
          <Text className="mt-4 text-center text-sm font-medium text-foreground/60">
            {ratingLabel || ' '}
          </Text>

          {/* Context Card */}
          <View className="mt-12 rounded-2xl border border-foreground/5 bg-foreground/[0.03] p-6">
            <Text className="text-sm italic leading-relaxed text-foreground/55">
              &ldquo;The Pivot Point is that split second between a stimulus and
              your response where your freedom lies.&rdquo;
            </Text>
          </View>

          {/* Next Button */}
          <View className="mt-6">
            <GradientButton
              onPress={handleNext}
              disabled={selectedValue === null}
            >
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </GradientButton>
          </View>
        </EaseView>
      </ScrollView>
    </View>
  );
}
