import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { Slider } from '@/components/ui/Slider';
import { type AccentHue } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const TONES: AccentHue[] = ['pink', 'cyan', 'purple', 'orange', 'yellow'];

export default function SliderShowcase() {
  const [basic, setBasic] = useState(40);
  const [mood, setMood] = useState(5);
  const [breathing, setBreathing] = useState(4);
  const [opacity, setOpacity] = useState(0.5);
  const [bigStep, setBigStep] = useState(50);
  const [tonedValues, setTonedValues] = useState<Record<AccentHue, number>>({
    pink: 60,
    cyan: 40,
    purple: 50,
    orange: 30,
    yellow: 70,
    gold: 50,
  });
  const [volume, setVolume] = useState(70);
  const [intensity, setIntensity] = useState(3);

  return (
    <Screen
      variant="default"
      scroll
      header={<ShowcaseHeader title="Slider" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Continuous numeric input with drag + tap-to-seek. Auto-measures its
          track width via onLayout so callers don&apos;t need to compute it. Use
          for ranged values where the exact stop isn&apos;t critical — mood
          scales, breathing durations, volume, brightness, opacity.
        </Text>
        <Text size="sm" tone="tertiary">
          For exactly-one selection from ≤ ~5 discrete options, reach for
          SegmentedControl — it shows all choices at once. Slider is for truly
          continuous (or many-stepped) ranges.
        </Text>
      </Section>

      <Section title="Basic (0–100 default)">
        <PropRow label={`value=${basic}`}>
          <Slider value={basic} onValueChange={setBasic} />
        </PropRow>
      </Section>

      <Section title="Range + step">
        <PropRow
          label="min=1, max=10, step=1 (mood scale)"
          note="Integer values from 1 to 10."
        >
          <View className="gap-2">
            <Slider
              min={1}
              max={10}
              value={mood}
              onValueChange={setMood}
              tone="cyan"
            />
            <Text size="xs" tone="tertiary" className="font-mono">
              mood = {mood}
            </Text>
          </View>
        </PropRow>

        <PropRow
          label="min=2, max=10, step=2 (breathing seconds)"
          note="Snaps to even numbers. Use when only certain values make sense."
        >
          <View className="gap-2">
            <Slider
              min={2}
              max={10}
              step={2}
              value={breathing}
              onValueChange={setBreathing}
              tone="purple"
            />
            <Text size="xs" tone="tertiary" className="font-mono">
              breathing = {breathing}s
            </Text>
          </View>
        </PropRow>

        <PropRow
          label="min=0, max=1, step=0.1 (opacity / probability)"
          note="Fractional step for normalized 0..1 ranges."
        >
          <View className="gap-2">
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={opacity}
              onValueChange={setOpacity}
              tone="yellow"
            />
            <Text size="xs" tone="tertiary" className="font-mono">
              opacity = {opacity.toFixed(1)}
            </Text>
          </View>
        </PropRow>

        <PropRow
          label="min=0, max=100, step=25"
          note="Coarse step. Useful for percentile-style picks."
        >
          <View className="gap-2">
            <Slider
              min={0}
              max={100}
              step={25}
              value={bigStep}
              onValueChange={setBigStep}
              tone="orange"
            />
            <Text size="xs" tone="tertiary" className="font-mono">
              value = {bigStep}%
            </Text>
          </View>
        </PropRow>
      </Section>

      <Section title="Tones">
        <Text size="sm" tone="tertiary">
          Tone colors the filled track + thumb border + thumb glow.
        </Text>
        {TONES.map((tone) => (
          <PropRow key={tone} label={`tone="${tone}"`}>
            <Slider
              value={tonedValues[tone]}
              onValueChange={(v) =>
                setTonedValues((prev) => ({ ...prev, [tone]: v }))
              }
              tone={tone}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Disabled">
        <PropRow
          label="disabled"
          note="Rejects drag + tap. Renders at 40% opacity."
        >
          <Slider value={50} onValueChange={() => {}} disabled />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Volume control (icon + slider + value)"
          note="Icon at left + slider + numeric readout — the canonical settings-row volume pattern."
        >
          <Card variant="raised" size="md" className="gap-3">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="volume-up" size={20} color="#888" />
              <View className="flex-1">
                <Slider value={volume} onValueChange={setVolume} tone="cyan" />
              </View>
              <Text
                size="sm"
                weight="bold"
                className="font-mono w-10 text-right"
              >
                {volume}%
              </Text>
            </View>
          </Card>
        </PropRow>

        <PropRow
          label="Mood self-check (label + scale + endpoints)"
          note="Label above, slider, with low/high anchor text below."
        >
          <Card variant="raised" size="md" className="gap-3">
            <View className="gap-1">
              <Text size="sm" weight="semibold">
                How do you feel right now?
              </Text>
              <Text size="xs" tone="tertiary">
                Slide to where you&apos;re at.
              </Text>
            </View>
            <Slider
              min={1}
              max={10}
              value={mood}
              onValueChange={setMood}
              tone="pink"
            />
            <View className="flex-row justify-between">
              <Text size="xs" tone="tertiary">
                Low
              </Text>
              <Text size="md" weight="bold">
                {mood}
              </Text>
              <Text size="xs" tone="tertiary">
                High
              </Text>
            </View>
          </Card>
        </PropRow>

        <PropRow
          label="Practice intensity (sm range, large display value)"
          note="Headline value above the slider — makes the active value the focal point."
        >
          <Card variant="raised" size="md" className="gap-4">
            <View className="items-center gap-1">
              <Text size="xs" treatment="caption" tone="tertiary">
                INTENSITY
              </Text>
              <Text size="display" weight="black">
                {intensity}
              </Text>
            </View>
            <Slider
              min={1}
              max={5}
              value={intensity}
              onValueChange={setIntensity}
              tone="orange"
            />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using Slider for ≤ 5 discrete options"
          good="SegmentedControl shows all choices at once — fewer hidden states, faster recognition. Slider is for continuous ranges where users don't need to know every stop."
        />

        <DontRow
          bad="No readout / endpoint labels"
          good="A bare slider hides the current value and the range. Pair with a numeric readout + min/max anchors so users always know where they are."
        />

        <DontRow
          bad="Using Slider for selection from a list of categories"
          good="Sliders imply a numeric ordering. For unordered categories (color, mood label), use SelectionCard / ChipSelect."
        />

        <DontRow
          bad="Mixing step granularity with displayed precision"
          good="If step=1 (integer), don't render `5.0` — render `5`. If step=0.1, display 1 decimal. Match the format to the granularity."
        />

        <DontRow
          bad="Tiny slider track (less than ~120px wide)"
          good="Short tracks make precise dragging hard + tap-targets cramped. Give the slider room — full row width or a generous fixed minimum."
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
