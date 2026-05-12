import { Text } from '@/components/themed/Text';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SegmentedProgress } from '@/components/ui/SegmentedProgress';
import { Stack, usePathname } from 'expo-router';
import { View } from 'react-native';

const TOTAL_STEPS = 7;

// `/morning-reset` (Landing) is the pre-flow intro with its own chrome
// — no persistent progress bar. The 7-step flow starts at
// `/morning-reset/light-exposure`. Order must match STEP_ORDER in
// ../data/flow-navigation.
const STEP_MAP: Record<string, number> = {
  'light-exposure': 1,
  stillness: 2,
  'mental-reset': 3,
  movement: 4,
  'cold-exposure': 5,
  nourishment: 6,
  'deep-focus': 7,
};

export default function MorningResetLayout() {
  const pathname = usePathname();
  const last = pathname.split('/').pop() ?? '';
  const currentStep = STEP_MAP[last];
  const showHeader = !!currentStep;

  return (
    <Screen insetBottom={false} className="">
      {showHeader ? (
        <View>
          <Header
            left={<BackButton />}
            center={
              <Text size="lg" weight="bold">
                Morning Flow
              </Text>
            }
          />
          <View className="px-screen-x pb-3">
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
