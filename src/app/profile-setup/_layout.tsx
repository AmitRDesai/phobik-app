import { BackButton } from '@/components/ui/BackButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { Stack, usePathname } from 'expo-router';
import { View } from 'react-native';

const TOTAL_STEPS = 5;

// profile-setup re-uses the 5 post-Welcome account-creation screens but
// renumbers them 1..5 (no Welcome, no Philosophy in this flow).
const STEP_MAP: Record<string, number> = {
  'age-selection': 1,
  'gender-identity': 2,
  'goal-selection': 3,
  'data-security-promise': 4,
  'terms-of-service': 5,
};

export default function ProfileSetupLayout() {
  const pathname = usePathname();
  const last = pathname.split('/').pop() ?? '';
  const currentStep = STEP_MAP[last];

  // Header rendered as a flex sibling above the Stack. Sub-screens use
  // `transparent` so their bg layer doesn't slide off with the screen on
  // back; the Stack's contentStyle is transparent so the layout's bg
  // paints continuously across step transitions.
  return (
    <Screen insetBottom={false} className="">
      {currentStep ? (
        <View className="px-screen-x flex-row items-center pb-3 pt-2">
          <BackButton />
          <View className="flex-1 items-center">
            <ProgressDots total={TOTAL_STEPS} current={currentStep} />
          </View>
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
