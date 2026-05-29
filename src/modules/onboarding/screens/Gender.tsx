import { View } from '@/components/themed/View';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors } from '@/constants/colors';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import { type GenderIdentity, onboardingGenderAtom } from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

const GENDER_OPTIONS: {
  value: GenderIdentity;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: 'female', label: 'Female', icon: 'female' },
  { value: 'male', label: 'Male', icon: 'male' },
  { value: 'non-binary', label: 'Non-binary', icon: 'transgender' },
  {
    value: 'prefer-not-to-say',
    label: 'Prefer not to say',
    icon: 'eye-off-outline',
  },
];

export default function GenderScreen() {
  const [gender, setGender] = useAtom(onboardingGenderAtom);

  return (
    <OnboardingQuestionShell
      step={10}
      showStepCounter={false}
      title="How do you identify?"
      subtitle="This data helps us personalize your mental health journey with supportive, tailored care."
      buttonLabel="Continue"
      buttonDisabled={gender === null}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/emotional')}
    >
      <View className="gap-4">
        {GENDER_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={gender === option.value}
            onPress={() => setGender(option.value)}
            variant="radio"
            icon={
              <Ionicons
                name={option.icon}
                size={20}
                color={colors.primary.pink}
              />
            }
          />
        ))}
      </View>
    </OnboardingQuestionShell>
  );
}
