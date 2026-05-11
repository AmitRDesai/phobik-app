import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import {
  ChipSelect,
  type ChipOption,
  type ChipSelectSize,
  type ChipSelectVariant,
} from '@/components/ui/ChipSelect';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

type Feeling = 'calm' | 'anxious' | 'sad' | 'angry' | 'joyful';
type Tag =
  | 'work'
  | 'sleep'
  | 'movement'
  | 'family'
  | 'health'
  | 'creativity'
  | 'travel'
  | 'food';
type Goal = 'reduce-anxiety' | 'better-sleep' | 'focus' | 'energy';

const FEELING_OPTIONS: ChipOption<Feeling>[] = [
  { label: 'Calm', value: 'calm', tone: 'cyan' },
  { label: 'Anxious', value: 'anxious', tone: 'orange' },
  { label: 'Sad', value: 'sad', tone: 'purple' },
  { label: 'Angry', value: 'angry', tone: 'pink' },
  { label: 'Joyful', value: 'joyful', tone: 'yellow' },
];

const TAG_OPTIONS: ChipOption<Tag>[] = [
  { label: 'Work', value: 'work' },
  { label: 'Sleep', value: 'sleep' },
  { label: 'Movement', value: 'movement' },
  { label: 'Family', value: 'family' },
  { label: 'Health', value: 'health' },
  { label: 'Creativity', value: 'creativity' },
  { label: 'Travel', value: 'travel' },
  { label: 'Food', value: 'food' },
];

const GOAL_OPTIONS: ChipOption<Goal>[] = [
  {
    label: 'Reduce anxiety',
    value: 'reduce-anxiety',
    icon: (color) => <MaterialIcons name="spa" size={14} color={color} />,
    tone: 'cyan',
  },
  {
    label: 'Better sleep',
    value: 'better-sleep',
    icon: (color) => <MaterialIcons name="bedtime" size={14} color={color} />,
    tone: 'purple',
  },
  {
    label: 'Focus',
    value: 'focus',
    icon: (color) => (
      <MaterialIcons name="center-focus-strong" size={14} color={color} />
    ),
    tone: 'orange',
  },
  {
    label: 'Energy',
    value: 'energy',
    icon: (color) => <MaterialIcons name="bolt" size={14} color={color} />,
    tone: 'yellow',
  },
];

const SIZES: ChipSelectSize[] = ['sm', 'md'];

const SIZE_NOTES: Record<ChipSelectSize, string> = {
  sm: '10px uppercase label — eyebrow / dense filter row',
  md: '13px label (default) — primary chip pickers',
};

const TONES: AccentHue[] = [
  'pink',
  'yellow',
  'cyan',
  'purple',
  'orange',
  'gold',
];

