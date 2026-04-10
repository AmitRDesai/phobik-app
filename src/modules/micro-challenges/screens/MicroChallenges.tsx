import { BackButton } from '@/components/ui/BackButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { dialog } from '@/utils/dialog';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { EaseView } from 'react-native-ease';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BodyScan } from '../components/BodyScan';
import { DailyDose } from '../components/DailyDose';
import { FloatingMapper } from '../components/FloatingMapper';
import { PauseAndNotice } from '../components/PauseAndNotice';
import { ReflectWithCuriosity } from '../components/ReflectWithCuriosity';
import { StepProgress } from '../components/StepProgress';
import { EMOTIONS } from '../data/emotions';
import { NEEDS } from '../data/needs';
import { clearChallengeCache } from '../hooks/useAIChallenge';
import {
  useActiveChallenge,
  useStartChallenge,
  useUpdateChallenge,
  useCompleteChallenge,
  useAbandonChallenge,
} from '../hooks/useMicroChallenge';

const TOTAL_STEPS = 6;

export default function MicroChallenges() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { challenge, isLoading: isLoadingChallenge } = useActiveChallenge();
  const startChallenge = useStartChallenge();
  const updateChallenge = useUpdateChallenge();
  const completeChallenge = useCompleteChallenge();
  const abandonChallenge = useAbandonChallenge();

  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isInitialized, setIsInitialized] = useState(false);

  // Current state from DB or defaults
  const challengeId = challenge?.id ?? null;
  const step = challenge?.currentStep ?? 0;
  const selectedEmotion = challenge?.emotionId ?? null;
  const selectedNeed = challenge?.needId ?? null;

  // On mount: start a new challenge if none is active
  useEffect(() => {
    if (isLoadingChallenge || isInitialized) return;
    setIsInitialized(true);

    if (!challenge) {
      startChallenge.mutate();
    }
  }, [isLoadingChallenge, isInitialized, challenge, startChallenge]);

  const setStep = useCallback(
    (newStep: number) => {
      if (!challengeId) return;
      updateChallenge.mutate({ id: challengeId, currentStep: newStep });
    },
    [challengeId, updateChallenge],
  );

  const setSelectedEmotion = useCallback(
    (emotionId: string | null) => {
      if (!challengeId || !emotionId) return;
      updateChallenge.mutate({ id: challengeId, emotionId });
    },
    [challengeId, updateChallenge],
  );

  const setSelectedNeed = useCallback(
    (needId: string | null) => {
      if (!challengeId || !needId) return;
      updateChallenge.mutate({ id: challengeId, needId });
    },
    [challengeId, updateChallenge],
  );

  const handleBack = async () => {
    if (step > 0) {
      setDirection('back');
      setStep(step - 1);
      return;
    }
    const result = await dialog.info({
      title: 'Quit Challenge?',
      message: 'Your progress will not be saved.',
      buttons: [
        { label: 'Quit', value: 'quit', variant: 'primary' },
        { label: 'Continue', value: 'continue', variant: 'secondary' },
      ],
    });
    if (result === 'quit') {
      if (challengeId) abandonChallenge.mutate(challengeId);
      clearChallengeCache();
      router.back();
    }
  };

  const handleClose = async () => {
    const result = await dialog.info({
      title: 'Quit Challenge?',
      message: 'Your progress will not be saved.',
      buttons: [
        { label: 'Quit', value: 'quit', variant: 'primary' },
        { label: 'Continue', value: 'continue', variant: 'secondary' },
      ],
    });
    if (result === 'quit') {
      if (challengeId) abandonChallenge.mutate(challengeId);
      clearChallengeCache();
      router.back();
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection('forward');
      setStep(step + 1);
    }
  };

  const handleFinish = (reflection?: string) => {
    if (challengeId) {
      completeChallenge.mutate({ id: challengeId, reflection });
    }
    clearChallengeCache();
    router.back();
  };

  // Save AI response + dose to DB when DailyDose generates them
  const handleAIResponse = useCallback(
    (data: {
      title: string;
      prompt: string;
      challengeText: string;
      doseDopamine: number;
      doseOxytocin: number;
      doseSerotonin: number;
      doseEndorphins: number;
    }) => {
      if (!challengeId) return;
      updateChallenge.mutate({
        id: challengeId,
        aiResponse: {
          title: data.title,
          prompt: data.prompt,
          challengeText: data.challengeText,
        },
        doseDopamine: data.doseDopamine,
        doseOxytocin: data.doseOxytocin,
        doseSerotonin: data.doseSerotonin,
        doseEndorphins: data.doseEndorphins,
      });
    },
    [challengeId, updateChallenge],
  );

  if (!isInitialized || isLoadingChallenge || !challengeId) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color={colors.primary.pink} />
      </View>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <PauseAndNotice onContinue={handleNext} />;
      case 1:
        return <BodyScan onContinue={handleNext} />;
      case 2:
        return (
          <FloatingMapper
            items={EMOTIONS.map((e) => ({
              id: e.id,
              label: e.label,
              gradient: e.gradient,
              shadowColor: e.shadowColor,
              subItems: e.subFeelings,
            }))}
            selectedId={selectedEmotion}
            onSelect={setSelectedEmotion}
            onConfirm={handleNext}
            promptText={`Name the feelings without judgment.\nI feel...`}
            confirmLabel="Confirm Feeling"
          />
        );
      case 3:
        return (
          <FloatingMapper
            items={NEEDS.map((n) => ({
              id: n.id,
              label: n.label,
              gradient: n.gradient,
              shadowColor: n.shadowColor,
              subItems: n.subNeeds,
            }))}
            selectedId={selectedNeed}
            onSelect={setSelectedNeed}
            onConfirm={handleNext}
            promptText={`Name what you are needing.\nI need...`}
            confirmLabel="Confirm Need"
          />
        );
      case 4:
        return (
          <DailyDose onAccept={handleNext} onAIResponse={handleAIResponse} />
        );
      case 5:
        return <ReflectWithCuriosity onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 pb-2"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton onPress={handleBack} />
        <Text className="text-xs font-bold uppercase tracking-widest text-white/60">
          Quick Challenge
        </Text>
        <Pressable
          onPress={handleClose}
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <MaterialIcons name="close" size={20} color="white" />
        </Pressable>
      </View>

      {/* Progress */}
      <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} />

      {/* Step Content with transition */}
      <EaseView
        key={step}
        className="flex-1"
        initialAnimate={{
          opacity: 0,
          translateX: direction === 'forward' ? 40 : -40,
        }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        {renderStep()}
      </EaseView>
    </View>
  );
}
