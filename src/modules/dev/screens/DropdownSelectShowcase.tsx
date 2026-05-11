import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import {
  DropdownSelect,
  type DropdownOption,
} from '@/components/ui/DropdownSelect';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

type Time = 'morning' | 'afternoon' | 'evening' | 'night';
type Goal =
  | 'reduce-anxiety'
  | 'better-sleep'
  | 'focus'
  | 'energy'
  | 'connection'
  | 'grief';
type Reminder = 'daily' | 'weekdays' | 'weekly' | 'never';

const TIME_OPTIONS: DropdownOption<Time>[] = [
  {
    value: 'morning',
    label: 'Morning',
    description: 'Start the day with a reset.',
  },
  {
    value: 'afternoon',
    label: 'Afternoon',
    description: 'A mid-day check-in.',
  },
  {
    value: 'evening',
    label: 'Evening',
    description: 'Wind down before bed.',
  },
  {
    value: 'night',
    label: 'Late night',
    description: 'For night-owls — quiet practice.',
  },
];

const GOAL_OPTIONS: DropdownOption<Goal>[] = [
  {
    value: 'reduce-anxiety',
    label: 'Reduce anxiety',
    description: 'Lower stress + work through anxious moments.',
    tone: 'cyan',
    icon: (color) => <MaterialIcons name="spa" size={20} color={color} />,
  },
  {
    value: 'better-sleep',
    label: 'Better sleep',
    description: 'Wind down + improve rest quality.',
    tone: 'purple',
    icon: (color) => <MaterialIcons name="bedtime" size={20} color={color} />,
  },
  {
    value: 'focus',
    label: 'Focus',
    description: 'Stay sharp + grounded under pressure.',
    tone: 'orange',
    icon: (color) => (
      <MaterialIcons name="center-focus-strong" size={20} color={color} />
    ),
  },
  {
    value: 'energy',
    label: 'Energy',
    description: 'Boost vitality + motivation.',
    tone: 'yellow',
    icon: (color) => <MaterialIcons name="bolt" size={20} color={color} />,
  },
  {
    value: 'connection',
    label: 'Connection',
    description: 'Strengthen relationships, hold space.',
    tone: 'pink',
    icon: (color) => <MaterialIcons name="group" size={20} color={color} />,
  },
  {
    value: 'grief',
    label: 'Grief',
    description: 'Sit with loss — gentle, paced practice.',
    tone: 'purple',
    icon: (color) => (
      <MaterialIcons name="favorite-border" size={20} color={color} />
    ),
  },
];

const REMINDER_OPTIONS: DropdownOption<Reminder>[] = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekly', label: 'Once a week' },
  { value: 'never', label: 'Never' },
];