export default function ChipSelectShowcase() {
  const [multi, setMulti] = useState<Feeling[]>(['calm']);
  const [single, setSingle] = useState<Feeling[]>(['joyful']);
  const [tagsWrap, setTagsWrap] = useState<Tag[]>(['work', 'sleep']);
  const [tagsScroll, setTagsScroll] = useState<Tag[]>(['movement']);
  const [goals, setGoals] = useState<Goal[]>(['reduce-anxiety', 'energy']);
  const [tonedDefault, setTonedDefault] = useState<Feeling[]>(['calm']);
  const [smChips, setSmChips] = useState<Tag[]>(['work']);
  const [mdChips, setMdChips] = useState<Tag[]>(['work']);
  const [withDisabled, setWithDisabled] = useState<Tag[]>(['work']);
  const [variantTinted, setVariantTinted] = useState<Goal[]>([
    'reduce-anxiety',
  ]);
  const [variantGradient, setVariantGradient] = useState<Goal[]>([
    'reduce-anxiety',
  ]);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="ChipSelect" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Pill grid for picking N of M short options. Use for journal tags,
          feeling / need pickers, category filters, onboarding chip questions —
          anywhere a checkbox column would feel heavy.
        </Text>
        <Text size="sm" tone="tertiary">
          For exactly-one from a small stable set, SegmentedControl reads
          tighter. For richer rows with descriptions + icons, reach for
          SelectionCard. ChipSelect is the in-between: short labels, ≥ 4
          options, optionally multi-select.
        </Text>
      </Section>

      <Section title="Multi vs single select">
        <PropRow
          label="multi (default)"
          note={`Toggles options in/out of the array. Selected: [${multi.join(', ') || '—'}]`}
        >
          <ChipSelect
            options={FEELING_OPTIONS}
            value={multi}
            onChange={setMulti}
          />
        </PropRow>

        <PropRow
          label="multi={false} (single)"
          note={`Replaces the array with the tapped value (or empties it if re-tapped). Selected: [${single.join(', ') || '—'}]`}
        >
          <ChipSelect
            options={FEELING_OPTIONS}
            value={single}
            onChange={setSingle}
            multi={false}
          />
        </PropRow>
      </Section>

      <Section title="Variants">
        <Text size="sm" tone="tertiary">
          `tinted` honors per-option tones; `gradient` paints every selected
          chip with the brand pink→yellow gradient and ignores per-option tones
          (the gradient is always pink→yellow).
        </Text>
        {(['tinted', 'gradient'] as ChipSelectVariant[]).map((v) => (
          <PropRow
            key={v}
            label={`variant="${v}"`}
            note={
              v === 'tinted'
                ? 'Default. Selected chips fill with the option tone at 15%, accent border, accent label. Quiet — fits in dense screens.'
                : 'Loud. Selected chips fill with the pink→yellow gradient + white label, no border. Use for primary chip pickers that should grab attention.'
            }
          >
            <ChipSelect
              options={GOAL_OPTIONS}
              value={v === 'tinted' ? variantTinted : variantGradient}
              onChange={v === 'tinted' ? setVariantTinted : setVariantGradient}
              variant={v}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <ChipSelect
              options={TAG_OPTIONS.slice(0, 5)}
              value={size === 'sm' ? smChips : mdChips}
              onChange={size === 'sm' ? setSmChips : setMdChips}
              size={size}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Tones">
        <Text size="sm" tone="tertiary">
          The `tone` prop sets the default accent for all chips. Individual
          options can override via `option.tone` for a color-coded grid.
        </Text>
        <PropRow
          label="tone (default for all chips)"
          note={`Selected chips use the resolved accent for bg + border + label.`}
        >
          <ChipSelect
            options={TAG_OPTIONS.slice(0, 5).map((o) => ({
              label: o.label,
              value: o.value,
            }))}
            value={tonedDefault as unknown as Tag[]}
            onChange={(v) => setTonedDefault(v as unknown as Feeling[])}
            tone="cyan"
          />
        </PropRow>

        <PropRow
          label="option.tone (per-chip color)"
          note="Each option carries its own accent — useful for emotion / category palettes."
        >
          <ChipSelect
            options={FEELING_OPTIONS}
            value={multi}
            onChange={setMulti}
          />
        </PropRow>

        <View className="gap-3">
          {TONES.map((tone) => (
            <PropRow key={tone} label={`tone="${tone}"`}>
              <ChipSelect
                options={[
                  { label: 'Option A', value: 'a' },
                  { label: 'Option B', value: 'b' },
                  { label: 'Option C', value: 'c' },
                ]}
                value={['a']}
                onChange={() => {}}
                tone={tone}
              />
            </PropRow>
          ))}
        </View>
      </Section>

      <Section title="With icons (render-prop)">
        <PropRow
          label="option.icon as (color) => ReactNode"
          note="The render-prop receives the resolved accent color when selected, neutral gray when not — icon stays in sync with the chip state automatically."
        >
          <ChipSelect
            options={GOAL_OPTIONS}
            value={goals}
            onChange={setGoals}
          />
        </PropRow>
      </Section>

      <Section title="Layout">
        <PropRow
          label='layout="wrap" (default)'
          note="Chips flow into rows that wrap. Use when the option set is large enough to need vertical space."
        >
          <ChipSelect
            options={TAG_OPTIONS}
            value={tagsWrap}
            onChange={setTagsWrap}
          />
        </PropRow>

        <PropRow
          label='layout="scroll"'
          note="Single-row horizontal scroller. Use for narrow filter rows where vertical space is tight."
        >
          <ChipSelect
            options={TAG_OPTIONS}
            value={tagsScroll}
            onChange={setTagsScroll}
            layout="scroll"
          />
        </PropRow>
      </Section>

      <Section title="Disabled options">
        <PropRow
          label="option.disabled"
          note="Rejects taps + renders at 40% opacity. Use to gate options that aren't available yet."
        >
          <ChipSelect
            options={[
              { label: 'Work', value: 'work' },
              { label: 'Sleep', value: 'sleep' },
              { label: 'Movement', value: 'movement', disabled: true },
              { label: 'Family', value: 'family' },
              { label: 'Travel', value: 'travel', disabled: true },
            ]}
            value={withDisabled}
            onChange={setWithDisabled}
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Journal tag picker (multi, wrap)">
          <Card variant="raised" size="md" className="gap-3">
            <Text size="sm" weight="semibold">
              Tag this reflection
            </Text>
            <ChipSelect
              options={TAG_OPTIONS}
              value={tagsWrap}
              onChange={setTagsWrap}
              size="sm"
            />
          </Card>
        </PropRow>

        <PropRow label="Feeling picker (single, per-tone)">
          <Card variant="raised" size="md" className="gap-3">
            <Text size="sm" weight="semibold">
              How do you feel right now?
            </Text>
            <ChipSelect
              options={FEELING_OPTIONS}
              value={single}
              onChange={setSingle}
              multi={false}
            />
          </Card>
        </PropRow>

        <PropRow label="Onboarding goal picker (multi, icons)">
          <Card variant="raised" size="md" className="gap-3">
            <Text size="sm" weight="semibold">
              What brings you here? (select all that apply)
            </Text>
            <ChipSelect
              options={GOAL_OPTIONS}
              value={goals}
              onChange={setGoals}
            />
          </Card>
        </PropRow>

        <PropRow label="Filter row above a list (scroll)">
          <Card variant="raised" size="md" className="gap-3">
            <Text size="sm" weight="semibold">
              Filter entries
            </Text>
            <ChipSelect
              options={TAG_OPTIONS}
              value={tagsScroll}
              onChange={setTagsScroll}
              layout="scroll"
              size="sm"
            />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using ChipSelect for ≤ 3 mutually-exclusive options"
          good="SegmentedControl reads tighter at low option counts and signals tab-like switching."
        >
          <ChipSelect
            options={[
              { label: 'On', value: 'on' },
              { label: 'Off', value: 'off' },
            ]}
            value={['on']}
            onChange={() => {}}
            multi={false}
          />
        </DontRow>

        <DontRow
          bad="Long-form labels inside a chip"
          good="Keep chip labels ≤ 2 words. For richer options reach for SelectionCard."
        >
          <ChipSelect
            options={[
              {
                label: 'A really long descriptive option label that wraps',
                value: 'a',
              },
              { label: 'Short', value: 'b' },
            ]}
            value={['b']}
            onChange={() => {}}
          />
        </DontRow>

        <DontRow
          bad="Stacking multiple ChipSelects with overlapping option sets"
          good="If two pickers share options, fold into one. Two grids = two truths to keep in sync."
        >
          <View className="gap-2">
            <ChipSelect
              options={TAG_OPTIONS.slice(0, 4)}
              value={['work']}
              onChange={() => {}}
            />
            <ChipSelect
              options={TAG_OPTIONS.slice(2, 6)}
              value={['movement']}
              onChange={() => {}}
            />
          </View>
        </DontRow>

        <DontRow
          bad="Mixing tones across non-categorical chips (random color salad)"
          good="Per-option tones are for semantic palettes (emotions, categories). For generic tags, use a single default tone — the chips read as one set."
        >
          <ChipSelect
            options={[
              { label: 'Tag A', value: 'a', tone: 'pink' },
              { label: 'Tag B', value: 'b', tone: 'cyan' },
              { label: 'Tag C', value: 'c', tone: 'yellow' },
              { label: 'Tag D', value: 'd', tone: 'purple' },
              { label: 'Tag E', value: 'e', tone: 'orange' },
            ]}
            value={['a', 'c']}
            onChange={() => {}}
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
