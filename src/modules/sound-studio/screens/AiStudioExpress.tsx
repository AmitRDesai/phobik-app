import expressImg from '@/assets/images/sound-studio/express-analyzing.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useAbandonSound, useSound } from '@/hooks/sound-generation';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

// Real progress, driven by `generation_stage` from the provider webhook —
// same mapping as Express Yourself. Between stages we creep ~+10% over ~20s so
// the bar doesn't feel frozen while waiting for the next webhook.
const STAGE_PROGRESS: Record<string, number> = {
  queued: 0.1,
  text: 0.35,
  first: 0.75,
  complete: 1,
};
const STAGE_CREEP_DURATION_MS = 20_000;
const STAGE_CREEP_AMOUNT = 0.1;

export default function AiStudioExpress() {
  const router = useRouter();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: sound } = useSound(id);
  const abandonMutation = useAbandonSound();

  const stage = sound?.generationStage ?? null;
  const stageBase = stage ? (STAGE_PROGRESS[stage] ?? 0.1) : 0.1;
  const nextStageCap =
    stage === 'text'
      ? (STAGE_PROGRESS.first ?? 0.75)
      : stage === 'first'
        ? (STAGE_PROGRESS.complete ?? 1)
        : (STAGE_PROGRESS.text ?? 0.35);

  const [creep, setCreep] = useState(0);
  const stageEnteredAt = useRef<number>(Date.now());
  useEffect(() => {
    stageEnteredAt.current = Date.now();
    setCreep(0);
  }, [stage]);
  useEffect(() => {
    const tick = setInterval(() => {
      const elapsed = Date.now() - (stageEnteredAt.current ?? Date.now());
      const ratio = Math.min(1, elapsed / STAGE_CREEP_DURATION_MS);
      setCreep(ratio * STAGE_CREEP_AMOUNT);
    }, 300);
    return () => clearInterval(tick);
  }, [stage]);

  // Navigate on terminal states.
  useEffect(() => {
    if (!id) return;
    if (sound?.status === 'ready') {
      router.replace(`/sound-studio/ai/playback?id=${id}&celebrate=1`);
    }
    if (sound?.status === 'failed') {
      void dialog.error({
        title: 'Generation failed',
        message:
          sound.errorMessage ??
          'The sound could not be created. Your credits were refunded — try again.',
      });
      router.back();
    }
  }, [sound?.status, sound?.errorMessage, id, router]);

  const progress =
    sound?.status === 'ready' ? 1 : Math.min(nextStageCap, stageBase + creep);

  const handleCancel = async () => {
    if (!id) return;
    const choice = await dialog.error({
      title: 'Cancel this sound?',
      message: "We'll stop creating it and refund your credits.",
      buttons: [
        { label: 'Cancel It', value: 'confirm', variant: 'destructive' },
        { label: 'Keep Waiting', value: 'keep', variant: 'secondary' },
      ],
    });
    if (choice !== 'confirm') return;
    try {
      await abandonMutation.mutateAsync({ id });
      router.replace('/sound-studio');
    } catch {
      void dialog.error({
        title: 'Could not cancel',
        message: 'Try again in a moment.',
      });
    }
  };

  return (
    <Screen
      header={<Header variant="back" title="AI Studio" />}
      sticky={
        <Button
          variant="ghost"
          size="sm"
          onPress={handleCancel}
          loading={abandonMutation.isPending}
        >
          Cancel Generation
        </Button>
      }
      className="flex-1 px-6 pt-2"
    >
      {/* Step indicator */}
      <Badge tone="pink" size="sm" className="self-start">
        Step 3 of 3
      </Badge>

      {/* Hero copy */}
      <View className="mt-4 items-center">
        <Text weight="extrabold" className="text-[34px] leading-tight">
          Bringing
        </Text>
        <Text weight="extrabold" className="text-[34px] leading-tight">
          <Text weight="extrabold" className="text-[34px] leading-tight">
            your{' '}
          </Text>
          <GradientText className="text-[34px] font-extrabold leading-tight">
            sound
          </GradientText>
        </Text>
        <Text weight="extrabold" className="text-[34px] leading-tight">
          to life.
        </Text>
        <Text
          size="lg"
          tone="secondary"
          align="center"
          className="mt-4 max-w-[300px] leading-relaxed"
        >
          Giving your feelings a voice, so they can move, shift, and set you
          free.
        </Text>
      </View>

      {/* Analyzing wheel */}
      <View className="mt-10 items-center">
        <View
          className="size-[260px] items-center justify-center overflow-hidden rounded-full"
          style={{
            boxShadow: `0 0 40px ${withAlpha(colors.accent.yellow, 0.5)}`,
          }}
        >
          <Image
            source={expressImg}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <View className="absolute inset-0 items-center justify-center">
            <View className="size-20 items-center justify-center rounded-full border border-foreground/20 bg-surface/60">
              <MaterialIcons name="settings" size={32} color={yellow} />
            </View>
          </View>
        </View>

        {/* Status pill */}
        <AccentPill label="Analyzing" className="absolute right-2 top-4" />
      </View>

      {/* Progress */}
      <View className="mt-12">
        <View className="flex-row items-center justify-between">
          <Text size="xs" treatment="caption" tone="secondary">
            Neural-Harmonic Mapping
          </Text>
          <Text size="xs" treatment="caption" weight="bold">
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <View className="mt-2">
          <ProgressBar progress={progress} gradient size="sm" animated />
        </View>
      </View>
    </Screen>
  );
}
