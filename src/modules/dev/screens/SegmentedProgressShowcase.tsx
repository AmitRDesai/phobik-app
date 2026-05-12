import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SegmentedProgress } from '@/components/ui/SegmentedProgress';
import { useState } from 'react';

export default function SegmentedProgressShowcase() {
  const [step, setStep] = useState(3);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="SegmentedProgress" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Segmented gradient progress bar for step-flow progression. The first
          `completed` segments share one continuous brand gradient (pink →
          warm-orange → yellow), and the remaining segments are neutral
          `foreground/10` hairlines.
        </Text>
        <Text size="sm" tone="tertiary">
          Choose vs. neighbors: `ProgressBar` for continuous values (audio
          scrub, upload %); `ProgressDots` for sparse indicator dots ≤ 10;
          `SegmentedProgress` when each step is a discrete chunk of the flow
          (onboarding, micro-challenge progression).
        </Text>
      </Section>

      <Section title="Coverage">
        <PropRow label="completed=0 / 8 (none)">
          <SegmentedProgress total={8} completed={0} />
        </PropRow>
        <PropRow label="completed=1 / 8 (start)">
          <SegmentedProgress total={8} completed={1} />
        </PropRow>
        <PropRow label="completed=4 / 8 (half)">
          <SegmentedProgress total={8} completed={4} />
        </PropRow>
        <PropRow label="completed=8 / 8 (done)">
          <SegmentedProgress total={8} completed={8} />
        </PropRow>
      </Section>

      <Section title="Sizes">
        <PropRow label='size="sm" (4px)'>
          <SegmentedProgress size="sm" total={8} completed={4} />
        </PropRow>
        <PropRow label='size="md" — default (5px)'>
          <SegmentedProgress total={8} completed={4} />
        </PropRow>
      </Section>

      <Section title="Different totals">
        <PropRow label="total=3 completed=1">
          <SegmentedProgress total={3} completed={1} />
        </PropRow>
        <PropRow label="total=5 completed=3">
          <SegmentedProgress total={5} completed={3} />
        </PropRow>
        <PropRow label="total=12 completed=7">
          <SegmentedProgress total={12} completed={7} />
        </PropRow>
      </Section>

      <Section title="Interactive demo">
        <View className="gap-4">
          <SegmentedProgress total={8} completed={step} />
          <View className="flex-row items-center justify-between">
            <Button
              size="sm"
              variant="secondary"
              onPress={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            <Text size="sm" tone="secondary">
              Step {step} / 8
            </Text>
            <Button
              size="sm"
              onPress={() => setStep((s) => Math.min(8, s + 1))}
            >
              Next
            </Button>
          </View>
        </View>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using SegmentedProgress for continuous values (audio playback, upload)"
          good="Use `ProgressBar` for any 0..1 continuous progress. SegmentedProgress is for discrete-step flows where the segments are meaningful chunks."
        />
        <DontRow
          bad="total > 12"
          good="Past ~12 segments each segment becomes a hairline; switch to `ProgressBar` (continuous) with a separate `N of M` counter label."
        />
        <DontRow
          bad="completed > total"
          good="Clamped internally; meaningless visually. Pass valid values."
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

function PropRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text size="xs" tone="tertiary" className="font-mono">
        {label}
      </Text>
      {children}
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
