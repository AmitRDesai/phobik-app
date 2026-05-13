import { Text } from '@/components/themed/Text';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { dialog } from '@/utils/dialog';
import { Stack, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';

import { exitDailyFlow, getPreviousStep } from '../data/flow-navigation';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

// `/daily-flow` (ResumeDispatcher) is the transient dispatcher route
// that redirects to the current step — no persistent header. Every
// other daily-flow route gets the persistent header.
function isStepRoute(pathname: string): boolean {
  const last = pathname.split('/').pop() ?? '';
  return last !== '' && last !== 'daily-flow';
}

function DailyFlowBackButton() {
  const router = useRouter();
  const { session } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  // Pop the nested Stack — the stack is built by `ResumeDispatcher` (via
  // `CommonActions.reset`) on resume and by `router.push` during forward
  // navigation, so `router.back()` always plays the native pop animation
  // and lands on the right previous step.
  const handleBack = async () => {
    const previousStep = session
      ? getPreviousStep(session.currentStep, session.addOns)
      : null;

    if (session && previousStep) {
      await updateSession.mutateAsync({
        id: session.id,
        currentStep: previousStep,
      });
    }

    if (previousStep && router.canGoBack()) {
      router.back();
    } else {
      exitDailyFlow(router);
    }
  };

  return <BackButton onPress={handleBack} />;
}

function DailyFlowCloseButton() {
  const router = useRouter();

  const handleClose = async () => {
    const result = await dialog.info<'leave' | 'stay'>({
      title: 'Leave Daily Flow?',
      message:
        'Your progress is saved. You can pick up where you left off later today.',
      buttons: [
        { label: 'Stay', value: 'stay', variant: 'secondary' },
        { label: 'Leave', value: 'leave', variant: 'primary' },
      ],
    });
    if (result === 'leave') exitDailyFlow(router);
  };

  return <BackButton icon="close" onPress={handleClose} />;
}

export default function DailyFlowLayout() {
  const pathname = usePathname();
  const showHeader = isStepRoute(pathname);

  return (
    <Screen insetBottom={false} noPadding>
      {showHeader ? (
        <Header
          left={<DailyFlowBackButton />}
          right={<DailyFlowCloseButton />}
          center={
            <Text size="lg" weight="bold">
              Daily Flow
            </Text>
          }
        />
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
