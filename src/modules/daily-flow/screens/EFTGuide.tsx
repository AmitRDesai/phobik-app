import HAND_IMAGE from '@/assets/images/daily-flow/eft-side-of-hand.png';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text } from '@/components/themed/Text';
import { Image, View } from 'react-native';
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
          <Text className="text-[34px] font-black leading-tight tracking-tight text-foreground">
            EFT Tapping
          </Text>
        </View>
        <GradientText className="text-[34px] font-black leading-tight tracking-tight">
          Points Quick Tutorial
        </GradientText>
        <Text className="mt-3 text-sm leading-5 text-foreground/60">
          Follow the sequence below to release emotional blocks and restore
          balance.
        </Text>
      </View>

      <View
        className="mt-8 overflow-hidden rounded-2xl border border-foreground/5 bg-foreground/[0.03]"
        style={{ aspectRatio: 4 / 5 }}
      >
        <Image
          source={HAND_IMAGE}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(14,14,14,0.4)']}
          locations={[0, 0.6, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          pointerEvents="none"
        />
      </View>

      <View className="mt-8 gap-3">
        {EFT_POINTS.map((p) => (
          <EFTPointCard key={p.number} point={p} />
        ))}
      </View>
    </Screen>
  );
}
