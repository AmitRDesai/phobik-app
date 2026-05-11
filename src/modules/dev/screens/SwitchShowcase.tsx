import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Switch } from '@/components/ui/Switch';
import { useState } from 'react';

export default function SwitchShowcase() {
  const [basicOn, setBasicOn] = useState(true);
  const [basicOff, setBasicOff] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [anonymous, setAnonymous] = useState(false);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Switch" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Themed binary toggle. Wraps the platform Switch with the brand pink
          track-on color, a theme-aware track-off (foreground/10), and a white
          thumb — so callers stop redefining trackColor/thumbColor at every
          settings row.
        </Text>
        <Text size="sm" tone="tertiary">
          Use for independent on/off choices (notification, biometric unlock,
          anonymous post). For mutually-exclusive options reach for
          SegmentedControl; for selecting from a set use SelectionCard.
        </Text>
      </Section>

      <Section title="States">
        <PropRow label="value={true}">
          <View className="flex-row items-center justify-between">
            <Text size="sm">Switched on</Text>
            <Switch value={basicOn} onValueChange={setBasicOn} />
          </View>
        </PropRow>

        <PropRow label="value={false}">
          <View className="flex-row items-center justify-between">
            <Text size="sm">Switched off</Text>
            <Switch value={basicOff} onValueChange={setBasicOff} />
          </View>
        </PropRow>

        <PropRow
          label="disabled (rejects taps)"
          note="Use sparingly — a disabled toggle confuses users unless the reason is obvious from surrounding context."
        >
          <View className="flex-row items-center justify-between">
            <Text size="sm" tone="secondary">
              Disabled on
            </Text>
            <Switch value disabled onValueChange={() => {}} />
          </View>
          <View className="flex-row items-center justify-between">
            <Text size="sm" tone="secondary">
              Disabled off
            </Text>
            <Switch value={false} disabled onValueChange={() => {}} />
          </View>
        </PropRow>

        <PropRow label="Interactive" note={`value=${interactive}`}>
          <View className="flex-row items-center justify-between">
            <Text size="sm">Tap to toggle</Text>
            <Switch value={interactive} onValueChange={setInteractive} />
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Settings list (label + description + switch right)"
          note="Canonical layout: label on the left, optional description below, switch flush-right. Tap target lives on the switch itself — the row isn't pressable."
        >
          <Card variant="raised" size="md" className="gap-4">
            <SettingsRow
              label="Push notifications"
              description="Daily check-in reminders + new community activity."
              value={notifPush}
              onValueChange={setNotifPush}
            />
            <SettingsRow
              label="Email digest"
              description="Weekly summary delivered Sunday mornings."
              value={notifEmail}
              onValueChange={setNotifEmail}
            />
            <SettingsRow
              label="Weekly insights report"
              value={notifWeekly}
              onValueChange={setNotifWeekly}
            />
          </Card>
        </PropRow>

        <PropRow
          label="Biometric unlock toggle"
          note="Single-purpose toggle on its own screen — pair with explanatory body copy above."
        >
          <View className="rounded-2xl border border-foreground/10 p-4">
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1 gap-1">
                <Text size="md" weight="semibold">
                  Face ID unlock
                </Text>
                <Text size="xs" tone="secondary">
                  Use Face ID to open the app instead of typing your password.
                </Text>
              </View>
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                accessibilityLabel="Toggle Face ID unlock"
              />
            </View>
          </View>
        </PropRow>

        <PropRow
          label="Inline form flag (e.g. anonymous post)"
          note="Form-adjacent flag — switch lives below the input it modifies."
        >
          <View className="gap-3 rounded-2xl border border-foreground/10 p-4">
            <Text size="sm" tone="secondary">
              Your post will appear in the community feed.
            </Text>
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1">
                <Text size="sm" weight="semibold">
                  Post anonymously
                </Text>
                <Text size="xs" tone="tertiary">
                  Hide your name + avatar from this post only.
                </Text>
              </View>
              <Switch
                value={anonymous}
                onValueChange={setAnonymous}
                accessibilityLabel="Post anonymously"
              />
            </View>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using Switch for mutually-exclusive options"
          good="Three-state radio (Light / Dark / System)? Use SegmentedControl or SelectionCard. Switch is strictly binary."
        />

        <DontRow
          bad="A switch with no nearby label"
          good="A floating switch with no caption is meaningless. Always pair with a label (and ideally a short description)."
        />

        <DontRow
          bad="A switch buried beneath a description it controls"
          good="Switch sits on the right of the row at the top so users see the state before reading the explanation."
        />

        <DontRow
          bad="Tapping the whole row toggles the switch"
          good="The tap target is the switch itself — making the row pressable invites accidental toggles when users mean to read."
        />

        <DontRow
          bad="Redefining trackColor / thumbColor at the call site"
          good="The primitive bakes in the brand colors. Reaching past it to RN's Switch fragments the toggle look across the app."
        />
      </Section>
    </Screen>
  );
}

function SettingsRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <View className="flex-1 gap-0.5">
        <Text size="sm" weight="semibold">
          {label}
        </Text>
        {description ? (
          <Text size="xs" tone="secondary">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
      />
    </View>
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
