import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { exitMorningReset } from '../data/flow-navigation';

type Props = {
  showClose?: boolean;
  showBack?: boolean;
  onClose?: () => void;
};

function WordmarkText() {
  return (
    <MaskedView
      maskElement={
        <Text className="text-lg font-black tracking-[0.1em]">
          MORNING FLOW
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-lg font-black tracking-[0.1em] opacity-0">
          MORNING FLOW
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

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
    <View className="ios:pt-16 android:pt-10 px-4 pb-3">
      <View className="h-10 flex-row items-center justify-between">
        <View className="w-10">
          {showBack && canGoBack ? (
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
            >
              <MaterialIcons name="arrow-back" size={22} color="white" />
            </Pressable>
          ) : null}
        </View>
        <View className="flex-1 items-center">
          <WordmarkText />
        </View>
        <View className="w-10 items-end">
          {showClose ? (
            <Pressable
              onPress={handleClose}
              className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
            >
              <MaterialIcons name="close" size={20} color="white" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
