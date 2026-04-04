import { BackButton } from '@/components/ui/BackButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { dialog } from '@/utils/dialog';
import { useRouter } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
import {
  mcStepAtom,
  resetMicroChallengeAtom,
  selectedEmotionAtom,
  selectedNeedAtom,
} from '../store/micro-challenges';

const TOTAL_STEPS = 6;

const STEP_TITLES = [
  'Micro-Challenge',
  'Micro-Challenge',
  'Feelings Mapper',
  'Needs Mapper',
  'Daily Dose',
  'Reflect with Curiosity',
];

export default function MicroChallenges() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useAtom(mcStepAtom);
  const [selectedEmotion, setSelectedEmotion] = useAtom(selectedEmotionAtom);
  const [selectedNeed, setSelectedNeed] = useAtom(selectedNeedAtom);
  const reset = useSetAtom(resetMicroChallengeAtom);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const handleBack = async () => {
    if (step > 0) {
      setDirection('back');
      setStep((s) => s - 1);
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
      reset();
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
      reset();
      router.back();
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection('forward');
      setStep((s) => s + 1);
    }
  };

  const handleFinish = () => {
    reset();
    router.back();
  };

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
        return <DailyDose onAccept={handleNext} />;
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
