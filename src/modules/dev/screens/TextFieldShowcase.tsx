import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import {
  TextField,
  type TextFieldSize,
  type TextFieldType,
} from '@/components/ui/TextField';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const TYPES: TextFieldType[] = ['text', 'password', 'email', 'numeric'];

const TYPE_NOTES: Record<TextFieldType, string> = {
  text: 'default keyboard, sentence-case autocapitalize',
  password: 'secureTextEntry + reveal/hide eye affordance',
  email: 'email keyboard, no autocapitalize',
  numeric: 'numeric keyboard, no autocapitalize',
};

const SIZES: TextFieldSize[] = ['default', 'compact'];

const SIZE_NOTES: Record<TextFieldSize, string> = {
  default: 'px-6 py-4 — auth screens, primary forms',
  compact: 'px-4 py-3 — dense forms, inline filters',
};

export default function TextFieldShowcase() {
  const scheme = useScheme();

  // One state slot per field so they behave like real inputs in the showcase.
  const [text, setText] = useState('');
  const [pw, setPw] = useState('hunter2');
  const [email, setEmail] = useState('');
  const [num, setNum] = useState('');
  const [withIcon, setWithIcon] = useState('');
  const [errVal, setErrVal] = useState('not-an-email');
  const [labelled, setLabelled] = useState('');
  const [labelledHint, setLabelledHint] = useState('');
  const [upperCase, setUpperCase] = useState('');
  const [compact, setCompact] = useState('');
  const [disabled] = useState('Read-only value');

  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="TextField" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="Types">
        {TYPES.map((type) => (
          <PropRow key={type} label={`type="${type}"`} note={TYPE_NOTES[type]}>
            <TextField
              type={type}
              value={
                type === 'password'
                  ? pw
                  : type === 'email'
                    ? email
                    : type === 'numeric'
                      ? num
                      : text
              }
              onChangeText={
                type === 'password'
                  ? setPw
                  : type === 'email'
                    ? setEmail
                    : type === 'numeric'
                      ? setNum
                      : setText
              }
              placeholder={
                type === 'email'
                  ? 'you@example.com'
                  : type === 'numeric'
                    ? '0'
                    : type === 'password'
                      ? '••••••••'
                      : 'Type something…'
              }
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <TextField
              size={size}
              value={size === 'compact' ? compact : text}
              onChangeText={size === 'compact' ? setCompact : setText}
              placeholder={`${size[0].toUpperCase() + size.slice(1)} input`}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="With leading icon">
        <Text size="sm" tone="tertiary">
          Pass any React node as `icon`. Use `foregroundFor(scheme, opacity)`
          for theme-aware tinting.
        </Text>
        <PropRow label="icon={<Ionicons …/>}">
          <TextField
            value={withIcon}
            onChangeText={setWithIcon}
            placeholder="Search…"
            icon={
              <Ionicons
                name="search"
                size={18}
                color={foregroundFor(scheme, 0.55)}
              />
            }
          />
        </PropRow>
        <PropRow label="icon={<MaterialIcons …/>}">
          <TextField
            value={text}
            onChangeText={setText}
            placeholder="Tag this entry"
            icon={
              <MaterialIcons
                name="local-offer"
                size={18}
                color={foregroundFor(scheme, 0.55)}
              />
            }
          />
        </PropRow>
      </Section>

      <Section title="Label + hint + error">
        <PropRow
          label="label only (sentence case)"
          note="Default labels render at body-sm semibold tone-secondary"
        >
          <TextField
            label="Display name"
            value={labelled}
            onChangeText={setLabelled}
            placeholder="What should we call you?"
          />
        </PropRow>

        <PropRow
          label="label + hint"
          note="Hint renders below in tone-secondary"
        >
          <TextField
            label="Reflection focus"
            hint="A few words on what you'd like to explore today."
            value={labelledHint}
            onChangeText={setLabelledHint}
            placeholder="Today I want to think about…"
          />
        </PropRow>

        <PropRow
          label="labelUppercase"
          note="Eyebrow-style label — useful for dense forms, settings"
        >
          <TextField
            label="Email"
            labelUppercase
            type="email"
            value={upperCase}
            onChangeText={setUpperCase}
            placeholder="you@example.com"
          />
        </PropRow>

        <PropRow
          label="error"
          note="Error text replaces hint; border + glow shift to status-danger"
        >
          <TextField
            label="Email"
            type="email"
            error="That doesn't look like a valid email."
            value={errVal}
            onChangeText={setErrVal}
            placeholder="you@example.com"
          />
        </PropRow>
      </Section>

      <Section title="States">
        <PropRow label="idle" note="Neutral border (gray/18), no glow">
          <TextField value="" onChangeText={() => {}} placeholder="Untouched" />
        </PropRow>

        <PropRow
          label="disabled (editable={false})"
          note="Stays visually neutral but rejects input"
        >
          <TextField
            editable={false}
            value={disabled}
            onChangeText={() => {}}
          />
        </PropRow>

        <PropRow
          label="focused"
          note="Tap to focus — border + glow shift to primary-pink"
        >
          <TextField
            value={text}
            onChangeText={setText}
            placeholder="Tap me to see focus state"
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Auth form (default size, labelUppercase)">
          <View className="gap-4">
            <TextField
              label="Email"
              labelUppercase
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              labelUppercase
              type="password"
              value={pw}
              onChangeText={setPw}
              placeholder="••••••••"
            />
          </View>
        </PropRow>

        <PropRow label="Search field (icon, no label)">
          <TextField
            value={withIcon}
            onChangeText={setWithIcon}
            placeholder="Search practices…"
            icon={
              <Ionicons
                name="search"
                size={18}
                color={foregroundFor(scheme, 0.55)}
              />
            }
          />
        </PropRow>

        <PropRow label="Inline filter (compact)">
          <TextField
            size="compact"
            value={compact}
            onChangeText={setCompact}
            placeholder="Filter tags…"
          />
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using raw `TextInput` instead of TextField for new screens"
          good="TextField provides labels, hints, error chrome, and theming for free"
        >
          <View className="rounded-full border border-foreground/20 bg-surface-input px-6 py-4">
            <Text size="sm" tone="secondary">
              Bare TextInput — no label / hint / error scaffold
            </Text>
          </View>
        </DontRow>

        <DontRow
          bad="Mixing `labelUppercase` and regular `label` in the same form"
          good="Pick one casing for the whole form so labels feel like one system"
        >
          <View className="gap-2">
            <TextField
              label="Email"
              labelUppercase
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <TextField
              label="Display name"
              value={labelled}
              onChangeText={setLabelled}
              placeholder="Type your name"
            />
          </View>
        </DontRow>

        <DontRow
          bad="Long-form helper copy in `hint`"
          good="Hints are one short line — anything longer belongs above the form as body copy"
        >
          <TextField
            label="Bio"
            hint="A short bio that describes who you are, what you do, what brings you here, and how others should think about you when they see your profile in the community feed."
            value={text}
            onChangeText={setText}
            placeholder="Tell us about yourself"
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
