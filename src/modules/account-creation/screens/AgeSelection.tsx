import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { type AgeRange, questionnaireAgeAtom } from '@/store/onboarding';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import { useAtom } from 'jotai';
import { StepCounter } from '../components/StepCounter';

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
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button
            onPress={() => router.push(nextRoute)}
            disabled={selectedAge === null}
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            fullWidth
          >
            Next
          </Button>
          <StepCounter current={currentStep} total={totalSteps} />
        </View>
      }
      className="px-screen-x pt-[68px]"
    >
      <Text size="h1" align="center" className="tracking-tight">
        What age range do you fall into?
      </Text>
      <Text size="sm" tone="secondary" align="center" className="mt-3">
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
