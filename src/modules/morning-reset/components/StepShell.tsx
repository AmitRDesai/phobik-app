import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dismissToRoot } from '@/utils/navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';

import { STEP_ROUTES, getNextStep } from '../data/flow-navigation';
import type { FlowStep } from '../data/types';
import {
  useActiveMorningResetSession,
  useCompleteMorningResetSession,
  useUpdateMorningResetSession,
} from '../hooks/useMorningResetSession';

type Props = {
  step: Exclude<FlowStep, 'landing'>;
  habitLabel: string;
  title: string;
  duration?: string;
  intro: ReactNode;
  children: ReactNode;
  ctaLabel?: string;
};

export function StepShell({
  habitLabel,
  title,
  duration,
  intro,
  children,
  ctaLabel,
  step,
}: Props) {
  const router = useRouter();
  const scheme = useScheme();
  const { session, isLoading } = useActiveMorningResetSession();
  const updateSession = useUpdateMorningResetSession();
  const completeSession = useCompleteMorningResetSession();

  if (isLoading || !session) return <LoadingScreen />;

  const nextStep = getNextStep(step);
  const isFinal = nextStep === null;

  const handleContinue = async () => {
    if (isFinal) {
      await completeSession.mutateAsync({ id: session.id });
      dismissToRoot(router);
      return;
    }
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: nextStep,
    });
    router.push(STEP_ROUTES[nextStep] as never);
  };

  const finalCtaLabel = ctaLabel ?? (isFinal ? 'Finish Session' : 'Next Step');
  const isPending = updateSession.isPending || completeSession.isPending;

  return (
    <Screen
      scroll
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button onPress={handleContinue} loading={isPending} fullWidth>
            {finalCtaLabel}
          </Button>
        </View>
      }
      className="px-6"
    >
      <View className="mb-2 mt-4">
        <Text
          size="xs"
          treatment="caption"
          tone="accent"
          weight="bold"
          className="tracking-[0.3em]"
          style={{ paddingRight: 3.3 }}
        >
          {habitLabel}
        </Text>
      </View>

      <View className="mb-6">
        <GradientText className="text-5xl font-black leading-[1.2]">
          {title}
        </GradientText>
      </View>

      {duration ? (
        <View className="mb-6 flex-row">
          <View className="flex-row items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2">
            <MaterialIcons
              name="schedule"
              size={14}
              color={accentFor(scheme, 'yellow')}
            />
            <Text
              size="xs"
              weight="semibold"
              className="text-foreground/70"
              style={{ paddingRight: 1.1 }}
            >
              {duration}
            </Text>
          </View>
        </View>
      ) : null}

      <View className="mb-8">{intro}</View>

      <View className="gap-4">{children}</View>
    </Screen>
  );
}
