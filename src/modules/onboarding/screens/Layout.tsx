import { BackButton } from '@/components/ui/BackButton';
import { Screen } from '@/components/ui/Screen';
import { SegmentedProgress } from '@/components/ui/SegmentedProgress';
import { Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { View } from 'react-native';

const TOTAL_STEPS = 8;

// `/onboarding` (AuraPictureSetup) is a pre-flow profile-picture step
// with its own chrome — no persistent header. The 8-step questionnaire
// starts at `/onboarding/welcome`. Order must match the actual
// router.push chain: welcome → life-stressors → fear-triggers →
// regulation-preference → energy-patterns → calendar-support →
// privacy-trust → completion. Mismatches cause the bar to advance by
// inconsistent amounts between screens.
const STEP_MAP: Record<string, number> = {
  welcome: 1,
  'life-stressors': 2,
  'fear-triggers': 3,
  'regulation-preference': 4,
  'energy-patterns': 5,
  'calendar-support': 6,
  'privacy-trust': 7,
  completion: 8,
};

export default function OnboardingLayout() {
  const pathname = usePathname();
  const params = useLocalSearchParams<{ skipped?: string }>();
  const last = pathname.split('/').pop() ?? '';
  const currentStep = STEP_MAP[last];
  // Skipped Completion has no progress chrome — user bypassed the flow.
  const isSkipped = last === 'completion' && params.skipped === 'true';
  const showHeader = !!currentStep && !isSkipped;

  // Unlike account-creation (which has Welcome with no header), every
  // onboarding step from /welcome onwards has the same header. The
  // header is rendered as a normal flex sibling above the Stack — no
  // absolute overlay needed since the Stack body height is consistent
  // across all in-flow routes (and AuraPictureSetup, which is outside
  // the flow, simply has no header by virtue of being at /onboarding).
  return (
    <Screen insetBottom={false} className="">
      {showHeader ? (
        <View
          className="px-screen-x pb-3 pt-2"
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <BackButton />
          <View className="ml-3 flex-1">
            <SegmentedProgress total={TOTAL_STEPS} completed={currentStep} />
          </View>
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'slide_from_right',
          }}
        />
      </View>
    </Screen>
  );
}
