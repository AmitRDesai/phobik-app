import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { type Goal, questionnaireGoalsAtom } from '@/store/onboarding';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useAtom } from 'jotai';
import type { ReactNode } from 'react';

type IconRenderProps = { size: number; color: string };

type GoalOption = {
  value: Goal;
  label: string;
  description: string;
  renderIcon: (props: IconRenderProps) => ReactNode;
};

const GOAL_OPTIONS: GoalOption[] = [
  {
    value: 'reduce-anxiety',
    label: 'Reduce Panic & Anxiety',
    description: 'Manage symptoms and find calm',
    renderIcon: (p) => (
      <MaterialCommunityIcons name="head-cog-outline" {...p} />
    ),
  },
  {
    value: 'build-resilience',
    label: 'Build Resilience',
    description: 'Strengthen your mental fortitude',
    renderIcon: (p) => (
      <MaterialCommunityIcons name="shield-check-outline" {...p} />
    ),
  },
  {
    value: 'improve-sleep',
    label: 'Improve Sleep Quality',
    description: 'Rest deeper and wake refreshed',
    renderIcon: (p) => <Ionicons name="moon-outline" {...p} />,
  },
  {
    value: 'face-social-fears',
    label: 'Face Social Fears',
    description: 'Connect with confidence and ease',
    renderIcon: (p) => <Ionicons name="people-outline" {...p} />,
  },
  {
    value: 'daily-mindfulness',
    label: 'Daily Mindfulness',
    description: 'Practice being present every day',
    renderIcon: (p) => <MaterialCommunityIcons name="meditation" {...p} />,
  },
];

export default function GoalSelectionScreen() {
  const [selectedGoals, setSelectedGoals] = useAtom(questionnaireGoalsAtom);
  const pathname = usePathname();
  const isProfileSetup = pathname.startsWith('/profile-setup');
  const scheme = useScheme();
  const iconColor = foregroundFor(scheme, { dark: 1, light: 0.78 });

  const totalSteps = isProfileSetup ? 5 : 7;
  const currentStep = isProfileSetup ? 3 : 5;
  const nextRoute = isProfileSetup
    ? '/profile-setup/data-security-promise'
    : '/account-creation/data-security-promise';

  const toggleGoal = (goal: Goal) => {
    setSelectedGoals(
      selectedGoals.includes(goal)
        ? selectedGoals.filter((g) => g !== goal)
        : [...selectedGoals, goal],
    );
  };

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
        <View className="w-full items-center">
          <Button
            onPress={() => router.push(nextRoute)}
            disabled={selectedGoals.length === 0}
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            fullWidth
          >
            Continue
          </Button>
          <Text
            size="xs"
            treatment="caption"
            tone="secondary"
            className="mt-3 tracking-[0.2em]"
            style={{ paddingRight: 2.2 }}
          >
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
      }
      className="px-8 pt-2"
    >
      <Text size="h1" align="center" className="tracking-tight">
        What brings you here?
      </Text>
      <Text size="sm" tone="secondary" align="center" className="mt-3">
        Select the goals that matter most to you. We&apos;ll tailor your path
        accordingly.
      </Text>
      <View className="mt-8 gap-4">
        {GOAL_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            label={option.label}
            description={option.description}
            icon={option.renderIcon({ size: 20, color: iconColor })}
            selected={selectedGoals.includes(option.value)}
            onPress={() => toggleGoal(option.value)}
            variant="checkbox"
          />
        ))}
      </View>
    </Screen>
  );
}
