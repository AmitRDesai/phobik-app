import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const STEPS: { title: string; description: string }[] = [
  {
    title: 'Start with Setting Your Intention for the Day',
    description:
      'Starting each day by choosing your intention gives your mind direction — so instead of reacting to the day, you move through it with purpose.',
  },
  {
    title: 'Choose How You Want to Feel',
    description:
      "Choosing how you want to feel helps you step into a new state — reminding you that your emotions aren't fixed, they're something you can actively shift.",
  },
  {
    title: 'Choose Your Sound',
    description:
      "Choosing your sound helps regulate your nervous system — so your body can begin to feel the calm, focus, or energy you're creating.",
  },
  {
    title: 'EFT or Bi-Lateral Tapping',
    description:
      'We recommend EFT tapping if your nervous system is above your threshold of stress tolerance. EFT tapping helps lock in your new state — calming your body while reinforcing the thoughts and feelings you want to carry forward.',
  },
];

function GradientItalicFlow() {
  return (
    <MaskedView
      maskElement={
        <Text className="text-4xl font-black italic leading-tight tracking-tight">
          {' Flow'}
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text className="text-4xl font-black italic leading-tight tracking-tight opacity-0">
          {' Flow'}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function ChecklistGuide() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  if (isLoading || !session) return <LoadingScreen />;

  const handleContinue = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'intention',
    });
    router.push('/daily-flow/intention');
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<DailyFlowHeader wordmark />}
      sticky={
        <GradientButton
          onPress={handleContinue}
          loading={updateSession.isPending}
        >
          Get Started
        </GradientButton>
      }
      className="px-6"
    >
      <View className="mb-8 mt-2">
        <View className="flex-row flex-wrap items-baseline">
          <Text className="text-4xl font-black leading-tight tracking-tight text-foreground">
            The Daily
          </Text>
          <GradientItalicFlow />
        </View>
        <Text className="text-4xl font-black leading-tight tracking-tight text-foreground">
          Journey
        </Text>
        <Text className="mt-3 text-base leading-6 text-foreground/60">
          Small daily shifts that realign your energy, focus, and direction.
        </Text>
      </View>

      <View className="gap-4">
        {STEPS.map((s, i) => (
          <View
            key={s.title}
            className="rounded-2xl border border-foreground/5 bg-foreground/[0.04] p-6"
          >
            <View className="flex-row gap-5">
              <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-foreground/15">
                <Text className="text-sm font-bold text-foreground/60">
                  {i + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold leading-tight text-foreground">
                  {s.title}
                </Text>
                <Text className="mt-2 text-sm leading-5 text-foreground/60">
                  {s.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
