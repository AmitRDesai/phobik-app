import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import {
  TextArea,
  type TextAreaRows,
  type TextAreaVariant,
} from '@/components/ui/TextArea';
import { useState } from 'react';

const VARIANTS: TextAreaVariant[] = ['filled', 'minimal'];

const VARIANT_NOTES: Record<TextAreaVariant, string> = {
  filled:
    'Rounded bg + border (default) — forms, replies, structured input fields',
  minimal:
    'Borderless transparent body — long-form writing where chrome would compete (journal, letter)',
};

const ROWS: TextAreaRows[] = ['sm', 'md', 'lg'];

const ROW_NOTES: Record<TextAreaRows, string> = {
  sm: '96px min height — quick notes, replies',
  md: '192px min height (default) — standard reflections',
  lg: '288px min height — long-form writing surfaces',
};

export default function TextAreaShowcase() {
  const [filled, setFilled] = useState('');
  const [minimal, setMinimal] = useState('');
  const [sm, setSm] = useState('');
  const [md, setMd] = useState('');
  const [lg, setLg] = useState('');
  const [custom, setCustom] = useState('');
  const [labelled, setLabelled] = useState('');
  const [hinted, setHinted] = useState('');
  const [uppercase, setUppercase] = useState('');
  const [errVal, setErrVal] = useState('');
  const [counter, setCounter] = useState('');
  const [counterAlone, setCounterAlone] = useState('Some draft text');
  const [journal, setJournal] = useState('');
  const [reply, setReply] = useState('');
  const [post, setPost] = useState('');
  const [disabled] = useState('This is read-only content you cannot edit.');

  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="TextArea" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="Variants">
        {VARIANTS.map((variant) => (
          <PropRow
            key={variant}
            label={`variant="${variant}"`}
            note={VARIANT_NOTES[variant]}
          >
            <TextArea
              variant={variant}
              value={variant === 'minimal' ? minimal : filled}
              onChangeText={variant === 'minimal' ? setMinimal : setFilled}
              placeholder={
                variant === 'minimal' ? 'Start writing here…' : 'Type a reply…'
              }
              rows="sm"
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Rows (min height)">
        {ROWS.map((row) => (
          <PropRow key={row} label={`rows="${row}"`} note={ROW_NOTES[row]}>
            <TextArea
              rows={row}
              value={row === 'sm' ? sm : row === 'md' ? md : lg}
              onChangeText={row === 'sm' ? setSm : row === 'md' ? setMd : setLg}
              placeholder={`${row.toUpperCase()} textarea`}
            />
          </PropRow>
        ))}
        <PropRow
          label="rows={120}"
          note="Custom pixel number — escape hatch for one-off heights (e.g. matching a design comp)"
        >
          <TextArea
            rows={120}
            value={custom}
            onChangeText={setCustom}
            placeholder="Custom 120px min height"
          />
        </PropRow>
      </Section>

      <Section title="Label + hint + error">
        <PropRow label="label (sentence case)">
          <TextArea
            label="Reflection"
            value={labelled}
            onChangeText={setLabelled}
            placeholder="What's on your mind?"
            rows="sm"
          />
        </PropRow>

        <PropRow label="label + hint">
          <TextArea
            label="Letter to self"
            hint="Write as if you were comforting a close friend in the same situation."
            value={hinted}
            onChangeText={setHinted}
            placeholder="Dear me…"
            rows="sm"
          />
        </PropRow>

        <PropRow label="labelUppercase">
          <TextArea
            label="Comment"
            labelUppercase
            value={uppercase}
            onChangeText={setUppercase}
            placeholder="Share your thoughts"
            rows="sm"
          />
        </PropRow>

        <PropRow label="error">
          <TextArea
            label="Bio"
            error="Bio can't be empty."
            value={errVal}
            onChangeText={setErrVal}
            placeholder="Tell us about yourself"
            rows="sm"
          />
        </PropRow>
      </Section>

      <Section title="Character counter">
        <Text size="sm" tone="tertiary">
          Pass `maxLength` to auto-show a counter that flips to danger tone when
          the cap is hit. Pass `showCounter` without `maxLength` for an open
          counter that just tracks length.
        </Text>
        <PropRow
          label="maxLength={280}"
          note="Counter auto-appears; input is hard-capped at maxLength"
        >
          <TextArea
            value={counter}
            onChangeText={setCounter}
            placeholder="Compose a short post…"
            maxLength={280}
            rows="sm"
          />
        </PropRow>

        <PropRow
          label="showCounter (no maxLength)"
          note="Open-ended counter for drafting surfaces"
        >
          <TextArea
            value={counterAlone}
            onChangeText={setCounterAlone}
            placeholder="Type without a cap"
            showCounter
            rows="sm"
          />
        </PropRow>
      </Section>

      <Section title="States">
        <PropRow label="idle">
          <TextArea
            value=""
            onChangeText={() => {}}
            placeholder="Untouched"
            rows="sm"
          />
        </PropRow>

        <PropRow
          label="disabled (editable={false})"
          note="Rejects input but stays visually neutral"
        >
          <TextArea
            editable={false}
            value={disabled}
            onChangeText={() => {}}
            rows="sm"
          />
        </PropRow>

        <PropRow
          label="focused"
          note="Tap to focus — border + glow shift to primary-pink"
        >
          <TextArea
            value={filled}
            onChangeText={setFilled}
            placeholder="Tap here to see focus state"
            rows="sm"
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Long-form writing (minimal variant)">
          <TextArea
            variant="minimal"
            value={journal}
            onChangeText={setJournal}
            placeholder="How is your body feeling right now?"
            rows="md"
          />
        </PropRow>

        <PropRow label="Reply box (filled, sm, with counter)">
          <TextArea
            value={reply}
            onChangeText={setReply}
            placeholder="Reply…"
            rows="sm"
            maxLength={280}
          />
        </PropRow>

        <PropRow label="Community post (filled, lg, with counter + label)">
          <TextArea
            label="Your post"
            value={post}
            onChangeText={setPost}
            placeholder="Start writing here…"
            rows="lg"
            maxLength={500}
          />
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using TextField with a multiline hack instead of TextArea"
          good="TextArea handles row sizing, top-aligned text, and counter chrome out of the box"
        >
          <View className="rounded-full border border-foreground/20 bg-surface-input px-6 py-12">
            <Text size="sm" tone="secondary">
              Rounded-pill TextField stretched tall — text aligns oddly + chrome
              looks broken
            </Text>
          </View>
        </DontRow>

        <DontRow
          bad="Wrapping a TextArea in another bordered Card"
          good="Pick one container. TextArea filled already has chrome; nesting it inside a Card adds double borders."
        >
          <Card variant="raised" size="sm">
            <TextArea
              value=""
              onChangeText={() => {}}
              placeholder="Nested chrome"
              rows="sm"
            />
          </Card>
        </DontRow>

        <DontRow
          bad="Using filled variant for full-page long-form writing (journal entries)"
          good="Minimal variant — chrome competes with writing flow on a full-page composer"
        >
          <TextArea
            value=""
            onChangeText={() => {}}
            placeholder="Today I'm noticing…"
            rows="sm"
          />
        </DontRow>

        <DontRow
          bad="Hard-coded `multiline` TextInput at the call site"
          good="Always reach for TextArea — keeps placeholder color, selection color, and sizing consistent"
        >
          <View className="h-24 rounded-md border border-foreground/10 bg-foreground/[0.04] p-4">
            <Text size="sm" tone="secondary">
              Raw RN TextInput with multiline — drifts from the design system
            </Text>
          </View>
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
