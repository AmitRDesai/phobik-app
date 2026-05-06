import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import { Text } from '@/components/themed/Text';
import { Keyboard, Pressable, TextInput, View } from 'react-native';
import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';

import type { CoreAct } from '../data/letter-steps';
import { CORE_ACTS, LETTER_STEPS } from '../data/letter-steps';
import { useCreateLetter } from '../hooks/useGentleLetter';
import { resetLetterDraftAtom } from '../store/gentle-letter';

export default function GentleLetterWrite() {
  const router = useRouter();
  const scheme = useScheme();
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
    <Screen
      variant="default"
      scroll
      keyboard
      header={
        <Header
          left={<BackButton onPress={handleBack} />}
          center={
            <Text className="text-sm font-semibold text-foreground">
              Gentle Letter Writing
            </Text>
          }
          className="border-b border-foreground/5"
        />
      }
      sticky={
        <GradientButton
          onPress={handleNext}
          loading={createLetter.isPending}
          disabled={!currentText.trim() || (isLastStep && !coreAct)}
        >
          {isLastStep ? 'Save Letter' : 'Next Step'}
        </GradientButton>
      }
      className="px-6"
    >
      <View className="mt-6 items-center gap-4">
        <ProgressDots total={5} current={currentStep + 1} />
        <Text className="text-xs font-medium uppercase tracking-widest text-primary-pink/80">
          Step {currentStep + 1} of 5: {stepData.label}
        </Text>
      </View>

      <Text className="mt-8 text-center text-2xl font-bold leading-tight text-foreground">
        {stepData.headline}
      </Text>

      <Text className="mt-3 text-center text-base leading-relaxed text-foreground/60">
        {stepData.body}
      </Text>

      <View className="mt-6 overflow-hidden rounded-xl border border-primary-pink/30 bg-foreground/5">
        <TextInput
          className="p-4 text-base text-foreground"
          placeholder={stepData.placeholder}
          placeholderTextColor={foregroundFor(scheme, 0.4)}
          multiline
          textAlignVertical="top"
          value={currentText}
          onChangeText={handleTextChange}
          style={{ minHeight: 200 }}
        />
      </View>

      <View className="mt-3 flex-row items-center justify-center gap-1.5">
        <MaterialIcons
          name="info-outline"
          size={14}
          color={foregroundFor(scheme, 0.5)}
        />
        <Text className="text-center text-xs italic text-foreground/55">
          {stepData.tip}
        </Text>
      </View>

      {isLastStep && (
        <View className="mt-6 gap-3">
          <Text variant="caption" className="text-center text-foreground/55">
            What core act does this letter honor?
          </Text>
          <View className="flex-row flex-wrap justify-center gap-2">
            {CORE_ACTS.map((act) => {
              const selected = coreAct === act.value;
              return (
                <Pressable
                  key={act.value}
                  onPress={() => setCoreAct(act.value)}
                  className={clsx(
                    'flex-row items-center gap-1.5 rounded-full px-4 py-2.5',
                    selected
                      ? 'border border-primary-pink/30 bg-primary-pink/20'
                      : 'border border-foreground/10 bg-foreground/5',
                  )}
                >
                  <MaterialIcons
                    name={act.icon}
                    size={16}
                    color={
                      selected
                        ? colors.primary.pink
                        : foregroundFor(scheme, 0.6)
                    }
                  />
                  <Text
                    className={clsx(
                      'text-sm font-medium',
                      selected ? 'text-primary-pink' : 'text-foreground/60',
                    )}
                  >
                    {act.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </Screen>
  );
}
