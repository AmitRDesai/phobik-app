import { View } from '@/components/themed/View';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import {
  type SedentaryTime,
  onboardingSedentaryTimeAtom,
} from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

const SEDENTARY_OPTIONS: { value: SedentaryTime; label: string }[] = [
  { value: 'lt-4h', label: 'Less than 4 hours' },
  { value: '4-8h', label: '4–8 hours' },
  { value: 'gt-8h', label: 'More than 8 hours' },
  { value: 'not-sure', label: 'Not sure' },
];

export default function SedentaryScreen() {
  const [sedentary, setSedentary] = useAtom(onboardingSedentaryTimeAtom);

  return (
    <OnboardingQuestionShell
      step={7}
      showStepCounter={false}
      title="How much time do you spend sitting most days?"
      buttonLabel="Continue"
      buttonDisabled={sedentary === null}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/sleep')}
    >
      <View className="gap-4">
        {SEDENTARY_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={sedentary === option.value}
            onPress={() => setSedentary(option.value)}
            variant="radio"
          />
        ))}
      </View>
    </OnboardingQuestionShell>
  );
}
