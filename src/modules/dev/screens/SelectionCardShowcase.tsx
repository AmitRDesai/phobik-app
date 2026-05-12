import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

type RadioValue = 'morning' | 'afternoon' | 'evening';
type Reason = 'anxiety' | 'sleep' | 'focus' | 'relationships' | 'grief';
type Goal = 'calm' | 'energy' | 'sleep' | 'focus';

export default function SelectionCardShowcase() {
  const [radio, setRadio] = useState<RadioValue>('morning');
  const [reasons, setReasons] = useState<Reason[]>(['anxiety', 'focus']);
  const [iconless, setIconless] = useState<RadioValue>('afternoon');
  const [descless, setDescless] = useState<RadioValue>('evening');
  const [toned, setToned] = useState<Goal>('calm');
  const [gated, setGated] = useState<RadioValue>('morning');

  const toggle = (r: Reason) =>
    setReasons((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );

  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="SelectionCard" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          A tappable list-row card for picking options inside a question / form
          flow. Comes in two flavors: `radio` (single-select within a group) and
          `checkbox` (multi-select).
        </Text>
        <Text size="sm" tone="tertiary">
          Selection state is owned by the parent — SelectionCard is a
          presentation component. Render N of them and bind their `selected`
          props to slices of the group state.
        </Text>
      </Section>

      <Section title="Variants">
        <PropRow
          label={'variant="radio"'}
          note="Single-select within a group. Selected card gains a pink border + soft pink glow. The indicator on the right is a dot-in-ring."
        >
          <View className="gap-3">
            {(
              [
                {
                  value: 'morning',
                  label: 'Morning',
                  description: 'Start the day with a reset.',
                  icon: 'wb-sunny',
                },
                {
                  value: 'afternoon',
                  label: 'Afternoon',
                  description: 'A mid-day check-in.',
                  icon: 'wb-twilight',
                },
                {
                  value: 'evening',
                  label: 'Evening',
                  description: 'Wind down before bed.',
                  icon: 'bedtime',
                },
              ] as const
            ).map((opt) => (
              <SelectionCard
                key={opt.value}
                variant="radio"
                label={opt.label}
                description={opt.description}
                selected={radio === opt.value}
                onPress={() => setRadio(opt.value)}
                icon={
                  <MaterialIcons
                    name={opt.icon}
                    size={20}
                    color={colors.primary.pink}
                  />
                }
              />
            ))}
          </View>
        </PropRow>

        <PropRow
          label={'variant="checkbox"'}
          note="Multi-select. Card chrome + accent color are identical to radio. The only difference is the indicator shape: a filled pink circle with a white checkmark instead of the radio dot-in-ring."
        >
          <View className="gap-3">
            {(
              [
                {
                  value: 'anxiety',
                  label: 'Anxiety',
                  description: 'Work through anxious moments.',
                  icon: 'spa',
                },
                {
                  value: 'sleep',
                  label: 'Sleep',
                  description: 'Wind down + improve rest.',
                  icon: 'bedtime',
                },
                {
                  value: 'focus',
                  label: 'Focus',
                  description: 'Stay grounded under load.',
                  icon: 'center-focus-strong',
                },
                {
                  value: 'relationships',
                  label: 'Relationships',
                  description: 'Hold space for others.',
                  icon: 'group',
                },
                {
                  value: 'grief',
                  label: 'Grief',
                  description: 'Sit with loss.',
                  icon: 'favorite',
                },
              ] as const
            ).map((opt) => (
              <SelectionCard
                key={opt.value}
                variant="checkbox"
                label={opt.label}
                description={opt.description}
                selected={reasons.includes(opt.value)}
                onPress={() => toggle(opt.value)}
                icon={
                  <MaterialIcons
                    name={opt.icon}
                    size={20}
                    color={colors.primary.pink}
                  />
                }
              />
            ))}
          </View>
        </PropRow>
      </Section>

      <Section title="Content slots">
        <PropRow
          label="Without icon"
          note="Skip `icon` for dense lists or text-only options."
        >
          <View className="gap-3">
            {(
              [
                { value: 'morning', label: 'Morning' },
                { value: 'afternoon', label: 'Afternoon' },
                { value: 'evening', label: 'Evening' },
              ] as const
            ).map((opt) => (
              <SelectionCard
                key={opt.value}
                variant="radio"
                label={opt.label}
                description="Quick reset, no extra context."
                selected={iconless === opt.value}
                onPress={() => setIconless(opt.value)}
              />
            ))}
          </View>
        </PropRow>

        <PropRow
          label="Without description"
          note="Skip `description` for short labels — the card collapses to a single line."
        >
          <View className="gap-3">
            {(
              [
                { value: 'morning', label: 'Morning' },
                { value: 'afternoon', label: 'Afternoon' },
                { value: 'evening', label: 'Evening' },
              ] as const
            ).map((opt) => (
              <SelectionCard
                key={opt.value}
                variant="radio"
                label={opt.label}
                selected={descless === opt.value}
                onPress={() => setDescless(opt.value)}
                icon={
                  <MaterialIcons
                    name="schedule"
                    size={20}
                    color={colors.primary.pink}
                  />
                }
              />
            ))}
          </View>
        </PropRow>
      </Section>

      <Section title="Tone (color-coded option icons)">
        <Text size="sm" tone="tertiary">
          Pass `tone` + an `icon` render-prop to auto-color the option icon chip
          with the resolved accent. The card chrome itself stays brand-pink for
          the selection accent regardless of tone — `tone` only colors the icon
          + chip bg.
        </Text>
        <PropRow label="tone + render-prop icon">
          <View className="gap-3">
            {[
              {
                value: 'calm' as const,
                label: 'Calm',
                description: 'Lower anxiety, ground yourself.',
                icon: 'spa' as const,
                tone: 'cyan' as const,
              },
              {
                value: 'energy' as const,
                label: 'Energy',
                description: 'Boost vitality and motivation.',
                icon: 'bolt' as const,
                tone: 'yellow' as const,
              },
              {
                value: 'sleep' as const,
                label: 'Sleep',
                description: 'Wind down before bed.',
                icon: 'bedtime' as const,
                tone: 'purple' as const,
              },
              {
                value: 'focus' as const,
                label: 'Focus',
                description: 'Stay sharp under pressure.',
                icon: 'center-focus-strong' as const,
                tone: 'orange' as const,
              },
            ].map((opt) => (
              <SelectionCard
                key={opt.value}
                variant="radio"
                label={opt.label}
                description={opt.description}
                tone={opt.tone}
                selected={toned === opt.value}
                onPress={() => setToned(opt.value)}
                icon={(color) => (
                  <MaterialIcons name={opt.icon} size={20} color={color} />
                )}
              />
            ))}
          </View>
        </PropRow>
      </Section>

      <Section title="Disabled">
        <Text size="sm" tone="tertiary">
          `disabled={true}` rejects taps + renders the card at 40% opacity. The
          accessible state is exposed to screen readers via
          `accessibilityState.disabled`.
        </Text>
        <PropRow
          label="Mixed enabled + disabled radio group"
          note="Use to gate options that aren't available yet (e.g. 'Year' before there's enough history)."
        >
          <View className="gap-3">
            {[
              {
                value: 'morning' as const,
                label: 'Morning',
                description: 'Available now.',
              },
              {
                value: 'afternoon' as const,
                label: 'Afternoon',
                description: 'Coming soon — finish onboarding first.',
                disabled: true,
              },
              {
                value: 'evening' as const,
                label: 'Evening',
                description: 'Available now.',
              },
            ].map((opt) => (
              <SelectionCard
                key={opt.value}
                variant="radio"
                label={opt.label}
                description={opt.description}
                disabled={opt.disabled}
                selected={gated === opt.value}
                onPress={() => setGated(opt.value)}
              />
            ))}
          </View>
        </PropRow>
      </Section>

      <Section title="Press feedback + a11y">
        <Text size="sm" tone="tertiary">
          Every SelectionCard ships with: a light haptic on press, an
          `active:scale-[0.98]` press animation, and the correct
          `accessibilityRole` (radio or checkbox) + state. Pass `noHaptic` to
          suppress the haptic in rare cases.
        </Text>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Single-pick onboarding question (radio + icon + description)"
          note="The canonical use — one question, one answer, rich context per option."
        >
          <Card variant="raised" size="md" className="gap-4">
            <Text size="md" weight="bold">
              When do you usually want to check in?
            </Text>
            <View className="gap-3">
              {[
                {
                  value: 'morning' as const,
                  label: 'Morning',
                  description: 'Start the day grounded.',
                },
                {
                  value: 'afternoon' as const,
                  label: 'Afternoon',
                  description: 'Reset mid-day.',
                },
                {
                  value: 'evening' as const,
                  label: 'Evening',
                  description: 'Wind down before sleep.',
                },
              ].map((opt) => (
                <SelectionCard
                  key={opt.value}
                  variant="radio"
                  label={opt.label}
                  description={opt.description}
                  selected={radio === opt.value}
                  onPress={() => setRadio(opt.value)}
                />
              ))}
            </View>
          </Card>
        </PropRow>

        <PropRow
          label="Multi-pick reasons (checkbox, short labels)"
          note="Open-ended multi-select — no minimum or maximum implied by the UI."
        >
          <Card variant="raised" size="md" className="gap-4">
            <Text size="md" weight="bold">
              What brings you here? (select all that apply)
            </Text>
            <View className="gap-3">
              {[
                { value: 'anxiety' as const, label: 'Anxiety' },
                { value: 'sleep' as const, label: 'Sleep' },
                { value: 'focus' as const, label: 'Focus' },
                { value: 'relationships' as const, label: 'Relationships' },
              ].map((opt) => (
                <SelectionCard
                  key={opt.value}
                  variant="checkbox"
                  label={opt.label}
                  selected={reasons.includes(opt.value)}
                  onPress={() => toggle(opt.value)}
                />
              ))}
            </View>
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Mixing radio + checkbox in the same group"
          good="Pick one per question. Radio = exactly one answer; checkbox = zero-or-more."
        >
          <View className="gap-3">
            <SelectionCard
              variant="radio"
              label="Option A"
              selected
              onPress={() => {}}
            />
            <SelectionCard
              variant="checkbox"
              label="Option B"
              selected={false}
              onPress={() => {}}
            />
          </View>
        </DontRow>

        <DontRow
          bad="Using SelectionCard for a binary on/off toggle"
          good="A 2-option SelectionCard wastes vertical space. Use SegmentedControl, Switch, or a single checkbox row."
        >
          <View className="gap-3">
            <SelectionCard
              variant="radio"
              label="Yes"
              selected
              onPress={() => {}}
            />
            <SelectionCard
              variant="radio"
              label="No"
              selected={false}
              onPress={() => {}}
            />
          </View>
        </DontRow>

        <DontRow
          bad="Long answers that wrap into 4+ lines per card"
          good="Keep label ≤ 1 line + description ≤ 2 lines. Long-form belongs in body copy above the question."
        >
          <SelectionCard
            variant="radio"
            label="A multi-clause label that just keeps going and turns into a paragraph at this point"
            description="And the description follows the same pattern, becoming long enough that the card itself feels less like a button and more like a paragraph of body copy that you happen to be able to tap."
            selected={false}
            onPress={() => {}}
          />
        </DontRow>

        <DontRow
          bad="More than ~6 radio options in one group"
          good="Reach for a Picker / Sheet / search-able list. Long radio groups force scrolling + obscure the question."
        >
          <Text size="xs" tone="secondary">
            (Conceptual — render &gt;6 SelectionCards and the question above is
            no longer visible without scrolling.)
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
