import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { type AgeRange, questionnaireAgeAtom } from '@/store/onboarding';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import { useAtom } from 'jotai';

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-54', label: '45–54' },
  { value: '55+', label: '55+' },
];

export default function AgeSelectionScreen() {
  const [selectedAge, setSelectedAge] = useAtom(questionnaireAgeAtom);
  const pathname = usePathname();
  const isProfileSetup = pathname.startsWith('/profile-setup');

  const totalSteps = isProfileSetup ? 5 : 7;
  const currentStep = isProfileSetup ? 1 : 3;
  const nextRoute = isProfileSetup
    ? '/profile-setup/gender-identity'
    : '/account-creation/gender-identity';

  return (
    <Screen
      variant="auth"
      scroll
      header={
        <Header
          left={isProfileSetup ? null : undefined}
          center={<ProgressDots total={totalSteps} current={currentStep} />}
        />
      }
      sticky={
        <View className="items-center">
          <GradientButton
            onPress={() => router.push(nextRoute)}
            disabled={selectedAge === null}
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
          >
            Next
          </GradientButton>
          <Text
            variant="caption"
            muted
            className="mt-3 tracking-[0.2em]"
            style={{ paddingRight: 2.2 }}
          >
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
      }
      className="px-8 pt-2"
    >
      <Text variant="h1" className="text-center tracking-tight">
        What age range do you fall into?
      </Text>
      <Text variant="sm" muted className="mt-3 text-center">
        Select your age range to personalize your journey.
      </Text>
      <View className="mt-8 gap-4">
        {AGE_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={selectedAge === option.value}
            onPress={() => setSelectedAge(option.value)}
            variant="radio"
          />
        ))}
      </View>
    </Screen>
  );
}
