import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
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
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <Header
              left={<BackButton />}
              center={
                <ProgressDots
                  animated
                  total={TOTAL_STEPS}
                  current={currentStep}
                />
              }
            />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