export default function DropdownSelectShowcase() {
  const scheme = useScheme();
  const [basic, setBasic] = useState<Time | null>(null);
  const [withLabel, setWithLabel] = useState<Time | null>('morning');
  const [withIcon, setWithIcon] = useState<Time | null>(null);
  const [error, setError] = useState<Time | null>(null);
  const [compact, setCompact] = useState<Reminder | null>('daily');
  const [withDescriptions, setWithDescriptions] = useState<Time | null>(
    'evening',
  );
  const [withTonedIcons, setWithTonedIcons] = useState<Goal | null>(
    'better-sleep',
  );
  const [clearable, setClearable] = useState<Time | null>('afternoon');
  const [formGoal, setFormGoal] = useState<Goal | null>(null);
  const [formReminder, setFormReminder] = useState<Reminder | null>('daily');
  const [settingsReminder, setSettingsReminder] = useState<Reminder | null>(
    'weekdays',
  );

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="DropdownSelect" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Single-select picker that opens a themed bottom-sheet (via Dialog)
          with a `SelectionCard` list of options. The trigger chrome matches
          `TextField` so the two read as one form system.
        </Text>
        <Text size="sm" tone="tertiary">
          Reach for it when a `SegmentedControl` (≤ 4 options) is too tight and
          a full `SelectionCard` group would crowd the screen (≥ 5 options, or
          options with descriptions / icons).
        </Text>
      </Section>

      <Section title="Basic">
        <PropRow
          label="Trigger → opens picker → onChange(value)"
          note={`Selected: ${basic ?? 'none'}`}
        >
          <DropdownSelect
            options={TIME_OPTIONS}
            value={basic}
            onChange={setBasic}
            title="When do you want to practice?"
            placeholder="Pick a time of day"
          />
        </PropRow>
      </Section>

      <Section title="Sizes">
        <PropRow
          label='size="default"'
          note="Matches TextField default — px-6 py-4."
        >
          <DropdownSelect
            options={TIME_OPTIONS}
            value={withLabel}
            onChange={setWithLabel}
            title="When do you want to practice?"
            placeholder="Pick a time"
          />
        </PropRow>
        <PropRow
          label='size="compact"'
          note="Matches TextField compact — px-4 py-3. Useful in dense settings rows."
        >
          <DropdownSelect
            options={REMINDER_OPTIONS}
            value={compact}
            onChange={setCompact}
            size="compact"
            title="Reminder frequency"
            placeholder="Pick a cadence"
          />
        </PropRow>
      </Section>

      <Section title="Label + hint + error + icon">
        <PropRow label="label + hint">
          <DropdownSelect
            label="Preferred practice time"
            hint="We'll send reminders at this time of day."
            options={TIME_OPTIONS}
            value={withLabel}
            onChange={setWithLabel}
            title="Preferred practice time"
            placeholder="Pick a time"
          />
        </PropRow>

        <PropRow label="labelUppercase + icon">
          <DropdownSelect
            label="Time of day"
            labelUppercase
            options={TIME_OPTIONS}
            value={withIcon}
            onChange={setWithIcon}
            title="Time of day"
            placeholder="Select…"
            icon={
              <MaterialIcons
                name="schedule"
                size={18}
                color={foregroundFor(scheme, 0.55)}
              />
            }
          />
        </PropRow>

        <PropRow label="error">
          <DropdownSelect
            label="Preferred practice time"
            error="Pick a time before you continue."
            options={TIME_OPTIONS}
            value={error}
            onChange={setError}
            title="Preferred practice time"
            placeholder="Pick a time"
          />
        </PropRow>
      </Section>

      <Section title="Option content">
        <PropRow
          label="options with `description`"
          note="Descriptions render below each option label inside the sheet — useful when option names alone don't carry meaning."
        >
          <DropdownSelect
            options={TIME_OPTIONS}
            value={withDescriptions}
            onChange={setWithDescriptions}
            title="Practice time"
            placeholder="Pick one"
          />
        </PropRow>

        <PropRow
          label="options with `tone` + render-prop icons"
          note="Each option carries an accent color and an icon that auto-tints to match. Use for category palettes (goals, emotions)."
        >
          <DropdownSelect
            options={GOAL_OPTIONS}
            value={withTonedIcons}
            onChange={setWithTonedIcons}
            title="What's your goal?"
            placeholder="Pick a goal"
          />
        </PropRow>
      </Section>

      <Section title="Clear selection">
        <PropRow
          label="allowClear"
          note='Adds a "Clear selection" ghost button at the bottom of the picker when a value is set. Tapping resolves with null.'
        >
          <DropdownSelect
            options={TIME_OPTIONS}
            value={clearable}
            onChange={setClearable}
            allowClear
            title="Optional preferred time"
            placeholder="Pick a time"
          />
        </PropRow>
      </Section>

      <Section title="Disabled">
        <PropRow label="disabled" note="Rejects taps + renders at 40% opacity.">
          <DropdownSelect
            options={TIME_OPTIONS}
            value="morning"
            onChange={() => {}}
            disabled
            title="Preferred time"
            placeholder="Pick a time"
            label="Locked while signed out"
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Inside a form (paired with TextField + dropdown)">
          <Card variant="raised" size="md" className="gap-4">
            <DropdownSelect
              label="What brings you here?"
              labelUppercase
              options={GOAL_OPTIONS}
              value={formGoal}
              onChange={setFormGoal}
              title="Your primary goal"
              placeholder="Pick a goal"
            />
            <DropdownSelect
              label="Reminder frequency"
              labelUppercase
              options={REMINDER_OPTIONS}
              value={formReminder}
              onChange={setFormReminder}
              title="How often should we remind you?"
              placeholder="Pick a cadence"
            />
          </Card>
        </PropRow>

        <PropRow label="Settings row (compact + flush-right value)">
          <Card variant="raised" size="md" className="gap-4">
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1">
                <Text size="sm" weight="semibold">
                  Practice reminders
                </Text>
                <Text size="xs" tone="secondary">
                  We&apos;ll nudge you at your preferred time.
                </Text>
              </View>
            </View>
            <DropdownSelect
              options={REMINDER_OPTIONS}
              value={settingsReminder}
              onChange={setSettingsReminder}
              size="compact"
              title="Reminder cadence"
              placeholder="Pick one"
              allowClear
            />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using DropdownSelect for ≤ 3 mutually-exclusive options"
          good="SegmentedControl shows all options at once — fewer taps + clearer state. DropdownSelect adds a hidden step."
        >
          <DropdownSelect
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
            value="on"
            onChange={() => {}}
            placeholder="Choose"
          />
        </DontRow>

        <DontRow
          bad="Dozens of options without descriptions or search"
          good="Past ~10 options without descriptions, picking gets slow. Add descriptions, or move to a searchable list / Picker sheet."
        >
          <Text size="xs" tone="secondary">
            (Conceptual — 30 unlabeled radio cards = scroll fatigue.)
          </Text>
        </DontRow>

        <DontRow
          bad="No `title` on the picker sheet"
          good="The sheet opens disconnected from the screen header. A short title (the same as the trigger label) re-anchors the user."
        >
          <DropdownSelect
            options={TIME_OPTIONS}
            value={null}
            onChange={() => {}}
            placeholder="Pick a time"
          />
        </DontRow>

        <DontRow
          bad="Using DropdownSelect when the value can change frequently"
          good="A two-tap interaction (open + pick) is fine for rare settings. For frequent switches (mood, scope), SegmentedControl or ChipSelect stay one tap."
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

function DontRow({
  bad,
  good,
  children,
}: {
  bad: string;
  good: string;
  children?: React.ReactNode;
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
