import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors } from '@/constants/colors';
import {
  type GenderIdentity,
  questionnaireGenderAtom,
} from '@/store/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useAtom } from 'jotai';
import { StepCounter } from '../components/StepCounter';

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

export default function GenderIdentityScreen() {
  const [selectedGender, setSelectedGender] = useAtom(questionnaireGenderAtom);
  const pathname = usePathname();
  const isProfileSetup = pathname.startsWith('/profile-setup');

  const totalSteps = isProfileSetup ? 5 : 7;
  const currentStep = isProfileSetup ? 2 : 4;
  const nextRoute = isProfileSetup
    ? '/profile-setup/goal-selection'
    : '/account-creation/goal-selection';

  return (
    <Screen
      variant="auth"
      scroll
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button
            onPress={() => router.push(nextRoute)}
            disabled={selectedGender === null}
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            fullWidth
          >
            Continue
          </Button>
          <StepCounter current={currentStep} total={totalSteps} />
          <Text size="sm" tone="secondary" align="center" className="mt-3">
            PHOBIK values your privacy. Your data is encrypted and used only to
            enhance your experience.
          </Text>
        </View>
      }
      className="px-screen-x pt-[68px]"
    >
      <Text size="h1" align="center" className="tracking-tight">
        How do you identify?
      </Text>
      <Text size="sm" tone="secondary" align="center" className="mt-3">
        This data helps us personalize your mental health journey with
        supportive, tailored care.
      </Text>
      <View className="mt-8 gap-4">
        {GENDER_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={selectedGender === option.value}
            onPress={() => setSelectedGender(option.value)}
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
    </Screen>
  );
}
