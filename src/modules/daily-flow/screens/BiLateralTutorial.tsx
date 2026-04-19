import BL_IMAGE from '@/assets/images/daily-flow/bilateral-tutorial.png';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { getFeeling } from '../data/feelings';
import type { FlowStep } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

function GradientHeadline({ text }: { text: string }) {
  return (
    <MaskedView
      maskElement={
        <Text className="text-[34px] font-black tracking-tight">{text}</Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text className="text-[34px] font-black tracking-tight opacity-0">
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function BiLateralTutorial() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  if (isLoading || !session) return <LoadingScreen />;

  const handleContinue = async () => {
    let next: FlowStep = 'reflection';
    let route = '/daily-flow/reflection';
    const tappingId = session.feeling
      ? getFeeling(session.feeling)?.tappingFeelingId
      : undefined;

    if (session.addOns?.eft) {
      next = 'eft_guide';
      route = '/daily-flow/eft-guide';
    } else if (tappingId) {
      next = 'tapping';
    }
    await updateSession.mutateAsync({ id: session.id, currentStep: next });
    if (next === 'tapping' && tappingId) {
      router.push({
        pathname: '/daily-flow/tapping',
        params: { feelingId: tappingId },
      });
    } else {
      router.push(route as never);
    }
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.15}
        intensity={0.4}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <DailyFlowHeader title="Bi-Lateral Tapping Tutorial" />
      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pt-2">
          <View className="relative h-[240px] w-[240px] items-center justify-center">
            <View
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: `${colors.primary.pink}15`,
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 40,
              }}
            />
            <View className="h-full w-full overflow-hidden rounded-full border border-white/10 p-2">
              <Image
                source={BL_IMAGE}
                className="h-full w-full rounded-full"
                resizeMode="cover"
              />
            </View>
          </View>
          <View className="mt-7 items-center">
            <GradientHeadline text="Find Your Rhythm" />
            <Text className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
              Phase 1 · Regulating the Nervous System
            </Text>
          </View>
        </View>

        <View className="mt-10 gap-4">
          <SmallStepCard
            number="01"
            numberColor={colors.primary.pink}
            title="Get Comfortable"
            description="Sit or stand with loose, relaxed shoulders and uncrossed legs."
          />
          <SmallStepCard
            number="02"
            numberColor={colors.accent.yellow}
            title="Choose Location"
            description="Tap your knees or shoulders (self-hug)."
          />

          <HighlightStepCard />

          <MiniStepCard
            step="Step 04"
            title="Breathe"
            description="Let your breath flow naturally and deeply."
          />
          <MiniStepCard
            step="Step 05"
            title="Focus"
            description="Notice the sensation and repeat the intention you set."
          />
          <MiniStepCard
            step="Step 06"
            title="Duration"
            description="Continue the rhythm for 30–90 seconds."
          />
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

function SmallStepCard({
  number,
  numberColor,
  title,
  description,
}: {
  number: string;
  numberColor: string;
  title: string;
  description: string;
}) {
  return (
    <View className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <View className="flex-row items-start gap-4">
        <Text
          className="text-2xl font-black tracking-tight"
          style={{ color: numberColor }}
        >
          {number}
        </Text>
        <View className="flex-1">
          <Text className="text-base font-bold text-white">{title}</Text>
          <Text className="mt-1 text-sm leading-5 text-white/60">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function HighlightStepCard() {
  return (
    <View className="relative overflow-hidden rounded-2xl border border-primary-pink/25 bg-white/[0.05] p-7">
      <View className="absolute right-3 top-3" pointerEvents="none">
        <MaterialIcons
          name="touch-app"
          size={72}
          color="white"
          style={{ opacity: 0.08 }}
        />
      </View>
      <View className="flex-row items-start gap-5">
        <Text
          className="text-4xl font-black tracking-tight"
          style={{ color: colors.primary.pink }}
        >
          03
        </Text>
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">
            Start a Steady Rhythm
          </Text>
          <Text className="mt-2 text-base leading-6 text-white/70">
            Gently tap{' '}
            <Text className="font-bold" style={{ color: colors.primary.pink }}>
              left
            </Text>
            {' → then '}
            <Text className="font-bold" style={{ color: colors.accent.yellow }}>
              right
            </Text>
            {' → left → right. Aim for 1–2 taps per second.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function MiniStepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <View className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
      <Text className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
        {step}
      </Text>
      <Text className="mt-1.5 text-base font-bold text-white">{title}</Text>
      <Text className="mt-1 text-xs leading-5 text-white/55">
        {description}
      </Text>
    </View>
  );
}
