import { View } from '@/components/themed/View';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import { type AgeRange, onboardingAgeAtom } from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-54', label: '45–54' },
  { value: '55+', label: '55+' },
];

export default function AgeScreen() {
  const [age, setAge] = useAtom(onboardingAgeAtom);

  return (
    <OnboardingQuestionShell
      step={9}
      showStepCounter={false}
      title="What age range do you fall into?"
      subtitle="Select your age range to personalize your journey."
      buttonLabel="Next"
      buttonDisabled={age === null}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/gender')}
    >
      <View className="gap-4">
        {AGE_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={age === option.value}
            onPress={() => setAge(option.value)}
            variant="radio"
          />
        ))}
      </View>
    </OnboardingQuestionShell>
  );
}
