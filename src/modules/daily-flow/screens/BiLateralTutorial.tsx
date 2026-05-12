import BL_IMAGE from '@/assets/images/daily-flow/bilateral-tutorial.png';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Image } from 'react-native';

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
      scroll
      header={<DailyFlowHeader title="Bi-Lateral Tapping Tutorial" />}
      sticky={
        <Button onPress={handleContinue} loading={updateSession.isPending}>
          Continue
        </Button>
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
          <GradientText className="text-[34px] font-black" end={{ x: 1, y: 1 }}>
            Find Your Rhythm
          </GradientText>
          <Text
            size="xs"
            treatment="caption"
            align="center"
            tone="secondary"
            weight="bold"
            className="mt-2 tracking-[0.2em]"
          >
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
    <Card className="p-5">
      <View className="flex-row items-start gap-4">
        <Text size="h2" weight="black" style={{ color: numberColor }}>
          {number}
        </Text>
        <View className="flex-1">
          <Text size="lg" weight="bold">
            {title}
          </Text>
          <Text size="sm" tone="secondary" className="mt-1 leading-5">
            {description}
          </Text>
        </View>
      </View>
    </Card>
  );
}

function HighlightStepCard({ yellow }: { yellow: string }) {
  return (
    <Card
      className="relative overflow-hidden border-primary-pink/40 p-5"
      shadow={{ color: colors.primary.pink, opacity: 0.2, blur: 16 }}
    >
      <View className="flex-row items-start gap-4">
        <Text size="h1" weight="black" style={{ color: colors.primary.pink }}>
          03
        </Text>
        <View className="flex-1">
          <Text size="lg" weight="bold">
            Start a Steady Rhythm
          </Text>
          <Text size="sm" tone="secondary" className="mt-1 leading-5">
            Gently tap{' '}
            <Text weight="bold" style={{ color: colors.primary.pink }}>
              left
            </Text>
            {' → then '}
            <Text weight="bold" style={{ color: yellow }}>
              right
            </Text>
            {' → left → right. Aim for 1–2 taps per second.'}
          </Text>
        </View>
      </View>
    </Card>
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
    <Card variant="flat" className="p-5">
      <Text
        size="xs"
        treatment="caption"
        weight="black"
        className="tracking-[0.25em] text-foreground/50"
        style={{ paddingRight: 2.5 }}
      >
        {step}
      </Text>
      <Text size="lg" weight="bold" className="mt-1.5">
        {title}
      </Text>
      <Text size="sm" tone="secondary" className="mt-1 leading-5">
        {description}
      </Text>
    </Card>
  );
}
