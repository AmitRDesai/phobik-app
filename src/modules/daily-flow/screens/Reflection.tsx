import reflectionWaveform from '@/assets/images/daily-flow/reflection-waveform.png';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { Slider } from '@/components/ui/Slider';
import { TextArea } from '@/components/ui/TextArea';
import { colors, withAlpha } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image } from 'react-native';

import { exitDailyFlow, isTodayLocal } from '../data/flow-navigation';
import type { EffectRating } from '../data/types';
import {
  useActiveDailyFlowSession,
  useCompleteDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const RATING_LABELS: { value: number; label: string; rating: EffectRating }[] =
  [
    { value: 0, label: 'Worse', rating: 'worse' },
    { value: 1, label: 'Same', rating: 'same' },
    { value: 2, label: 'Better', rating: 'better' },
  ];

export default function Reflection() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const completeSession = useCompleteDailyFlowSession();
  const [rating, setRating] = useState<number>(1);
  const [reflectionText, setReflectionText] = useState<string>('');

  const showLoading = isLoading || !session;
  const isResumed = !!session?.startedAt && !isTodayLocal(session.startedAt);

  const handleComplete = async () => {
    if (!session || isResumed) return;
    const effectRating =
      RATING_LABELS.find((r) => r.value === rating)?.rating ?? 'same';
    await completeSession.mutateAsync({
      id: session.id,
      effectRating,
      reflectionText,
    });
    exitDailyFlow(router);
  };

  return (
    <Screen
      loading={showLoading}
      scroll
      transparent
      insetTop={false}
      sticky={
        <Button
          onPress={handleComplete}
          loading={completeSession.isPending}
          disabled={isResumed}
          fullWidth
        >
          Complete Check-In
        </Button>
      }
      contentClassName="gap-6 pb-4"
    >
      <View className="items-center gap-2">
        <GradientText className="text-[28px] font-extrabold leading-[34px]">
          What shifted?
        </GradientText>
        <Text size="sm" tone="secondary" align="center">
          Take a moment to observe the resonance of your practice.
        </Text>
      </View>

      <View
        className="aspect-[16/10] w-full overflow-hidden rounded-3xl border border-foreground/10"
        style={{
          boxShadow: `0 0 40px ${withAlpha(colors.primary.pink, 0.25)}`,
        }}
      >
        <Image
          source={reflectionWaveform}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          accessibilityLabel="Sonic organism waveform"
          className="h-full w-full"
        />
      </View>

      <Card variant="raised" size="lg" className="gap-3">
        <View className="flex-row justify-between">
          {RATING_LABELS.map((r) => (
            <Text
              key={r.value}
              size="xs"
              treatment="caption"
              weight="bold"
              tone={rating === r.value ? 'accent' : 'secondary'}
            >
              {r.label}
            </Text>
          ))}
        </View>
        <Slider
          value={rating}
          min={0}
          max={2}
          step={1}
          onValueChange={setRating}
          tone="pink"
        />
      </Card>

      <TextArea
        label="What do you notice now?"
        labelUppercase
        placeholder="Describe the sensations or thoughts that are present…"
        value={reflectionText}
        onChangeText={setReflectionText}
        rows="sm"
        variant="filled"
      />
    </Screen>
  );
}
