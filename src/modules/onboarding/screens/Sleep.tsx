import { View } from '@/components/themed/View';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import {
  type SleepQuality,
  onboardingSleepQualityAtom,
} from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

const SLEEP_OPTIONS: { value: SleepQuality; label: string }[] = [
  { value: 'deep-refreshing', label: 'Deep and refreshing' },
  { value: 'pretty-good', label: 'Pretty good' },
  { value: 'light-inconsistent', label: 'Light and inconsistent' },
  { value: 'hard-to-fall-asleep', label: 'Hard to fall asleep' },
  { value: 'wake-during-night', label: 'Wake up during the night' },
  { value: 'tired-most-days', label: 'Feel tired most days' },
];

export default function SleepScreen() {
  const [sleep, setSleep] = useAtom(onboardingSleepQualityAtom);

  return (
    <OnboardingQuestionShell
      step={8}
      showStepCounter={false}
      title="How has your sleep been lately?"
      buttonLabel="Continue"
      buttonDisabled={sleep === null}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/age')}
    >
      <View className="gap-4">
        {SLEEP_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={sleep === option.value}
            onPress={() => setSleep(option.value)}
            variant="radio"
          />
        ))}
      </View>
    </OnboardingQuestionShell>
  );
}
