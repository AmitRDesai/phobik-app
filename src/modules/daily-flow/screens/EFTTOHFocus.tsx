import CHARACTER_IMAGE from '@/assets/images/daily-flow/eft-toh-head.png';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Image } from 'react-native';

import { CircularTappingPoint } from '../components/CircularTappingPoint';
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
      scroll
      insetTop={false}
      sticky={
        <Button onPress={handleContinue} loading={updateSession.isPending}>
          Begin Tapping
        </Button>
      }
      className="px-6"
    >
      <View className="mt-2">
        <Text weight="black" className="text-[34px] leading-tight">
          EFT Tapping
        </Text>
        <GradientText className="text-[34px] font-black leading-tight">
          Points Quick Tutorial
        </GradientText>
        <Text size="sm" tone="secondary" className="mt-3 leading-5">
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
            source={CHARACTER_IMAGE}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <ImageScrim strength={0.6} start={0.65} />
          <View
            className="absolute left-1/2 flex-col items-center"
            style={{ top: '10%', transform: [{ translateX: -50 }], width: 100 }}
            pointerEvents="none"
          >
            <CircularTappingPoint accent="pink" />
            <View className="mt-3 rounded bg-black/60 px-2 py-[2px]">
              <Text
                size="xs"
                treatment="caption"
                tone="inverse"
                weight="bold"
                className="tracking-wider"
                style={{ paddingRight: 1.1 }}
                numberOfLines={1}
              >
                TOH
              </Text>
            </View>
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
