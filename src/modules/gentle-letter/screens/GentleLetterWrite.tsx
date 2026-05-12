import { Button } from '@/components/ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import { Keyboard, Pressable } from 'react-native';
import { TextArea } from '@/components/ui/TextArea';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
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
      scroll
      keyboard
      header={
        <Header
          left={<BackButton onPress={handleBack} />}
          center={
            <Text size="sm" weight="semibold">
              Gentle Letter Writing
            </Text>
          }
          className="border-b border-foreground/5"
        />
      }
      sticky={
        <Button
          onPress={handleNext}
          loading={createLetter.isPending}
          disabled={!currentText.trim() || (isLastStep && !coreAct)}
        >
          {isLastStep ? 'Save Letter' : 'Next Step'}
        </Button>
      }
      className="px-6"
    >
      <View className="mt-6 items-center gap-4">
        <ProgressDots total={5} current={currentStep + 1} />
        <Text
          size="xs"
          treatment="caption"
          tone="accent"
          weight="medium"
          className="/80"
          style={{ paddingRight: 2.2 }}
        >
          Step {currentStep + 1} of 5: {stepData.label}
        </Text>
      </View>

      <Text size="h2" align="center" className="mt-8 leading-tight">
        {stepData.headline}
      </Text>

      <Text
        size="md"
        align="center"
        tone="secondary"
        className="mt-3 leading-relaxed"
      >
        {stepData.body}
      </Text>

      <TextArea
        className="mt-6"
        rows="md"
        value={currentText}
        onChangeText={handleTextChange}
        placeholder={stepData.placeholder}
      />

      <View className="mt-3 flex-row items-center justify-center gap-1.5">
        <MaterialIcons
          name="info-outline"
          size={14}
          color={foregroundFor(scheme, 0.5)}
        />
        <Text size="sm" italic align="center" tone="secondary">
          {stepData.tip}
        </Text>
      </View>

      {isLastStep && (
        <View className="mt-6 gap-3">
          <Text
            size="xs"
            treatment="caption"
            align="center"
            tone="secondary"
            weight="bold"
          >
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
                    size="sm"
                    className={clsx(
                      'font-medium',
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
