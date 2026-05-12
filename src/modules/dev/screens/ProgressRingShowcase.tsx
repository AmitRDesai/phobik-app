import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { useState } from 'react';

const TONES: AccentHue[] = ['pink', 'yellow', 'cyan', 'purple', 'orange'];

export default function ProgressRingShowcase() {
  const [progress, setProgress] = useState(0.4);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="ProgressRing" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Animated SVG circular progress ring. Smoothly tweens between values
          via reanimated. Use as a hero progress visualization (grounding
          session countdown, timer rings) where a linear `ProgressBar` would be
          lost.
        </Text>
      </Section>

      <Section title="Tone (single color)">
        <View className="flex-row flex-wrap items-center justify-center gap-4">
          {TONES.map((tone) => (
            <View key={tone} className="items-center gap-2">
              <ProgressRing
                progress={0.65}
                tone={tone}
                size={120}
                strokeWidth={6}
                animated={false}
              />
              <Text size="xs" treatment="caption" tone="tertiary">
                {tone}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Gradient (brand pink→yellow)">
        <View className="items-center">
          <ProgressRing
            progress={0.65}
            gradient
            size={160}
            strokeWidth={6}
            animated={false}
          />
        </View>
      </Section>

      <Section title="Sizes + stroke">
        <View className="flex-row items-center justify-center gap-6">
          <View className="items-center gap-2">
            <ProgressRing
              progress={0.65}
              gradient
              size={64}
              strokeWidth={3}
              animated={false}
            />
            <Text size="xs" tone="tertiary">
              64 / 3
            </Text>
          </View>
          <View className="items-center gap-2">
            <ProgressRing
              progress={0.65}
              gradient
              size={120}
              strokeWidth={4}
              animated={false}
            />
            <Text size="xs" tone="tertiary">
              120 / 4
            </Text>
          </View>
          <View className="items-center gap-2">
            <ProgressRing
              progress={0.65}
              gradient
              size={180}
              strokeWidth={8}
              animated={false}
            />
            <Text size="xs" tone="tertiary">
              180 / 8
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Animated demo (1s slide)">
        <View className="items-center gap-4">
          <View className="relative items-center justify-center">
            <ProgressRing progress={progress} gradient size={200} />
            <View className="absolute items-center justify-center">
              <GradientText className="text-4xl font-extrabold">
                {`${Math.round(progress * 100)}%`}
              </GradientText>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Button
              size="sm"
              variant="secondary"
              onPress={() => setProgress(0)}
            >
              0%
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onPress={() => setProgress(0.4)}
            >
              40%
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onPress={() => setProgress(0.75)}
            >
              75%
            </Button>
            <Button size="sm" onPress={() => setProgress(1)}>
              100%
            </Button>
          </View>
        </View>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using ProgressRing for ≤ 7 discrete steps"
          good="Use `ProgressDots` (sparse) or `SegmentedProgress` (gradient segmented bar). Rings are for continuous 0..1 values."
        />
        <DontRow
          bad="Tiny rings (size < 48)"
          good="Below ~48px the ring chrome competes with its center content. Use a `ProgressBar size='sm'` instead."
        />
        <DontRow
          bad="Animated rings for high-frequency updates (audio scrubber, frame ticks)"
          good="Pass `animated={false}` for high-frequency progress. The 1s tween will lag the actual value."
        />
      </Section>
    </Screen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-3">
      <Text size="xs" treatment="caption" tone="tertiary" className="px-2">
        {title}
      </Text>
      <Card variant="raised" size="lg" className="gap-5">
        {children}
      </Card>
    </View>
  );
}

function DontRow({ bad, good }: { bad: string; good: string }) {
  return (
    <View className="gap-1 rounded-md border border-status-danger/30 bg-status-danger/[0.05] p-3">
      <Text size="xs" tone="danger" weight="bold">
        ✕ {bad}
      </Text>
      <Text size="xs" tone="success">
        ✓ {good}
      </Text>
    </View>
  );
}
