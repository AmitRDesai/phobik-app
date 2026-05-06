import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dismissToRoot } from '@/utils/navigation';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import {
  STEP_ROUTES,
  getNextStep,
  getPreviousStep,
} from '../data/flow-navigation';
import type { FlowStep } from '../data/types';
import {
  useActiveMorningResetSession,
  useCompleteMorningResetSession,
  useUpdateMorningResetSession,
} from '../hooks/useMorningResetSession';
import { MorningResetHeader } from './MorningResetHeader';

const STEP_INDEX: Record<FlowStep, number> = {
  landing: 0,
  light_exposure: 1,
  stillness: 2,
  mental_reset: 3,
  movement: 4,
  cold_exposure: 5,
  nourishment: 6,
  deep_focus: 7,
};

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
  step,
  habitLabel,
  title,
  duration,
  intro,
  children,
  ctaLabel,
}: Props) {
  const router = useRouter();
  const scheme = useScheme();
  const { session, isLoading } = useActiveMorningResetSession();
  const updateSession = useUpdateMorningResetSession();
  const completeSession = useCompleteMorningResetSession();

  if (isLoading || !session) return <LoadingScreen />;

  const currentIndex = STEP_INDEX[step];
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
  const previousStep = getPreviousStep(step);

  return (
    <Screen
      variant="default"
      scroll
      header={
        <>
          <MorningResetHeader showBack={previousStep !== null} />
          <View className="items-center pb-2 pt-1">
            <ProgressDots total={7} current={currentIndex} />
          </View>
        </>
      }
      sticky={
        <GradientButton onPress={handleContinue} loading={isPending}>
          {finalCtaLabel}
        </GradientButton>
      }
      className="px-6"
    >
      <View className="mb-2 mt-4">
        <Text className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-pink">
          {habitLabel}
        </Text>
      </View>

      <View className="mb-6">
        <MaskedView
          maskElement={
            <Text className="text-5xl font-black leading-tight tracking-tight">
              {title}
            </Text>
          }
        >
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text className="text-5xl font-black leading-tight tracking-tight opacity-0">
              {title}
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>

      {duration ? (
        <View className="mb-6 flex-row">
          <View className="flex-row items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2">
            <MaterialIcons
              name="schedule"
              size={14}
              color={accentFor(scheme, 'yellow')}
            />
            <Text className="text-[11px] font-semibold uppercase tracking-widest text-foreground/70">
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
