import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import {
  Rating,
  type RatingSize,
  type RatingVariant,
} from '@/components/ui/Rating';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { useState } from 'react';

const VARIANT_NOTES: Record<RatingVariant, string> = {
  gradient:
    'Pink→yellow brand gradient + soft glow on the selected number (default). Loud — for primary self-check-in questions.',
  tinted:
    'Accent-tinted bg + accent border + accent text on the selected number. Quieter — honors `tone` for category palettes.',
};

const SIZES: RatingSize[] = ['sm', 'md', 'lg'];

const SIZE_NOTES: Record<RatingSize, string> = {
  sm: '40px — compact card, dense list rows',
  md: '56px (default) — primary self-check-in / pivot test',
  lg: '72px — hero / first-run rating moment',
};

const TONES: AccentHue[] = ['pink', 'cyan', 'purple', 'orange', 'yellow'];

export default function RatingShowcase() {
  const [pivot, setPivot] = useState<number | null>(3);
  const [intimacy, setIntimacy] = useState<number | null>(2);
  const [nps, setNps] = useState<number | null>(8);
  const [mood, setMood] = useState<number | null>(5);
  const [tinted, setTinted] = useState<number | null>(3);
  const [small, setSmall] = useState<number | null>(2);
  const [large, setLarge] = useState<number | null>(4);
  const [labelled, setLabelled] = useState<number | null>(null);
  const [tonedValues, setTonedValues] = useState<Record<AccentHue, number>>({
    pink: 3,
    cyan: 3,
    purple: 3,
    orange: 3,
    yellow: 3,
    gold: 3,
  });

  return (
    <Screen
      variant="default"
      scroll
      header={<ShowcaseHeader title="Rating" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Numeric rating scale — circular buttons from `min` to `max`. Use for
          Likert-style answers (mood / pain / pivot-point self-check-ins), NPS
          scores, and any single-pick numeric range where every integer should
          be visible at once.
        </Text>
        <Text size="sm" tone="tertiary">
          For continuous ranges where the exact stop doesn&apos;t matter, reach
          for `Slider`. For category picks, use `SelectionCard`,
          `SegmentedControl`, or `ChipSelect` depending on option count.
        </Text>
      </Section>

      <Section title="Default (1–5)">
        <PropRow
          label="min=1, max=5, with start/end labels"
          note={`Selected: ${pivot ?? 'none'}`}
        >
          <Rating
            min={1}
            max={5}
            value={pivot}
            onChange={setPivot}
            startLabel="Not like me"
            endLabel="Very much like me"
          />
        </PropRow>
      </Section>

      <Section title="Ranges">
        <PropRow
          label="min=0, max=4 (5-point Likert starting at 0)"
          note={`Selected: ${intimacy ?? 'none'}`}
        >
          <Rating
            min={0}
            max={4}
            value={intimacy}
            onChange={setIntimacy}
            startLabel="Never"
            endLabel="Always"
          />
        </PropRow>

        <PropRow
          label="min=1, max=7 (extended Likert)"
          note={`Selected: ${mood ?? 'none'} — 7 stops is the practical upper bound at default size.`}
        >
          <Rating
            min={1}
            max={7}
            value={mood}
            onChange={setMood}
            startLabel="Low"
            endLabel="High"
            size="sm"
          />
        </PropRow>
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <Rating
              min={1}
              max={5}
              value={size === 'sm' ? small : size === 'lg' ? large : pivot}
              onChange={
                size === 'sm' ? setSmall : size === 'lg' ? setLarge : setPivot
              }
              size={size}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Variants">
        {(['gradient', 'tinted'] as RatingVariant[]).map((variant) => (
          <PropRow
            key={variant}
            label={`variant="${variant}"`}
            note={VARIANT_NOTES[variant]}
          >
            <Rating
              min={1}
              max={5}
              value={variant === 'gradient' ? pivot : tinted}
              onChange={variant === 'gradient' ? setPivot : setTinted}
              variant={variant}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Tones (tinted variant)">
        <Text size="sm" tone="tertiary">
          `tone` only applies to the tinted variant — gradient always uses the
          brand pink→yellow.
        </Text>
        {TONES.map((tone) => (
          <PropRow key={tone} label={`tone="${tone}"`}>
            <Rating
              min={1}
              max={5}
              value={tonedValues[tone]}
              onChange={(v) =>
                setTonedValues((prev) => ({ ...prev, [tone]: v }))
              }
              variant="tinted"
              tone={tone}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Labels">
        <PropRow
          label="No labels"
          note="Buttons only — when the surrounding context (question text + value readout) explains the scale."
        >
          <Rating min={1} max={5} value={labelled} onChange={setLabelled} />
        </PropRow>

        <PropRow label="startLabel only">
          <Rating
            min={1}
            max={5}
            value={labelled}
            onChange={setLabelled}
            startLabel="Painful"
          />
        </PropRow>

        <PropRow label="Both labels (canonical)">
          <Rating
            min={1}
            max={5}
            value={labelled}
            onChange={setLabelled}
            startLabel="Painful"
            endLabel="Joyful"
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Pivot-point self-check-in question (canonical)"
          note="Question text above + 1–5 scale + endpoint anchors. Lifted from PivotPointQuestion."
        >
          <Card variant="raised" size="lg" className="gap-6">
            <Text size="h3" weight="bold">
              I notice when my body is tense before my mind is.
            </Text>
            <Rating
              min={1}
              max={5}
              value={pivot}
              onChange={setPivot}
              startLabel="Not like me"
              endLabel="Very much like me"
            />
            {pivot !== null ? (
              <Text size="sm" align="center" tone="secondary">
                {pivot} ={' '}
                {
                  [
                    'Strongly disagree',
                    'Disagree',
                    'Neutral',
                    'Agree',
                    'Strongly agree',
                  ][pivot - 1]
                }
              </Text>
            ) : null}
          </Card>
        </PropRow>

        <PropRow
          label="Mood self-check-in (1–7, sm, with display value)"
          note="Headline value above; tight 1–7 row below."
        >
          <Card variant="raised" size="md" className="gap-4">
            <View className="items-center gap-1">
              <Text size="xs" treatment="caption" tone="tertiary">
                MOOD RIGHT NOW
              </Text>
              <Text size="display" weight="black">
                {mood ?? '—'}
              </Text>
            </View>
            <Rating
              min={1}
              max={7}
              value={mood}
              onChange={setMood}
              startLabel="Low"
              endLabel="High"
              size="sm"
            />
          </Card>
        </PropRow>

        <PropRow
          label="Satisfaction rating (1–5, tinted)"
          note="Tinted variant keeps the rating quiet so it doesn't overpower the question."
        >
          <Card variant="raised" size="md" className="gap-3">
            <Text size="md" weight="bold">
              How was that practice?
            </Text>
            <Rating
              min={1}
              max={5}
              value={nps}
              onChange={setNps}
              startLabel="Not great"
              endLabel="Loved it"
              variant="tinted"
              tone="cyan"
              size="sm"
            />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Range with more than ~7 stops at default size"
          good="Beyond ~7 the buttons feel cramped or wrap awkwardly. Use size='sm' for wider ranges (NPS 0–10) or rethink the question into a smaller scale."
        />

        <DontRow
          bad="No question / context text above the Rating"
          good="Numbers without a prompt are meaningless. Always pair Rating with a question or label that defines the scale."
        />

        <DontRow
          bad="Both gradient AND tinted in the same form"
          good="Pick one variant per form so the rating signals feel like one system. Gradient for primary self-check-ins, tinted for secondary / supporting questions."
        />

        <DontRow
          bad="Using Rating to pick a category (genre, mood label)"
          good="Rating implies an ordered numeric scale. For unordered category picks reach for SelectionCard / ChipSelect / SegmentedControl."
        />

        <DontRow
          bad="Tiny `lg` rating inside a list row"
          good="lg is for hero questions on their own screen. Inside a list / card body use sm or md."
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
