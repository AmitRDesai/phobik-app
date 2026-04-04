import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';

import type { CoreAct } from '../data/letter-steps';
import { CORE_ACTS, LETTER_STEPS } from '../data/letter-steps';
import { useCreateLetter } from '../hooks/useGentleLetter';
import { resetLetterDraftAtom } from '../store/gentle-letter';

export default function GentleLetterWrite() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const draftRef = useRef<Record<string, string>>({});
  const [currentText, setCurrentText] = useState('');
  const [coreAct, setCoreAct] = useState<string | null>(null);
  const resetDraft = useSetAtom(resetLetterDraftAtom);
  const createLetter = useCreateLetter();
  const stepData = LETTER_STEPS[currentStep]!;
  const isLastStep = currentStep === LETTER_STEPS.length - 1;

  const handleTextChange = (text: string) => {
    setCurrentText(text);
    draftRef.current[stepData.key] = text;
  };

  const handleBack = async () => {
    if (currentStep > 0) {
      setCurrentStep((s) => {
        const prevStep = s - 1;
        const prevKey = LETTER_STEPS[prevStep]!.key;
        setCurrentText(draftRef.current[prevKey] ?? '');
        return prevStep;
      });
    } else {
      const result = await dialog.info({
        title: 'Leave practice?',
        message: 'Your draft will be saved for later.',
      });
      if (result) {
        router.back();
      }
    }
  };

  const handleClose = async () => {
    const result = await dialog.info({
      title: 'Leave practice?',
      message: 'Your draft will be saved for later.',
    });
    if (result) {
      router.back();
    }
  };

  const saveLetter = async () => {
    const d = draftRef.current;
    const close = dialog.loading({ message: 'Saving your letter...' });
    try {
      await createLetter.mutateAsync({
        content: {
          step1: d.step1 ?? '',
          step2: d.step2 ?? '',
          step3: d.step3 ?? '',
          step4: d.step4 ?? '',
          step5: d.step5 ?? '',
        },
        coreAct: coreAct as CoreAct['value'],
      });
      close();
      resetDraft();
      router.replace('/practices/gentle-letter/archive');
    } catch {
      close();
      await dialog.error({
        title: 'Something went wrong',
        message: 'Could not save your letter. Please try again.',
      });
    }
  };

  const handleNext = async () => {
    if (!currentText.trim()) return;

    if (isLastStep) {
      if (!coreAct) {
        await dialog.error({
          title: 'Choose a core act',
          message: 'Please select a core act that resonates with your letter.',
        });
        return;
      }

      Keyboard.dismiss();
      await saveLetter();
    } else {
      setCurrentStep((s) => {
        const nextStep = s + 1;
        const nextKey = LETTER_STEPS[nextStep]!.key;
        setCurrentText(draftRef.current[nextKey] ?? '');
        return nextStep;
      });
    }
  };

  return (
    <View className="flex-1 bg-background-charcoal">
      {/* Header */}
      <View
        className="z-10 flex-row items-center justify-between border-b border-white/5 px-4 py-3"
        style={{ paddingTop: insets.top + 4 }}
      >
        <BackButton onPress={handleBack} />
        <Text className="text-sm font-semibold text-white">
          Gentle Letter Writing
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAwareScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress */}
        <View className="mt-6 items-center gap-4">
          <ProgressDots total={5} current={currentStep + 1} />
          <Text className="text-xs font-medium uppercase tracking-widest text-primary-pink/80">
            Step {currentStep + 1} of 5: {stepData.label}
          </Text>
        </View>

        {/* Headline */}
        <Text className="mt-8 text-center text-2xl font-bold leading-tight text-white">
          {stepData.headline}
        </Text>

        {/* Body */}
        <Text className="mt-3 text-center text-base leading-relaxed text-slate-400">
          {stepData.body}
        </Text>

        {/* Text Input */}
        <View className="mt-6 overflow-hidden rounded-xl border border-primary-pink/30 bg-white/5">
          <TextInput
            className="p-4 text-base text-white"
            placeholder={stepData.placeholder}
            placeholderTextColor={colors.slate[500]}
            multiline
            textAlignVertical="top"
            value={currentText}
            onChangeText={handleTextChange}
            style={{ minHeight: 200 }}
          />
        </View>

        {/* Tip */}
        <View className="mt-3 flex-row items-center justify-center gap-1.5">
          <MaterialIcons
            name="info-outline"
            size={14}
            color={colors.slate[500]}
          />
          <Text className="text-center text-xs italic text-slate-500">
            {stepData.tip}
          </Text>
        </View>

        {/* Core Act Picker (Step 5 only) */}
        {isLastStep && (
          <View className="mt-6 gap-3">
            <Text className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">
              What core act does this letter honor?
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2">
              {CORE_ACTS.map((act) => {
                const selected = coreAct === act.value;
                return (
                  <Pressable
                    key={act.value}
                    onPress={() => setCoreAct(act.value)}
                    className={`flex-row items-center gap-1.5 rounded-full px-4 py-2.5 ${
                      selected
                        ? 'border border-primary-pink/30 bg-primary-pink/20'
                        : 'border border-white/10 bg-white/5'
                    }`}
                  >
                    <MaterialIcons
                      name={act.icon}
                      size={16}
                      color={selected ? colors.primary.pink : colors.slate[400]}
                    />
                    <Text
                      className={`text-sm font-medium ${selected ? 'text-primary-pink' : 'text-slate-400'}`}
                    >
                      {act.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Action Button */}
        <View className="mt-8">
          <GradientButton
            onPress={handleNext}
            loading={createLetter.isPending}
            disabled={!currentText.trim() || (isLastStep && !coreAct)}
          >
            {isLastStep ? 'Save Letter' : 'Next Step'}
          </GradientButton>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
