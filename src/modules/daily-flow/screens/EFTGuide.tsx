import HAND_IMAGE from '@/assets/images/daily-flow/eft-side-of-hand.png';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { EFTPointCard } from '../components/EFTPointCard';
import { EFT_POINTS } from '../data/eftPoints';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function EFTGuide() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  if (isLoading || !session) return <LoadingScreen />;

  const handleContinue = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'eft_toh_focus',
    });
    router.push('/daily-flow/eft-toh-focus');
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<DailyFlowHeader title="EFT Tapping Guide" />}
      sticky={
        <GradientButton
          onPress={handleContinue}
          loading={updateSession.isPending}
        >
          Continue
        </GradientButton>
      }
      className="px-6"
    >
      <View className="mt-2">
        <View className="flex-row flex-wrap items-baseline">
          <Text className="text-[34px] font-black leading-tight text-foreground">
            EFT Tapping
          </Text>
        </View>
        <GradientText className="text-[34px] font-black leading-tight">
          Points Quick Tutorial
        </GradientText>
        <Text variant="sm" muted className="mt-3 leading-5">
          Follow the sequence below to release emotional blocks and restore
          balance.
        </Text>
      </View>

      <View className="mt-5 items-center">
        <View
          className="w-full overflow-hidden rounded-2xl border border-foreground/5 bg-foreground/[0.03]"
          style={{ aspectRatio: 1 }}
        >
          <Image
            source={HAND_IMAGE}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      </View>

      <View className="mt-5 gap-3">
        {EFT_POINTS.map((p) => (
          <EFTPointCard key={p.number} point={p} />
        ))}
      </View>
    </Screen>
  );
}
