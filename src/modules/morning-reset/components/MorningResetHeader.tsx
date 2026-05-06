import { GradientText } from '@/components/ui/GradientText';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

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
  const scheme = useScheme();
  const iconColor = foregroundFor(scheme, 1);
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
    <View className="px-4 pb-3 pt-2">
      <View className="h-10 flex-row items-center justify-between">
        <View className="w-10">
          {showBack && canGoBack ? (
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
            >
              <MaterialIcons name="arrow-back" size={22} color={iconColor} />
            </Pressable>
          ) : null}
        </View>
        <View className="flex-1 items-center">
          <GradientText className="text-lg font-black tracking-[0.1em]">
            MORNING FLOW
          </GradientText>
        </View>
        <View className="w-10 items-end">
          {showClose ? (
            <Pressable
              onPress={handleClose}
              className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
            >
              <MaterialIcons name="close" size={20} color={iconColor} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
