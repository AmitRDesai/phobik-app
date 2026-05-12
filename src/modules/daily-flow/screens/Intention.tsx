import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Pressable, useWindowDimensions } from 'react-native';

import {
  INTENTIONS,
  type Intention as IntentionData,
} from '../data/affirmations';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function Intention() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.floor(Math.random() * INTENTIONS.length),
  );
  const { height: screenHeight } = useWindowDimensions();
  const cardHeight = Math.max(280, Math.min(420, screenHeight * 0.45));

  const pickRandom = useCallback(() => {
    if (INTENTIONS.length <= 1) return;
    setActiveIndex((current) => {
      let next = Math.floor(Math.random() * INTENTIONS.length);
      if (next === current) next = (next + 1) % INTENTIONS.length;
      return next;
    });
  }, []);

  if (isLoading || !session) return <LoadingScreen />;

  const handleContinue = async () => {
    const chosen = INTENTIONS[activeIndex];
    if (!chosen) return;
    await updateSession.mutateAsync({
      id: session.id,
      intention: chosen.text,
      currentStep: 'detailed_feeling',
    });
    router.push('/daily-flow/detailed-feeling');
  };

  return (
    <Screen
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button
            onPress={handleContinue}
            loading={updateSession.isPending}
            fullWidth
          >
            Next
          </Button>
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="mt-4 tracking-[0.2em] text-foreground/45"
          >
            Tap shuffle for a new anchor
          </Text>
        </View>
      }
      className=""
    >
      <View className="px-6">
        <View className="flex-row items-end justify-between">
          <View className="flex-1">
            <Text
              size="xs"
              treatment="caption"
              tone="accent"
              weight="bold"
              className="tracking-[0.3em]"
              style={{ paddingRight: 3.3 }}
            >
              Step 01
            </Text>
            <View className="mt-2 flex-row flex-wrap items-baseline">
              <Text size="h1" weight="black" className="leading-tight">
                Start with your{' '}
              </Text>
              <GradientText className="text-3xl font-black leading-tight">
                intention
              </GradientText>
            </View>
          </View>
          <Text size="sm" tone="secondary" className="pb-1">
            0% Complete
          </Text>
        </View>

        <View className="mt-4">
          <ProgressBar progress={0.02} gradient />
        </View>

        <Text size="lg" className="mt-5 leading-6 text-foreground/65">
          Hold this in your mind as you begin your shift.
        </Text>
      </View>

      <View className="flex-1 justify-center px-6 pt-4">
        <IntentionCard
          item={INTENTIONS[activeIndex]!}
          height={cardHeight}
          onShuffle={pickRandom}
        />
      </View>
    </Screen>
  );
}

function IntentionCard({
  item,
  height,
  onShuffle,
}: {
  item: IntentionData;
  height: number;
  onShuffle: () => void;
}) {
  return (
    <View
      style={{
        height,
        boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.2)}`,
      }}
      className="relative justify-end overflow-hidden rounded-3xl border-2 border-primary-pink/60 bg-foreground/[0.06] p-10"
    >
      <View className="absolute right-6 top-6" pointerEvents="none">
        <MaterialIcons
          name={item.icon as keyof typeof MaterialIcons.glyphMap}
          size={100}
          color={colors.primary.pink}
          style={{ opacity: 0.2 }}
        />
      </View>

      <IconChip
        shape="circle"
        onPress={onShuffle}
        accessibilityLabel="Shuffle intention"
        className="absolute right-6 top-6"
      >
        <MaterialIcons name="refresh" size={18} color={colors.primary.pink} />
      </IconChip>

      <Text size="h1" className="leading-tight">
        {item.text}
      </Text>

      <View className="mt-5 h-1 w-12 overflow-hidden rounded-full">
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
