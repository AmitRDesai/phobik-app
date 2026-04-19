import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { exitDailyFlow, getPreviousStep } from '../data/flow-navigation';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';
import { DailyFlowProgressBar } from './DailyFlowProgressBar';

type Props = {
  step?: string;
  title?: string;
  progress?: number;
  wordmark?: boolean;
  showClose?: boolean;
  showBack?: boolean;
  onClose?: () => void;
};

function WordmarkText() {
  return (
    <MaskedView
      maskElement={
        <Text className="text-lg font-black tracking-[0.1em]">DAILY FLOW</Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-lg font-black tracking-[0.1em] opacity-0">
          DAILY FLOW
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

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

  return (
    <View className="ios:pt-16 android:pt-10 px-4 pb-3">
      <View className="h-10 flex-row items-center justify-between">
        <View className="w-10">
          {showBack && canGoBack ? (
            <Pressable
              onPress={handleBack}
              className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
            >
              <MaterialIcons name="arrow-back" size={22} color="white" />
            </Pressable>
          ) : null}
        </View>
        <View className="flex-1 items-center">
          {wordmark ? (
            <WordmarkText />
          ) : title ? (
            <Text
              className="text-base font-bold tracking-tight text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : step ? (
            <Text className="text-xs font-bold uppercase tracking-widest text-white/50">
              {step}
            </Text>
          ) : null}
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
      {progress !== undefined ? (
        <View className="mt-4">
          <DailyFlowProgressBar progress={progress} />
        </View>
      ) : null}
    </View>
  );
}
