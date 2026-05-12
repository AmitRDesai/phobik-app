import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { EaseView } from 'react-native-ease';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { SegmentedProgress } from '@/components/ui/SegmentedProgress';
import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';

import { BodyScan } from '../components/BodyScan';
import { DailyDose } from '../components/DailyDose';
import { FloatingMapper } from '../components/FloatingMapper';
import { PauseAndNotice } from '../components/PauseAndNotice';
import { ReflectWithCuriosity } from '../components/ReflectWithCuriosity';
import { EMOTIONS } from '../data/emotions';
import { NEEDS } from '../data/needs';
import { clearChallengeCache } from '../hooks/useAIChallenge';
import {
  useAbandonChallenge,
  useActiveChallenge,
  useCompleteChallenge,
  useStartChallenge,
  useUpdateChallenge,
} from '../hooks/useMicroChallenge';

const TOTAL_STEPS = 6;

export default function MicroChallenges() {
  const router = useRouter();
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
  const selectedFeeling = challenge?.feeling ?? null;
  const selectedNeedItem = challenge?.need ?? null;

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
      updateChallenge.mutate({ id: challengeId, emotionId, feeling: '' });
    },
    [challengeId, updateChallenge],
  );

  const setSelectedNeed = useCallback(
    (needId: string | null) => {
      if (!challengeId || !needId) return;
      updateChallenge.mutate({ id: challengeId, needId, need: '' });
    },
    [challengeId, updateChallenge],
  );

  const setSelectedFeeling = useCallback(
    (feeling: string) => {
      if (!challengeId) return;
      updateChallenge.mutate({ id: challengeId, feeling });
    },
    [challengeId, updateChallenge],
  );

  const setSelectedNeedItem = useCallback(
    (need: string) => {
      if (!challengeId) return;
      updateChallenge.mutate({ id: challengeId, need });
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
      <Screen variant="default">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary.pink} />
        </View>
      </Screen>
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
            selectedSubItem={selectedFeeling}
            onSelect={setSelectedEmotion}
            onSubItemSelect={setSelectedFeeling}
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
            selectedSubItem={selectedNeedItem}
            onSelect={setSelectedNeed}
            onSubItemSelect={setSelectedNeedItem}
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
    <Screen
      variant="default"
      header={
        <Header
          left={<BackButton onPress={handleBack} />}
          center={
            <Text
              size="xs"
              treatment="caption"
              tone="secondary"
              style={{ paddingRight: 2.2 }}
            >
              Quick Challenge
            </Text>
          }
          right={
            <IconChip
              size="md"
              shape="circle"
              onPress={handleClose}
              accessibilityLabel="Close"
            >
              {(color) => (
                <MaterialIcons name="close" size={20} color={color} />
              )}
            </IconChip>
          }
        />
      }
      className="px-0 pt-0"
    >
      <SegmentedProgress
        total={TOTAL_STEPS}
        completed={step + 1}
        className="px-6 py-3"
      />

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
    </Screen>
  );
}
