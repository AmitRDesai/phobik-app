import { Button } from '@/components/ui/Button';
import {
  Text,
  type TextSize,
  type TextTone,
  type TextWeight,
} from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

type SizeRowData = { size: TextSize; metrics: string; notes: string };

const SIZES: SizeRowData[] = [
  { size: 'display', metrics: '36 / 40', notes: 'extrabold — biggest hero' },
  { size: 'h1', metrics: '28 / 34', notes: 'bold — primary screen title' },
  { size: 'h2', metrics: '22 / 28', notes: 'bold — secondary title' },
  { size: 'h3', metrics: '18 / 24', notes: 'semibold — section / card title' },
  { size: 'lg', metrics: '17 / 24', notes: 'emphasis subtitle / large body' },
  { size: 'md', metrics: '15 / 22', notes: 'default body' },
  { size: 'sm', metrics: '13 / 19', notes: 'small body / helper text' },
  { size: 'xs', metrics: '11 / 15', notes: 'micro body / status / footer' },
];

const TONES: TextTone[] = [
  'primary',
  'secondary',
  'tertiary',
  'disabled',
  'accent',
  'danger',
  'success',
  'warning',
  'inverse',
];

const WEIGHTS: TextWeight[] = [
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
];

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const SAMPLE = 'The quick brown fox jumps over the lazy dog.';

