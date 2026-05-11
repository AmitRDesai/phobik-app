import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { useState } from 'react';

export default function ProgressDotsShowcase() {
  const [step, setStep] = useState(3);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="ProgressDots" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Step indicator — N dots with the active one drawn wider in brand pink,
          inactive dots in `foreground/20`. Use inside the Header for multi-step
          flows so the progress lives in the chrome instead of competing with
          body content.
        </Text>
        <Text size="sm" tone="tertiary">
          API is intentionally minimal: just `total` and `current` (1-indexed).
        </Text>
      </Section>

      <Section title="Total dot counts">
        <PropRow label="total=3, current=2">
          <Center>
            <ProgressDots total={3} current={2} />
          </Center>
        </PropRow>
        <PropRow label="total=5, current=3 (sweet spot)">
          <Center>
            <ProgressDots total={5} current={3} />
          </Center>
        </PropRow>
        <PropRow label="total=7, current=4">
          <Center>
            <ProgressDots total={7} current={4} />
          </Center>
        </PropRow>
        <PropRow
          label="total=10, current=5 (upper bound)"
          note="Past 10 dots, the row gets crowded — switch to a numeric counter (`Step 5 of 12`)."
        >
          <Center>
            <ProgressDots total={10} current={5} />
          </Center>
        </PropRow>
      </Section>

      <Section title="Current position">
        <PropRow label="current=1 (first)">
          <Center>
            <ProgressDots total={5} current={1} />
          </Center>
        </PropRow>
        <PropRow label="current=5 (last)">
          <Center>
            <ProgressDots total={5} current={5} />
          </Center>
        </PropRow>
        <PropRow
          label="Interactive prev/next"
          note={`current=${step}/5 — controls below`}
        >
          <Center>
            <ProgressDots total={5} current={step} />
          </Center>
          <View className="flex-row justify-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              onPress={() => setStep((s) => Math.max(1, s - 1))}
            >
              Prev
            </Button>
            <Button
              size="xs"
              onPress={() => setStep((s) => Math.min(5, s + 1))}
            >
              Next
            </Button>
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Inside Header (canonical use)"
          note="Pass `progress={{ current, total }}` to Header — it renders ProgressDots in the chrome below the title row."
        >
          <View className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
            <Header variant="wordmark" progress={{ current: step, total: 5 }} />
          </View>
        </PropRow>

        <PropRow
          label="Above a question card (no header)"
          note="Acceptable when the question takes the full Screen body and there's no header strip available."
        >
          <View className="items-center gap-3">
            <ProgressDots total={5} current={3} />
            <Card variant="raised" size="md" className="w-full gap-2">
              <Text size="md" weight="bold">
                What brings you here today?
              </Text>
              <Text size="sm" tone="secondary">
                Pick the option that resonates most.
              </Text>
            </Card>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="total=1 (no progress to show)"
          good="A single-step flow doesn't need a progress indicator. Drop the dots."
        >
          <Center>
            <ProgressDots total={1} current={1} />
          </Center>
        </DontRow>

        <DontRow
          bad="More than ~10 dots"
          good="Switch to a numeric counter (Step 5 of 12) — the dots become unreadable."
        >
          <Center>
            <ProgressDots total={15} current={7} />
          </Center>
        </DontRow>

        <DontRow
          bad="Hardcoded current=0 (no active dot)"
          good="current is 1-indexed. current=0 means nothing's active — confusing for users mid-flow."
        >
          <Center>
            <ProgressDots total={5} current={0} />
          </Center>
        </DontRow>

        <DontRow
          bad="Rendering twice on the same screen"
          good="One ProgressDots strip per flow. Two competes for attention and confuses which step the user is on."
        >
          <View className="items-center gap-3">
            <ProgressDots total={5} current={3} />
            <ProgressDots total={5} current={3} />
          </View>
        </DontRow>
      </Section>
    </Screen>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <View className="items-center">{children}</View>;
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
  note,
  children,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text size="xs" tone="tertiary" className="font-mono">
        {label}
      </Text>
      {note ? (
        <Text size="xs" tone="disabled">
          {note}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function DontRow({
  bad,
  good,
  children,
}: {
  bad: string;
  good: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2 rounded-md border border-status-danger/30 bg-status-danger/[0.05] p-3">
      <Text size="xs" tone="danger" weight="bold">
        ✕ {bad}
      </Text>
      {children}
      <Text size="xs" tone="success">
        ✓ {good}
      </Text>
    </View>
  );
}
