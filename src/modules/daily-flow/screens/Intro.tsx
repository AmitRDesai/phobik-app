import introEnergyOrb from '@/assets/images/daily-flow/intro-energy-orb.png';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { ChipSelect, type ChipOption } from '@/components/ui/ChipSelect';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

import { TIME_OPTIONS } from '../data/timeOptions';
import type { TimeOptionId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const TIME_CHIP_OPTIONS: ChipOption<TimeOptionId>[] = TIME_OPTIONS.map((t) => ({
  label: t.label,
  value: t.id,
  icon: (color: string) => <Ionicons name={t.icon} size={12} color={color} />,
}));

export default function Intro() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const options = TIME_CHIP_OPTIONS;

  const selected = session?.timeOption ?? null;
  const showLoading = isLoading || !session;

  const handleStart = async () => {
    if (!session || !selected) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'feeling',
    });
    router.push('/daily-flow/feeling');
  };

  return (
    <Screen
      loading={showLoading}
      scroll
      transparent
      insetTop={false}
      sticky={
        <Button
          onPress={handleStart}
          disabled={!selected}
          loading={updateSession.isPending}
          fullWidth
        >
          Start Check-In
        </Button>
      }
      contentClassName="gap-8 items-center pb-4"
    >
      <View className="items-center">
        <GradientText className="text-[36px] font-extrabold leading-[40px]">
          DAILY FLOW
        </GradientText>
        <Text size="sm" tone="secondary" align="center" className="mt-2">
          Your emotions and body signals can help guide what your mind and body
          may need today.
        </Text>
      </View>

      <Image
        source={introEnergyOrb}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
        accessibilityLabel="Vibrant energy pulse core"
        className="my-2 size-72"
      />

      <View className="w-full items-center gap-3">
        <Text size="h3" weight="bold" align="center">
          How much time can you give yourself today?
        </Text>
        <Text size="sm" tone="secondary" align="center">
          Your Daily Flow will adapt to fit your schedule.
        </Text>
      </View>

      <ChipSelect
        options={options}
        value={selected ? [selected] : []}
        onChange={async (next) => {
          if (!session) return;
          await updateSession.mutateAsync({
            id: session.id,
            timeOption: next[0] ?? null,
          });
        }}
        multi={false}
        variant="tinted"
        layout="wrap"
        className="justify-center"
      />

      <Text size="xs" tone="tertiary" align="center" italic>
        Meet yourself exactly where you are.
      </Text>
    </Screen>
  );
}
