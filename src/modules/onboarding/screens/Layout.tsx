import { BackButton } from '@/components/ui/BackButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { Stack, usePathname } from 'expo-router';
import { View } from 'react-native';

const TOTAL_STEPS = 14;

// The 14-step questionnaire spans the unified onboarding flow. Order must
// match the actual router.push chain: welcome → personalization → goals →
// habits → food → activity → sedentary → sleep → age → gender → emotional →
// philosophy → privacy → terms. The Create Account gate (email path) and the
// "You're all set" completion screen sit outside the progress bar.
// `/onboarding` (index) resolves to the `onboarding` path segment.
const STEP_MAP: Record<string, number> = {
  onboarding: 1, // index → Welcome
  personalization: 2,
  goals: 3,
  habits: 4,
  food: 5,
  activity: 6,
  sedentary: 7,
  sleep: 8,
  age: 9,
  gender: 10,
  emotional: 11,
  philosophy: 12,
  privacy: 13,
  terms: 14,
};

export default function OnboardingLayout() {
  const pathname = usePathname();
  const last = pathname.split('/').pop() ?? '';
  const currentStep = STEP_MAP[last];
  const showHeader = !!currentStep;
  // No back affordance on the first step (Welcome).
  const showBack = !!currentStep && currentStep > 1;

  // Header rendered as a flex sibling above the Stack. The Stack's
  // contentStyle is transparent so the layout's variant bg paints
  // continuously across step transitions.
  return (
    <Screen insetBottom={false} noPadding>
      {showHeader ? (
        <View className="px-screen-x flex-row items-center pb-3 pt-2">
          {showBack ? <BackButton /> : <View className="size-10" />}
          <View className="flex-1 items-center">
            <ProgressDots total={TOTAL_STEPS} current={currentStep} animated />
          </View>
          {/* Spacer balancing the BackButton so the dots stay optically centered. */}
          <View className="size-10" />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'slide_from_right',
          }}
        />
      </View>
    </Screen>
  );
}
