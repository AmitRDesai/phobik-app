import { View } from '@/components/themed/View';
import { TextArea } from '@/components/ui/TextArea';
import { OnboardingGridCard } from '@/modules/onboarding/components/OnboardingGridCard';
import {
  type Goal,
  onboardingGoalDetailsAtom,
  onboardingGoalsAtom,
} from '@/store/onboarding';
import { OnboardingQuestionShell } from '@/modules/onboarding/components/OnboardingQuestionShell';
import type { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';

type IconName = keyof typeof MaterialIcons.glyphMap;
type GoalOption = { value: Goal; label: string; icon: IconName };

const GOAL_OPTIONS: GoalOption[] = [
  { value: 'stress-less', label: 'Stress less and feel calmer', icon: 'eco' },
  { value: 'increase-energy', label: 'Increase energy', icon: 'bolt' },
  { value: 'improve-sleep', label: 'Improve sleep', icon: 'bedtime' },
  {
    value: 'build-healthy-habits',
    label: 'Build healthier habits',
    icon: 'sync',
  },
  { value: 'improve-focus', label: 'Improve focus', icon: 'psychology' },
  {
    value: 'emotionally-balanced',
    label: 'Feel more emotionally balanced',
    icon: 'balance',
  },
  { value: 'move-more', label: 'Move more', icon: 'directions-run' },
  { value: 'build-confidence', label: 'Build confidence', icon: 'shield' },
  { value: 'feel-happier', label: 'Feel happier', icon: 'sentiment-satisfied' },
  {
    value: 'support-wellness',
    label: 'Support overall wellness',
    icon: 'health-and-safety',
  },
];

// Tall enough for the longest label ("Feel more emotionally balanced") to wrap
// without clipping, so every goal card is the same height.
const GOAL_CARD_HEIGHT = 120;

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return rows;
}

export default function GoalsScreen() {
  const [goals, setGoals] = useAtom(onboardingGoalsAtom);
  const [details, setDetails] = useAtom(onboardingGoalDetailsAtom);

  const toggle = (goal: Goal) => {
    setGoals(
      goals.includes(goal) ? goals.filter((g) => g !== goal) : [...goals, goal],
    );
  };

  return (
    <OnboardingQuestionShell
      step={3}
      showStepCounter={false}
      title="What brings you to Phobik?"
      subtitle="Select all that apply."
      buttonLabel="Continue"
      buttonDisabled={goals.length === 0}
      buttonIcon={<Ionicons name="arrow-forward" size={24} color="white" />}
      onButtonPress={() => router.push('/onboarding/habits')}
    >
      <View className="gap-3">
        {chunkPairs(GOAL_OPTIONS).map((row) => (
          <View key={row[0].value} className="flex-row gap-3">
            {row.map((option) => (
              <OnboardingGridCard
                key={option.value}
                icon={option.icon}
                label={option.label}
                selected={goals.includes(option.value)}
                onPress={() => toggle(option.value)}
                height={GOAL_CARD_HEIGHT}
              />
            ))}
            {row.length === 1 ? <View className="flex-1" /> : null}
          </View>
        ))}
        <View className="flex-row">
          <OnboardingGridCard
            icon="help"
            label="Not sure yet"
            selected={goals.includes('not-sure')}
            onPress={() => toggle('not-sure')}
            height={GOAL_CARD_HEIGHT}
          />
        </View>
      </View>

      <View className="mt-8">
        <TextArea
          label="Tell us more… (optional)"
          value={details}
          onChangeText={setDetails}
          placeholder="Tell us more about your specific challenges or goals…"
          rows="sm"
        />
      </View>
    </OnboardingQuestionShell>
  );
}
