import CHARACTER_IMAGE from '@/assets/images/daily-flow/eft-toh-head.png';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { CircularTappingPoint } from '../components/CircularTappingPoint';
import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { EFTPointCard } from '../components/EFTPointCard';
import { EFT_POINTS } from '../data/eftPoints';
import { getFeeling } from '../data/feelings';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function EFTTOHFocus() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  if (isLoading || !session) return <LoadingScreen />;

  const handleContinue = async () => {
    const tappingId = session.feeling
      ? getFeeling(session.feeling)?.tappingFeelingId
      : undefined;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'tapping',
    });
    router.push({
      pathname: '/daily-flow/tapping',
      params: { feelingId: tappingId ?? session.feeling ?? '' },
    });
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
          Begin Tapping
        </GradientButton>
      }
      className="px-6"
    >
      <View className="mt-2">
        <Text className="text-[34px] font-black leading-tight tracking-tight text-foreground">
          EFT Tapping
        </Text>
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
          source={CHARACTER_IMAGE}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(14,14,14,0.6)']}
          locations={[0, 0.65, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          pointerEvents="none"
        />
        <View
          className="absolute left-1/2 flex-col items-center"
          style={{ top: '10%', transform: [{ translateX: -50 }], width: 100 }}
          pointerEvents="none"
        >
          <CircularTappingPoint accent="pink" />
          <View className="mt-3 rounded bg-black/60 px-2 py-[2px]">
            <Text
              className="text-[10px] font-bold tracking-wider text-white"
              numberOfLines={1}
            >
              TOH
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-8 gap-3">
        {EFT_POINTS.map((p) => (
          <EFTPointCard key={p.number} point={p} />
        ))}
      </View>
    </Screen>
  );
}
