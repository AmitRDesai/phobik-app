import { BackButton } from '@/components/ui/BackButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { Stack, usePathname } from 'expo-router';
import { View } from 'react-native';

const TOTAL_STEPS = 7;

// Welcome (index) has its own bottom-stacked ProgressDots inside the
// sticky CTA — separate from the persistent header chrome that shows
// from Philosophy onwards.
const STEP_MAP: Record<string, number> = {
  philosophy: 2,
  'age-selection': 3,
  'gender-identity': 4,
  'goal-selection': 5,
  'data-security-promise': 6,
  'terms-of-service': 7,
};

export default function AccountCreationLayout() {
  const pathname = usePathname();
  const last = pathname.split('/').pop() ?? '';
  const currentStep = STEP_MAP[last];

  // Header rendered as a flex sibling above the Stack. Sub-screens use
  // `transparent` so their bg layer doesn't slide off with the screen on
  // back, and the Stack's contentStyle is transparent so the layout's
  // variant bg paints continuously across step transitions.
  return (
    <Screen insetBottom={false} noPadding>
      {currentStep ? (
        <View className="px-screen-x flex-row items-center pb-3 pt-2">
          <BackButton />
          <View className="flex-1 items-center">
            <ProgressDots total={TOTAL_STEPS} current={currentStep} />
          </View>
          {/* 40x40 spacer balancing the BackButton so ProgressDots stays
              optically centered on the screen. */}
          <View className="size-10" />
        </View>
      ) : (
        <View className="h-16" />
      )}
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
