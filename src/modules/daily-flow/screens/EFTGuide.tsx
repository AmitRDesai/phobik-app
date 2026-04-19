import HAND_IMAGE from '@/assets/images/daily-flow/eft-side-of-hand.png';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { EFTPointCard } from '../components/EFTPointCard';
import { EFT_POINTS } from '../data/eftPoints';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

function GradientInline({ text }: { text: string }) {
  return (
    <MaskedView
      maskElement={
        <Text className="text-[34px] font-black leading-tight tracking-tight">
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-[34px] font-black leading-tight tracking-tight opacity-0">
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

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
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.1}
        intensity={0.35}
        startColor={colors.accent.purple}
        endColor={colors.primary.pink}
      />
      <DailyFlowHeader title="EFT Tapping Guide" />
      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2">
          <View className="flex-row flex-wrap items-baseline">
            <Text className="text-[34px] font-black leading-tight tracking-tight text-white">
              EFT Tapping
            </Text>
          </View>
          <GradientInline text="Points Quick Tutorial" />
          <Text className="mt-3 text-sm leading-5 text-white/60">
            Follow the sequence below to release emotional blocks and restore
            balance.
          </Text>
        </View>

        <View
          className="mt-8 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]"
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
      </ScrollView>
      <View className="px-6 pb-8">
        <GradientButton
          onPress={handleContinue}
          loading={updateSession.isPending}
        >
          Continue
        </GradientButton>
      </View>
    </View>
  );
}
