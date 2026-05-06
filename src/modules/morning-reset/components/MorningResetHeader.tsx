import { BackButton } from '@/components/ui/BackButton';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { dialog } from '@/utils/dialog';
import { useRouter } from 'expo-router';

import { exitMorningReset } from '../data/flow-navigation';

type Props = {
  showClose?: boolean;
  showBack?: boolean;
  onClose?: () => void;
};

export function MorningResetHeader({
  showClose = true,
  showBack = true,
  onClose,
}: Props) {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  const handleClose = async () => {
    const result = await dialog.info<'leave' | 'stay'>({
      title: 'Leave Morning Flow?',
      message:
        'Your progress is saved. You can pick up where you left off later today.',
      buttons: [
        { label: 'Stay', value: 'stay', variant: 'secondary' },
        { label: 'Leave', value: 'leave', variant: 'primary' },
      ],
    });
    if (result !== 'leave') return;
    if (onClose) return onClose();
    exitMorningReset(router);
  };

  return (
    <Header
      left={showBack && canGoBack ? <BackButton /> : null}
      right={
        showClose ? <BackButton icon="close" onPress={handleClose} /> : null
      }
      center={
        <GradientText className="text-lg font-black tracking-[0.1em]">
          MORNING FLOW
        </GradientText>
      }
    />
  );
}
