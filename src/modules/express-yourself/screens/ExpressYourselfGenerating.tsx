import sonicLoveSphereImg from '@/assets/images/express-yourself/sonic-love-sphere.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { STATUS_STEPS } from '../data/express-yourself';
import { useAbandonSong } from '../hooks/useAbandonSong';
import { useSong } from '../hooks/useSong';

/** Real progress, driven by `generation_stage` from the provider webhook:
 *    null  → 0.10 (just kicked off; show some motion so the bar isn't empty)
 *    text  → 0.35 (lyrics generated)
 *    first → 0.75 (first audio track ready)
 *    complete / status=ready → 1.0
 *  Between stages we creep ~+10% over ~20s so the bar doesn't feel frozen.
 */
const STAGE_PROGRESS: Record<string, number> = {
  queued: 0.1,
  text: 0.35,
  first: 0.75,
  complete: 1,
};
const STAGE_CREEP_DURATION_MS = 20_000;
const STAGE_CREEP_AMOUNT = 0.1;

export default function ExpressYourselfGenerating() {
  const router = useRouter();
  const scheme = useScheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: song } = useSong(id);
  const abandonMutation = useAbandonSong();

  const handleCancel = async () => {
    if (!id) return;
    const choice = await dialog.error({
      title: 'Cancel this song?',
      message: "We'll stop creating it. Any progress made so far will be lost.",
      buttons: [
        { label: 'Cancel It', value: 'confirm', variant: 'destructive' },
        { label: 'Keep Waiting', value: 'keep', variant: 'secondary' },
      ],
    });
    if (choice !== 'confirm') return;
    try {
      await abandonMutation.mutateAsync({ id });
      router.replace('/practices/express-yourself');
    } catch {
      void dialog.error({
        title: 'Could not cancel',
        message: 'Try again in a moment.',
      });
    }
  };

  const stage = song?.generationStage ?? null;
  const stageBase = stage ? (STAGE_PROGRESS[stage] ?? 0.1) : 0.1;
  const nextStageCap =
    stage === 'text'
      ? (STAGE_PROGRESS.first ?? 0.75)
      : stage === 'first'
        ? (STAGE_PROGRESS.complete ?? 1)
        : (STAGE_PROGRESS.text ?? 0.35);

  // Creep the bar a little within each stage so it doesn't visibly freeze
  // while we wait for the next webhook. Resets every time the stage changes.
  const [creep, setCreep] = useState(0);
  const stageEnteredAt = useRef(Date.now());
  useEffect(() => {
    stageEnteredAt.current = Date.now();
    setCreep(0);
  }, [stage]);
  useEffect(() => {
    const tick = setInterval(() => {
      const elapsed = Date.now() - stageEnteredAt.current;
      const ratio = Math.min(1, elapsed / STAGE_CREEP_DURATION_MS);
      setCreep(ratio * STAGE_CREEP_AMOUNT);
    }, 300);
    return () => clearInterval(tick);
  }, [stage]);

  // Navigate when ready
  useEffect(() => {
    if (song?.status === 'ready' && id) {
      // `celebrate=1` tells the Ready screen this is a fresh-from-generation
      // arrival — Library/Recent revisits leave it off and skip the
      // celebratory heading.
      router.replace(`/practices/express-yourself/ready/${id}?celebrate=1`);
    }
    if (song?.status === 'failed') {
      void dialog.error({
        title: 'Generation failed',
        message:
          song.errorMessage ?? 'The song could not be created. Try again.',
      });
      router.back();
    }
  }, [song?.status, song?.errorMessage, id, router]);

  const progress =
    song?.status === 'ready' ? 1 : Math.min(nextStageCap, stageBase + creep);
  const activeStep = progress < 0.35 ? 0 : progress < 0.75 ? 1 : 2;

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          variant="back"
          title="Creating Your Song"
          progress={{ current: 2, total: 3 }}
        />
      }
      sticky={
        <View className="gap-2 pb-4">
          <View className="flex-row items-center justify-between">
            <Text size="xs" treatment="caption" tone="secondary">
              Generation Progress
            </Text>
            <Text
              size="xs"
              treatment="caption"
              style={{ color: colors.primary.pink }}
            >
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <ProgressBar progress={progress} gradient size="md" animated />
        </View>
      }
      contentClassName="gap-6 pb-6"
    >
      <View>
        <GradientText className="text-[40px] font-bold leading-tight">
          Creating
        </GradientText>
        <Text size="display" weight="bold">
          Your Song
        </Text>
      </View>
      <Text size="md" tone="secondary">
        Your inner experience reflected back to you through sound.
      </Text>

      {song?.prompt ? (
        <Card variant="raised" tone="pink" size="md">
          <Text size="xs" treatment="caption" tone="accent">
            Input Analysis
          </Text>
          <Text size="sm" italic tone="body" numberOfLines={6}>
            “{song.prompt}”
          </Text>
        </Card>
      ) : null}

      {song?.style ? (
        <Card variant="raised" tone="yellow" size="md">
          <Text size="xs" treatment="caption" tone="accent">
            Music Style & Preferences
          </Text>
          <Text size="sm" tone="body">
            {song.style}
          </Text>
        </Card>
      ) : null}

      <View className="items-center py-2">
        <View
          className="overflow-hidden rounded-full border border-foreground/10"
          style={{
            width: 240,
            height: 240,
            boxShadow: `0 0 60px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <Image
            source={sonicLoveSphereImg}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
      </View>

      <View className="gap-3">
        {STATUS_STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <View key={step.id} className="flex-row items-center gap-3">
              {done ? (
                <IconChip size="sm" shape="circle" tone="pink">
                  {(c) => <MaterialIcons name="check" size={16} color={c} />}
                </IconChip>
              ) : active ? (
                <IconChip size="sm" shape="circle" tone="pink">
                  {() => (
                    <MaterialIcons
                      name="auto-awesome"
                      size={16}
                      color={accentFor(scheme, 'pink')}
                    />
                  )}
                </IconChip>
              ) : (
                <IconChip size="sm" shape="circle">
                  {() => (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: foregroundFor(scheme, 0.3),
                      }}
                    />
                  )}
                </IconChip>
              )}
              <Text
                size="sm"
                tone={active ? 'primary' : done ? 'secondary' : 'tertiary'}
                weight={active ? 'semibold' : 'normal'}
              >
                {step.label}
                {active ? '…' : ''}
              </Text>
            </View>
          );
        })}
      </View>

      {song?.status === 'failed' ? (
        <Button variant="secondary" onPress={() => router.back()}>
          Try Again
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onPress={handleCancel}
          loading={abandonMutation.isPending}
        >
          Cancel Generation
        </Button>
      )}
    </Screen>
  );
}
