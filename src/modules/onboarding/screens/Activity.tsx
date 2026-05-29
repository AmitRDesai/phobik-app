import { View } from '@/components/themed/View';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors } from '@/constants/colors';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import {
  type ActivityLevel,
  onboardingActivityLevelAtom,
} from '@/store/onboarding';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

const ACTIVITY_OPTIONS: {
  value: ActivityLevel;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { value: 'mostly-sitting', label: 'Mostly sitting', icon: 'event-seat' },
  { value: 'lightly-active', label: 'Lightly active', icon: 'directions-walk' },
  {
    value: 'moderately-active',
    label: 'Moderately active',
    icon: 'fitness-center',
  },
  { value: 'very-active', label: 'Very active', icon: 'directions-run' },
  { value: 'it-varies', label: 'It varies', icon: 'timeline' },
];

export default function ActivityScreen() {
  const [activity, setActivity] = useAtom(onboardingActivityLevelAtom);

  return (
    <OnboardingQuestionShell
      step={6}
      showStepCounter={false}
      title="How active are you right now?"
      buttonLabel="Continue"
      buttonDisabled={activity === null}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/sedentary')}
    >
      <View className="gap-4">
        {ACTIVITY_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            selected={activity === option.value}
            onPress={() => setActivity(option.value)}
            variant="radio"
            icon={
              <MaterialIcons
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
