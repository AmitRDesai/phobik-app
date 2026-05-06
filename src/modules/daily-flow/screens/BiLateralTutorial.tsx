import BL_IMAGE from '@/assets/images/daily-flow/bilateral-tutorial.png';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { getFeeling } from '../data/feelings';
import type { FlowStep } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function BiLateralTutorial() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
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
    <Screen
      variant="default"
      scroll
      header={<DailyFlowHeader title="Bi-Lateral Tapping Tutorial" />}
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
      <View className="items-center pt-2">
        <View className="relative h-[240px] w-[240px] items-center justify-center">
          <View
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: withAlpha(colors.primary.pink, 0.08),
              boxShadow: `0 0 40px ${withAlpha(colors.primary.pink, 0.6)}`,
            }}
          />
          <View className="h-full w-full overflow-hidden rounded-full border border-foreground/10 p-2">
            <Image
              source={BL_IMAGE}
              className="h-full w-full rounded-full"
              resizeMode="cover"
            />
          </View>
        </View>
        <View className="mt-7 items-center">
          <GradientText
            className="text-[34px] font-black tracking-tight"
            end={{ x: 1, y: 1 }}
          >
            Find Your Rhythm
          </GradientText>
          <Text className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/55">
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
          numberColor={yellow}
          title="Choose Location"
          description="Tap your knees or shoulders (self-hug)."
        />

        <HighlightStepCard yellow={yellow} />

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
    </Screen>
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
    <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5">
      <View className="flex-row items-start gap-4">
        <Text
          className="text-2xl font-black tracking-tight"
          style={{ color: numberColor }}
        >
          {number}
        </Text>
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground">{title}</Text>
          <Text className="mt-1 text-sm leading-5 text-foreground/60">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function HighlightStepCard({ yellow }: { yellow: string }) {
  return (
    <View className="relative overflow-hidden rounded-2xl border border-primary-pink/25 bg-foreground/[0.05] p-7">
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
          <Text className="text-xl font-bold text-foreground">
            Start a Steady Rhythm
          </Text>
          <Text className="mt-2 text-base leading-6 text-foreground/70">
            Gently tap{' '}
            <Text className="font-bold" style={{ color: colors.primary.pink }}>
              left
            </Text>
            {' → then '}
            <Text className="font-bold" style={{ color: yellow }}>
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
    <View className="rounded-2xl border border-foreground/5 bg-foreground/[0.03] p-5">
      <Text className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/50">
        {step}
      </Text>
      <Text className="mt-1.5 text-base font-bold text-foreground">
        {title}
      </Text>
      <Text className="mt-1 text-xs leading-5 text-foreground/55">
        {description}
      </Text>
    </View>
  );
}