export default function TypographyShowcase() {
  const { mode, setMode } = useTheme();
  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Typography" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      {/* Theme toggle — instant light/dark comparison without leaving the screen */}
      <Card variant="flat" className="gap-2 p-4">
        <Text size="xs" treatment="caption" tone="tertiary">
          Scheme preview
        </Text>
        <SegmentedControl
          options={THEME_OPTIONS}
          selected={mode}
          onSelect={setMode}
        />
      </Card>

      <Section title="Size scale">
        {SIZES.map((row) => (
          <SizeRowView key={row.size} row={row} />
        ))}
      </Section>

      <Section title="Tones (color hierarchy)">
        {TONES.map((tone) => (
          <ToneRow key={tone} tone={tone} />
        ))}
      </Section>

      <Section title="Weight overrides">
        {WEIGHTS.map((weight) => (
          <View key={weight} className="gap-1">
            <Text size="xs" tone="tertiary" className="font-mono">
              weight=&quot;{weight}&quot;
            </Text>
            <Text size="md" weight={weight}>
              {SAMPLE}
            </Text>
          </View>
        ))}
      </Section>

      <Section title="Alignment">
        <PropRow label='align="left"'>
          <Text size="md" align="left">
            Left-aligned body text
          </Text>
        </PropRow>
        <PropRow label='align="center"'>
          <Text size="md" align="center">
            Centered body text
          </Text>
        </PropRow>
        <PropRow label='align="right"'>
          <Text size="md" align="right">
            Right-aligned body text
          </Text>
        </PropRow>
      </Section>

      <Section title="Treatments">
        <PropRow label='treatment="caption" + size="xs"'>
          <Text size="xs" treatment="caption">
            Eyebrow Label
          </Text>
        </PropRow>
        <PropRow label='treatment="caption" + size="sm"'>
          <Text size="sm" treatment="caption">
            Bigger Eyebrow
          </Text>
        </PropRow>
        <PropRow label='treatment="caption" + tone="accent"'>
          <Text size="xs" treatment="caption" tone="accent">
            Accent Eyebrow
          </Text>
        </PropRow>
      </Section>

      <Section title="Italic (composes with every axis)">
        <PropRow label="italic">
          <Text size="md" italic>
            {SAMPLE}
          </Text>
        </PropRow>
        <PropRow label='italic + tone="secondary" (block quote)'>
          <Text size="md" tone="secondary" italic className="leading-relaxed">
            &ldquo;Your next step isn&rsquo;t to become someone new. It&rsquo;s
            to respond just 1% differently when it matters.&rdquo;
          </Text>
        </PropRow>
        <PropRow label='italic + size="xs" tone="tertiary" (helper note)'>
          <Text size="xs" tone="tertiary" italic>
            Tip: small italic helper text
          </Text>
        </PropRow>
        <PropRow label='italic + treatment="caption"'>
          <Text size="xs" treatment="caption" italic>
            Italic Eyebrow
          </Text>
        </PropRow>
        <PropRow label='italic + size="h2" weight="black"'>
          <Text size="h2" weight="black" italic>
            Editorial title
          </Text>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Card title + subtitle + meta">
          <Card variant="flat" className="gap-1 p-4">
            <Text size="h3">Daily Flow</Text>
            <Text size="sm" tone="secondary">
              Pick up where you left off
            </Text>
            <Text
              size="xs"
              treatment="caption"
              tone="tertiary"
              className="mt-2"
            >
              Step 2 of 4
            </Text>
          </Card>
        </PropRow>

        <PropRow label="Form row (label + value + helper)">
          <View className="gap-1">
            <Text size="sm" weight="semibold">
              Email
            </Text>
            <Text size="md">you@phobik.com</Text>
            <Text size="xs" tone="tertiary">
              We&apos;ll never share this address
            </Text>
          </View>
        </PropRow>

        <PropRow label="Validation message">
          <Text size="sm" tone="danger">
            Password must be at least 8 characters
          </Text>
        </PropRow>

        <PropRow label="Success confirmation">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="check-circle" size={16} color="#0bda8e" />
            <Text size="sm" tone="success" weight="semibold">
              Saved
            </Text>
          </View>
        </PropRow>

        <PropRow label='Inverse text on saturated bg (e.g. "primary" Button label)'>
          <Button>Primary CTA</Button>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="caption for sentence-case body"
          good="sm or xs (caption is UPPERCASE + tracked)"
        >
          <Text size="xs" treatment="caption">
            this looks shouted and tracked
          </Text>
        </DontRow>

        <DontRow
          bad='className="text-foreground/55" instead of tone="secondary"'
          good='tone="secondary" — uses the canonical alpha step'
        >
          <Text size="md" tone="secondary">
            Custom alpha drifts from the tone scale
          </Text>
        </DontRow>

        <DontRow
          bad='className="text-center" instead of align="center"'
          good='align="center" — first-class, self-documenting'
        >
          <Text size="md" className="text-center">
            Centered via className
          </Text>
        </DontRow>

        <DontRow
          bad='className="font-bold" on a size that already defaults to bold'
          good="omit weight — size carries the default weight"
        >
          <Text size="h1">Redundant font-bold on h1</Text>
        </DontRow>

        <DontRow
          bad="Mixing italic className with the italic prop"
          good="Use the italic prop alone"
        >
          <Text size="md" italic>
            Just use the prop
          </Text>
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
      <Card variant="flat" className="gap-5 p-5">
        {children}
      </Card>
    </View>
  );
}

function SizeRowView({ row }: { row: SizeRowData }) {
  return (
    <View className="gap-1">
      <View className="flex-row items-baseline gap-2">
        <Text size="xs" tone="tertiary" className="font-mono">
          size=&quot;{row.size}&quot;
        </Text>
        <Text size="xs" tone="tertiary">
          · {row.metrics}
        </Text>
      </View>
      <Text size={row.size}>{SAMPLE}</Text>
      <Text size="xs" tone="tertiary">
        {row.notes}
      </Text>
    </View>
  );
}

function ToneRow({ tone }: { tone: TextTone }) {
  const onInverseBg = tone === 'inverse';
  return (
    <View className="gap-1">
      <Text size="xs" tone="tertiary" className="font-mono">
        tone=&quot;{tone}&quot;
      </Text>
      {onInverseBg ? (
        <View className="rounded-md bg-primary-pink p-3">
          <Text size="md" tone={tone}>
            {SAMPLE}
          </Text>
        </View>
      ) : (
        <Text size="md" tone={tone}>
          {SAMPLE}
        </Text>
      )}
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
    <View className="gap-1.5 rounded-md border border-status-danger/30 bg-status-danger/[0.05] p-3">
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
