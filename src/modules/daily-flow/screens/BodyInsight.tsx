import { Pressable } from '@/components/themed/Pressable';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  buildAnalysisResult,
  totalFlowSeconds,
} from '../data/flowRecommendations';
import type { AnalysisResult } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

type Feedback = 'yes' | 'no';

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

export default function BodyInsight() {
  const router = useRouter();
  const scheme = useScheme();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const analysis: AnalysisResult =
    session?.analysisResult ??
    buildAnalysisResult(session?.timeOption ?? 'balanced_flow');

  const showLoading = isLoading || !session;

  const handleStart = async () => {
    if (!session) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'player',
    });
    router.push('/daily-flow/player');
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
          loading={updateSession.isPending}
          fullWidth
        >
          Start Practice
        </Button>
      }
      contentClassName="gap-6 pb-4"
    >
      <View className="gap-3">
        <Text size="xs" treatment="caption" weight="bold" tone="accent">
          Analysis Complete
        </Text>
        <Text size="h1" weight="bold">
          Here&apos;s what we&apos;re noticing…
        </Text>
        <View className="flex-row">
          <AccentPill
            label={analysis.theme}
            variant="solid"
            tone="yellow"
            size="md"
          />
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {analysis.observations.map((obs) => (
          <Card
            key={obs.title}
            variant="flat"
            size="md"
            className="min-w-[48%] flex-1 gap-3"
          >
            <IconChip size="sm" shape="rounded" tone="pink">
              {(color) => (
                <Ionicons name={obs.icon as never} size={16} color={color} />
              )}
            </IconChip>
            <Text size="md" weight="bold">
              {obs.title}
            </Text>
            <Text size="xs" tone="secondary">
              {obs.description}
            </Text>
          </Card>
        ))}
      </View>

      <View className="gap-3">
        <View className="flex-row items-baseline justify-between">
          <Text size="h3" weight="bold">
            Your {formatDuration(totalFlowSeconds(analysis.flow))} Flow
          </Text>
          <Text size="xs" treatment="caption" weight="bold" tone="secondary">
            Recommended for now
          </Text>
        </View>
        <View className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
          {analysis.flow.map((step, i) => {
            const minutes = Math.round(step.durationSeconds / 60);
            const durationLabel =
              minutes > 0 ? `${minutes}m` : `${step.durationSeconds}s`;
            const [phase, practice] = step.label.split(' · ');
            return (
              <View
                key={step.id}
                className={clsx(
                  'flex-row items-center gap-3 px-4 py-3',
                  i > 0 && 'border-t border-foreground/5',
                )}
              >
                <IconChip size="sm" shape="circle" tone="pink">
                  <Text size="xs" weight="bold" tone="accent">
                    {i + 1}
                  </Text>
                </IconChip>
                <View className="flex-1">
                  <Text
                    size="xs"
                    treatment="caption"
                    weight="bold"
                    tone="secondary"
                  >
                    {phase} · {durationLabel}
                  </Text>
                  <Text size="md" weight="bold" className="mt-1">
                    {practice ?? step.label}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={foregroundFor(scheme, 0.45)}
                />
              </View>
            );
          })}
        </View>
      </View>

      <Card variant="raised" size="md" className="items-center gap-3">
        <Text size="md" weight="bold">
          Does this feel accurate?
        </Text>
        <Text size="xs" tone="secondary" align="center">
          Help Phobik learn your unique body signals to improve future flows.
        </Text>
        <View className="mt-1 w-full flex-row gap-3">
          <Pressable
            onPress={() => setFeedback('yes')}
            className="flex-1 active:opacity-80"
            accessibilityRole="button"
            accessibilityState={{ selected: feedback === 'yes' }}
            accessibilityLabel="Yes, this feels accurate"
          >
            <View
              className={clsx(
                'items-center rounded-full border py-2.5',
                feedback === 'yes'
                  ? 'border-primary-pink bg-primary-pink/15'
                  : 'border-foreground/10',
              )}
            >
              <Text
                size="sm"
                weight="bold"
                tone={feedback === 'yes' ? 'accent' : 'primary'}
              >
                Yes
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setFeedback('no')}
            className="flex-1 active:opacity-80"
            accessibilityRole="button"
            accessibilityState={{ selected: feedback === 'no' }}
            accessibilityLabel="No, this does not feel accurate"
          >
            <View
              className={clsx(
                'items-center rounded-full border py-2.5',
                feedback === 'no'
                  ? 'border-primary-pink bg-primary-pink/15'
                  : 'border-foreground/10',
              )}
            >
              <Text
                size="sm"
                weight="bold"
                tone={feedback === 'no' ? 'accent' : 'primary'}
              >
                No
              </Text>
            </View>
          </Pressable>
        </View>
      </Card>
    </Screen>
  );
}
