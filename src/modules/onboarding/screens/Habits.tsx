import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import {
  type HabitCategory,
  type HabitRating,
  onboardingHabitRatingsAtom,
} from '@/store/onboarding';
import type { MaterialIcons } from '@expo/vector-icons';
import { Ionicons, MaterialIcons as MIcon } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

type IconName = keyof typeof MaterialIcons.glyphMap;
type CategoryOption = { value: HabitCategory; label: string; icon: IconName };

const CATEGORIES: CategoryOption[] = [
  { value: 'nutrition', label: 'Nutrition', icon: 'restaurant' },
  { value: 'movement', label: 'Movement', icon: 'fitness-center' },
  { value: 'sleep', label: 'Sleep', icon: 'bedtime' },
  {
    value: 'stress-management',
    label: 'Stress management',
    icon: 'self-improvement',
  },
  { value: 'energy', label: 'Energy', icon: 'bolt' },
  { value: 'focus', label: 'Focus', icon: 'gps-fixed' },
  {
    value: 'emotional-wellbeing',
    label: 'Emotional well-being',
    icon: 'favorite',
  },
  { value: 'relationships', label: 'Relationships', icon: 'groups' },
];

export default function HabitsScreen() {
  const [ratings, setRatings] = useAtom(onboardingHabitRatingsAtom);
  const scheme = useScheme();
  const iconColor = accentFor(scheme, 'yellow');

  const setRating = (category: HabitCategory, value: number) => {
    setRatings({ ...ratings, [category]: value as HabitRating });
  };

  const allRated = CATEGORIES.every((c) => ratings[c.value] != null);

  return (
    <OnboardingQuestionShell
      step={4}
      showStepCounter={false}
      title="How do you feel about your current habits?"
      subtitle="Rate from 1 (needs attention) to 5 (going great) for the following categories."
      buttonLabel="Continue"
      buttonDisabled={!allRated}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/food')}
    >
      <View className="gap-4">
        {CATEGORIES.map((category) => (
          <Card key={category.value} variant="flat" size="md">
            <View className="mb-4 flex-row items-center gap-3">
              <MIcon name={category.icon} size={22} color={iconColor} />
              <Text size="md" weight="bold">
                {category.label}
              </Text>
            </View>
            <Rating
              min={1}
              max={5}
              size="sm"
              value={ratings[category.value] ?? null}
              onChange={(value) => setRating(category.value, value)}
            />
          </Card>
        ))}
      </View>
    </OnboardingQuestionShell>
  );
}
