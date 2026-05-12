import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { ProgressBar, type ProgressBarSize } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { useEffect, useState } from 'react';

const SIZES: ProgressBarSize[] = ['sm', 'md', 'lg'];

const SIZE_NOTES: Record<ProgressBarSize, string> = {
  sm: '4px — inline meters, dense list rows',
  md: '6px (default) — most uses, headers, cards',
  lg: '10px — hero / primary progress (audio scrubber, upload)',
};

const TONES: AccentHue[] = ['pink', 'yellow', 'cyan', 'purple', 'orange'];

export default function ProgressBarShowcase() {
  const [progress, setProgress] = useState(0.4);
  const [autoProgress, setAutoProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setAutoProgress((p) => (p >= 1 ? 0 : p + 0.02));
    }, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <Screen
      variant="default"
      scroll
      header={<ShowcaseHeader title="ProgressBar" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Horizontal continuous progress indicator. Use for values that move
          smoothly between 0 and 100% — audio playback, file uploads, breathing
          countdowns, multi-step form completion.
        </Text>
        <Text size="sm" tone="tertiary">
          For step-based progress (1 of 5), reach for `ProgressDots` instead.
          ProgressBar is the continuous-value counterpart.
        </Text>
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <ProgressBar progress={0.65} size={size} />
          </PropRow>
        ))}
      </Section>

      <Section title="Tones">
        <Text size="sm" tone="tertiary">
          Pass `tone` to color-code the fill. Tone resolves via
          `accentFor(scheme, ...)` so the bar stays readable in both light and
          dark mode.
        </Text>
        {TONES.map((tone) => (
          <PropRow key={tone} label={`tone="${tone}"`}>
            <ProgressBar progress={0.6} tone={tone} />
          </PropRow>
        ))}
      </Section>

      <Section title="Gradient">
        <PropRow
          label="gradient (overrides tone)"
          note="Brand pink→yellow gradient fill. Use for hero / primary progress where you want extra brand presence."
        >
          <ProgressBar progress={0.5} gradient />
          <ProgressBar progress={0.75} gradient size="lg" />
        </PropRow>
      </Section>

      <Section title="Progress values">
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <PropRow key={v} label={`progress={${v}}`}>
            <ProgressBar progress={v} size="lg" gradient />
          </PropRow>
        ))}
        <PropRow
          label="Out-of-range values are clamped"
          note="progress < 0 → 0; progress > 1 → 1; NaN → 0"
        >
          <ProgressBar progress={-0.5} />
          <ProgressBar progress={1.5} />
        </PropRow>
      </Section>

      <Section title="Interactive">
        <PropRow
          label={`progress=${progress.toFixed(2)}`}
          note="Drive progress with the buttons below."
        >
          <ProgressBar progress={progress} size="lg" gradient />
          <View className="flex-row flex-wrap gap-2">
            <Button
              variant="secondary"
              size="xs"
              onPress={() => setProgress((p) => Math.max(0, p - 0.1))}
            >
              −10%
            </Button>
            <Button
              size="xs"
              onPress={() => setProgress((p) => Math.min(1, p + 0.1))}
            >
              +10%
            </Button>
            <Button variant="ghost" size="xs" onPress={() => setProgress(0)}>
              Reset
            </Button>
            <Button variant="ghost" size="xs" onPress={() => setProgress(1)}>
              Fill
            </Button>
          </View>
        </PropRow>

        <PropRow
          label="Auto-ticking demo"
          note={`progress=${autoProgress.toFixed(2)} — increments every 100ms, loops at 100%`}
        >
          <ProgressBar progress={autoProgress} size="lg" tone="cyan" />
        </PropRow>
      </Section>

      <Section title="Animated mode">
        <Text size="sm" tone="secondary">
          Pass `animated` for smooth tweened width transitions when progress
          updates infrequently (question N of M, multi-step flow completion,
          slow polling). Default is snap-to-value for high-frequency updates
          (audio scrubbers, frame ticks) where the 400ms tween would lag.
        </Text>
        <PropRow
          label="animated (jumps between 0 / 0.4 / 0.75 / 1)"
          note={`progress=${progress.toFixed(2)} — uses Easing.out(cubic), default duration 400ms`}
        >
          <ProgressBar progress={progress} gradient animated />
        </PropRow>
        <PropRow
          label="animated + animationDuration={1500}"
          note="Slower 1.5s slide. Use sparingly — long animations on each update feel sluggish."
        >
          <ProgressBar
            progress={progress}
            gradient
            animated
            animationDuration={1500}
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="File upload (label + percent + bar)"
          note="The label/percent live above the bar; the bar takes the full width."
        >
          <View className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text size="sm" weight="semibold">
                Syncing journal…
              </Text>
              <Text size="sm" tone="secondary">
                {Math.round(autoProgress * 100)}%
              </Text>
            </View>
            <ProgressBar progress={autoProgress} gradient />
          </View>
        </PropRow>

        <PropRow
          label="Audio scrubber (lg + gradient, current/total timestamps)"
          note="Pair the bar with elapsed/total time. Drag-to-seek is a caller responsibility (wrap in a Pressable / Gesture)."
        >
          <View className="gap-2">
            <ProgressBar progress={progress} size="lg" gradient />
            <View className="flex-row items-center justify-between">
              <Text size="xs" tone="tertiary" className="font-mono">
                {formatTime(progress * 240)}
              </Text>
              <Text size="xs" tone="tertiary" className="font-mono">
                {formatTime(240)}
              </Text>
            </View>
          </View>
        </PropRow>

        <PropRow
          label="Multi-step form (sm + neutral)"
          note="Step-based flows can use a continuous bar when the step count is large (≥ 6) — ProgressDots gets crowded past 10."
        >
          <View className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text size="xs" tone="tertiary">
                Step 7 of 12
              </Text>
              <Text size="xs" tone="tertiary">
                58%
              </Text>
            </View>
            <ProgressBar progress={7 / 12} size="sm" />
          </View>
        </PropRow>

        <PropRow label="Inline meter (xs height inside a card row)">
          <Card variant="raised" size="md" className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text size="sm" weight="semibold">
                Daily reflection
              </Text>
              <Text size="xs" tone="secondary">
                3 / 7 days
              </Text>
            </View>
            <ProgressBar progress={3 / 7} size="sm" tone="cyan" />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="ProgressBar for step-based progress with few steps (e.g. step 1 of 3)"
          good="Use ProgressDots — discrete steps are clearer when the count is small (≤ 5)."
        >
          <ProgressBar progress={1 / 3} size="md" />
        </DontRow>

        <DontRow
          bad="Both `tone` and `gradient` set together"
          good="They're mutually exclusive — gradient wins. Pick one to make the intent explicit."
        >
          <ProgressBar progress={0.5} tone="cyan" gradient />
        </DontRow>

        <DontRow
          bad="`size=sm` for primary progress (audio scrubber, upload)"
          good="Hero progress should be `lg` — small bars look like loading hints, not active work."
        >
          <ProgressBar progress={0.5} size="sm" gradient />
        </DontRow>

        <DontRow
          bad="Bare bar with no label / percent"
          good="Progress without context is anxiety-inducing. Always pair with a label and (ideally) a percent or count."
        >
          <ProgressBar progress={0.5} />
        </DontRow>
      </Section>
    </Screen>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, '0')}`;
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
