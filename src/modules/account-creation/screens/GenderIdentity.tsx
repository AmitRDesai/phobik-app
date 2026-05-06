import { Header } from '@/components/ui/Header';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
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
import { Text, View } from 'react-native';

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
      header={
        <Header
          center={<ProgressDots total={totalSteps} current={currentStep} />}
        />
      }
      sticky={
        <View className="items-center">
          <GradientButton
            onPress={() => router.push(nextRoute)}
            disabled={selectedGender === null}
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
          >
            Continue
          </GradientButton>
          <Text className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">
            Step {currentStep} of {totalSteps}
          </Text>
          <Text className="mt-3 text-center text-xs text-foreground/45">
            PHOBIK values your privacy. Your data is encrypted and used only to
            enhance your experience.
          </Text>
        </View>
      }
      className="px-8 pt-2"
    >
      <Text className="text-center text-3xl font-extrabold tracking-tight text-foreground">
        How do you identify?
      </Text>
      <Text className="mt-3 text-center text-sm text-foreground/60">
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
