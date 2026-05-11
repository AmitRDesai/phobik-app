import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import {
  SegmentedControl,
  type SegmentedControlVariant,
} from '@/components/ui/SegmentedControl';
import { useState } from 'react';

type Tone = 'all' | 'positive' | 'negative';
type Range = 'today' | 'week' | 'month' | 'year';
type View5 = 'a' | 'b' | 'c' | 'd' | 'e';

const VARIANTS: SegmentedControlVariant[] = ['gradient', 'tinted'];

const VARIANT_NOTES: Record<SegmentedControlVariant, string> = {
  gradient:
    'Pink→yellow brand gradient + soft pink glow (default). Loud — use for primary mode switches (Me vs. Community).',
  tinted:
    "Quiet foreground/10 fill + foreground text. Use for tertiary scope filters above charts/lists where the control shouldn't compete with content.",
};

export default function SegmentedControlShowcase() {
  const [binary, setBinary] = useState<'on' | 'off'>('on');
  const [tone, setTone] = useState<Tone>('all');
  const [range, setRange] = useState<Range>('week');
  const [crammed, setCrammed] = useState<View5>('a');
  const [longLabels, setLongLabels] = useState<
    'reflections' | 'practices' | 'highlights'
  >('reflections');
  const [unselected, setUnselected] = useState<Tone | null>(null);
  const [pattern1, setPattern1] = useState<'me' | 'community'>('me');
  const [pattern2, setPattern2] = useState<Range>('week');
  const [variantGradient, setVariantGradient] = useState<Tone>('all');
  const [variantTinted, setVariantTinted] = useState<Tone>('all');
  const [chartRange, setChartRange] = useState<Range>('week');

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="SegmentedControl" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          A horizontal pill row for picking one of N short options. Use for view
          switching (timeframe, scope) where the option set is stable and 2–4
          wide.
        </Text>
        <Text size="sm" tone="tertiary">
          Generic over the value type — `options: {`{ label, value }`}[]` so you
          keep type-safe values like `'today' | 'week' | 'month'`.
        </Text>
      </Section>

      <Section title="Variants">
        {VARIANTS.map((v) => (
          <PropRow key={v} label={`variant="${v}"`} note={VARIANT_NOTES[v]}>
            <SegmentedControl
              variant={v}
              options={[
                { label: 'All', value: 'all' },
                { label: 'Positive', value: 'positive' },
                { label: 'Negative', value: 'negative' },
              ]}
              selected={v === 'gradient' ? variantGradient : variantTinted}
              onSelect={
                v === 'gradient' ? setVariantGradient : setVariantTinted
              }
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Option count">
        <PropRow label="2 options (binary toggle)">
          <SegmentedControl
            options={[
              { label: 'On', value: 'on' },
              { label: 'Off', value: 'off' },
            ]}
            selected={binary}
            onSelect={setBinary}
          />
        </PropRow>

        <PropRow label="3 options (default sweet spot)">
          <SegmentedControl
            options={[
              { label: 'All', value: 'all' },
              { label: 'Positive', value: 'positive' },
              { label: 'Negative', value: 'negative' },
            ]}
            selected={tone}
            onSelect={setTone}
          />
        </PropRow>

        <PropRow
          label="4 options (upper bound)"
          note="At 4 options labels start feeling cramped on smaller phones — keep labels ≤ 6 chars."
        >
          <SegmentedControl
            options={[
              { label: 'Today', value: 'today' },
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
            ]}
            selected={range}
            onSelect={setRange}
          />
        </PropRow>

        <PropRow
          label="5 options (anti-pattern)"
          note="Too cramped — reach for a scrollable chip row or a dropdown instead."
        >
          <SegmentedControl
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd' },
              { label: 'E', value: 'e' },
            ]}
            selected={crammed}
            onSelect={setCrammed}
          />
        </PropRow>
      </Section>

      <Section title="Selection states">
        <PropRow
          label="selected={null}"
          note="No option starts active — first tap chooses. Useful for filters that default to 'no filter applied'."
        >
          <SegmentedControl
            options={[
              { label: 'All', value: 'all' },
              { label: 'Positive', value: 'positive' },
              { label: 'Negative', value: 'negative' },
            ]}
            selected={unselected}
            onSelect={setUnselected}
          />
        </PropRow>

        <PropRow
          label="Long labels"
          note="Labels truncate visually but stay readable up to ~10 chars at 3-wide."
        >
          <SegmentedControl
            options={[
              { label: 'Reflections', value: 'reflections' },
              { label: 'Practices', value: 'practices' },
              { label: 'Highlights', value: 'highlights' },
            ]}
            selected={longLabels}
            onSelect={setLongLabels}
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="View scope (Me / Community)">
          <View className="gap-2">
            <SegmentedControl
              options={[
                { label: 'Me', value: 'me' },
                { label: 'Community', value: 'community' },
              ]}
              selected={pattern1}
              onSelect={setPattern1}
            />
            <Text size="xs" tone="tertiary">
              Currently showing: <Text weight="bold">{pattern1}</Text>
            </Text>
          </View>
        </PropRow>

        <PropRow label="Time range filter (Today / Week / Month / Year)">
          <View className="gap-2">
            <SegmentedControl
              options={[
                { label: 'Today', value: 'today' },
                { label: 'Week', value: 'week' },
                { label: 'Month', value: 'month' },
                { label: 'Year', value: 'year' },
              ]}
              selected={pattern2}
              onSelect={setPattern2}
            />
            <Text size="xs" tone="tertiary">
              Range: <Text weight="bold">{pattern2}</Text>
            </Text>
          </View>
        </PropRow>

        <PropRow
          label="Inline above a chart (tinted)"
          note="Tinted active pill keeps focus on the chart instead of the control."
        >
          <Card variant="raised" size="md" className="gap-3">
            <SegmentedControl
              variant="tinted"
              options={[
                { label: 'Today', value: 'today' },
                { label: 'Week', value: 'week' },
                { label: 'Month', value: 'month' },
                { label: 'Year', value: 'year' },
              ]}
              selected={chartRange}
              onSelect={setChartRange}
            />
            <View className="h-24 items-center justify-center rounded-md bg-foreground/[0.04]">
              <Text size="sm" tone="tertiary">
                Chart placeholder ({chartRange})
              </Text>
            </View>
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="More than 4 options"
          good="≤ 4 options. For larger sets use a horizontal-scroll chip row or a Picker / Sheet."
        >
          <SegmentedControl
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd' },
              { label: 'E', value: 'e' },
            ]}
            selected={crammed}
            onSelect={setCrammed}
          />
        </DontRow>

        <DontRow
          bad="Multi-select fanned out as segments"
          good="SegmentedControl is single-select only. For multi-select use Badge / Chip pills."
        >
          <Text size="xs" tone="secondary">
            (Conceptual — single-select API can't model multi-select correctly)
          </Text>
        </DontRow>

        <DontRow
          bad="Pairing two SegmentedControls side-by-side"
          good="Two pill rows compete visually. Stack vertically with a small gap or fold one set into a dropdown."
        >
          <View className="flex-row gap-2">
            <View className="flex-1">
              <SegmentedControl
                options={[
                  { label: 'A', value: 'a' },
                  { label: 'B', value: 'b' },
                ]}
                selected="a"
                onSelect={() => {}}
              />
            </View>
            <View className="flex-1">
              <SegmentedControl
                options={[
                  { label: 'C', value: 'c' },
                  { label: 'D', value: 'd' },
                ]}
                selected="c"
                onSelect={() => {}}
              />
            </View>
          </View>
        </DontRow>

        <DontRow
          bad="Using as primary CTA (it isn't a button)"
          good="SegmentedControl swaps views. For primary actions use Button."
        >
          <SegmentedControl
            options={[
              { label: 'Cancel', value: 'a' },
              { label: 'Save', value: 'b' },
            ]}
            selected="a"
            onSelect={() => {}}
          />
        </DontRow>
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
