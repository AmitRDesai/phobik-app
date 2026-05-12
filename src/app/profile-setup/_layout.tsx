import { BackButton } from '@/components/ui/BackButton';
import { Screen } from '@/components/ui/Screen';
import { SegmentedProgress } from '@/components/ui/SegmentedProgress';
import { variantConfig } from '@/components/variant-config';
import { useScheme } from '@/hooks/useTheme';
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
  const scheme = useScheme();
  const bgHex = variantConfig.auth[scheme].bgHex;

  // See account-creation/_layout.tsx for the rationale: header rendered
  // as an absolute overlay so the Stack body height stays constant
  // across routes — prevents content from shifting on push transitions.
  return (
    <Screen variant="auth" insetBottom={false} className="">
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'slide_from_right',
          }}
        />
        {currentStep ? (
          <View
            className="px-screen-x pb-3 pt-2"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: bgHex,
            }}
          >
            <BackButton />
            <View className="ml-3 flex-1">
              <SegmentedProgress total={TOTAL_STEPS} completed={currentStep} />
            </View>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
