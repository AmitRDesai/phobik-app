import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { dialog } from '@/utils/dialog';
import { useRouter } from 'expo-router';

import { exitDailyFlow, getPreviousStep } from '../data/flow-navigation';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

type Props = {
  step?: string;
  title?: string;
  progress?: number;
  wordmark?: boolean;
  showClose?: boolean;
  showBack?: boolean;
  onClose?: () => void;
};

export function DailyFlowHeader({
  step,
  title,
  progress,
  wordmark,
  showClose = true,
  showBack = true,
  onClose,
}: Props) {
  const router = useRouter();
  const { session } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const previousStep = session
    ? getPreviousStep(session.currentStep, session.addOns)
    : null;
  const canGoBack = !!previousStep || router.canGoBack();

  const handleBack = async () => {
    if (session && previousStep) {
      await updateSession.mutateAsync({
        id: session.id,
        currentStep: previousStep,
      });
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      exitDailyFlow(router);
    }
  };

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
    if (result !== 'leave') return;
    if (onClose) return onClose();
    exitDailyFlow(router);
  };

  const center = wordmark ? (
    <GradientText className="text-lg font-black tracking-[0.1em]">
      DAILY FLOW
    </GradientText>
  ) : title ? (
    <Text size="lg" weight="bold" numberOfLines={1}>
      {title}
    </Text>
  ) : step ? (
    <Text size="xs" weight="bold" className="text-foreground/50">
      {step}
    </Text>
  ) : null;

  return (
    <View>
      <Header
        left={
          showBack && canGoBack ? <BackButton onPress={handleBack} /> : null
        }
        right={
          showClose ? <BackButton icon="close" onPress={handleClose} /> : null
        }
        center={center}
      />
      {progress !== undefined ? (
        <View className="px-screen-x pb-1">
          <ProgressBar progress={progress} gradient />
        </View>
      ) : null}
    </View>
  );
}
