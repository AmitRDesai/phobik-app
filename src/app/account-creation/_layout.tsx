import { BackButton } from '@/components/ui/BackButton';
import { Screen } from '@/components/ui/Screen';
import { SegmentedProgress } from '@/components/ui/SegmentedProgress';
import { variantConfig } from '@/components/variant-config';
import { useScheme } from '@/hooks/useTheme';
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
  const scheme = useScheme();
  const bgHex = variantConfig.auth[scheme].bgHex;

  // The header is rendered as an absolute overlay rather than a flex
  // sibling above the Stack. With a flex sibling, the Stack body would
  // shrink by header-height the moment the header conditionally appeared
  // on Welcome→Philosophy push, which dragged Welcome's still-mounted
  // content downward in lockstep with the body's top edge. With an
  // overlay the Stack body height stays constant across every route in
  // the flow; the header just paints on top when present.
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
              // Solid bg so scrolled content gets hidden behind the
              // overlay instead of bleeding through the transparent gap.
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
