import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Accordion, type AccordionVariant } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { Switch } from '@/components/ui/Switch';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const VARIANT_NOTES: Record<AccordionVariant, string> = {
  flat: 'Bordered row, no fill (default). Use for FAQ lists, settings groups.',
  card: 'Raised-card chrome. Use for hero / feature panels with a tappable summary.',
};

const FAQ = [
  {
    q: 'How does the daily check-in work?',
    a: 'Each morning we ask one short question about how you slept and how you feel. Your answers feed into the energy score on your dashboard and tune what we suggest next.',
  },
  {
    q: 'Can I use the app offline?',
    a: 'Yes — journal entries, gentle letters, empathy challenge, and self check-ins all work fully offline. Changes sync once you reconnect.',
  },
  {
    q: 'Is my data private?',
    a: 'Reflections never leave your account. AI coach conversations are processed by a 3rd-party model; see Settings → Data Privacy for the full breakdown.',
  },
];

export default function AccordionShowcase() {
  const [controlled, setControlled] = useState(true);
  const [pushOn, setPushOn] = useState(true);
  const [emailOn, setEmailOn] = useState(false);

  return (
    <Screen
      variant="default"
      scroll
      header={<ShowcaseHeader title="Accordion" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Expandable row — header is always visible, content below animates in /
          out keyed to the content&apos;s measured height (no caller-supplied
          height constant needed).
        </Text>
        <Text size="sm" tone="tertiary">
          Use for FAQ, settings groups, "see more" details. For tap-to-open
          single-select choices, reach for `DropdownSelect` — that one opens a
          sheet of `SelectionCard`s rather than expanding inline.
        </Text>
      </Section>

      <Section title="Variants">
        <PropRow label='variant="flat" (default)' note={VARIANT_NOTES.flat}>
          <View>
            <Accordion title="What is the energy score?" defaultExpanded>
              <Text size="sm" tone="secondary">
                A 0–100 daily roll-up of your D.O.S.E. chemicals (Dopamine,
                Oxytocin, Serotonin, Endorphins) — each contributes 25 points
                based on yesterday&apos;s actions.
              </Text>
            </Accordion>
            <Accordion title="How do I improve it?">
              <Text size="sm" tone="secondary">
                Complete daily check-ins, practices, and reflections. Each one
                taps a different chemical pillar.
              </Text>
            </Accordion>
            <Accordion title="Can I see history?">
              <Text size="sm" tone="secondary">
                Yes — open the Insights tab to see daily / weekly / monthly
                history with a sparkline.
              </Text>
            </Accordion>
          </View>
        </PropRow>

        <PropRow label='variant="card"' note={VARIANT_NOTES.card}>
          <Accordion
            variant="card"
            title="Premium features"
            subtitle="What you unlock with a subscription"
            icon={
              <MaterialIcons
                name="star"
                size={22}
                color={colors.primary.pink}
              />
            }
          >
            <View className="gap-2">
              <Text size="sm">• Unlimited AI coach conversations</Text>
              <Text size="sm">• Custom voice training</Text>
              <Text size="sm">• Advanced insights + exports</Text>
              <Text size="sm">• Family sharing (up to 5)</Text>
            </View>
          </Accordion>
        </PropRow>
      </Section>

      <Section title="Sizes">
        <PropRow
          label='size="md" (default)'
          note="Standard list-row chrome. px-4 py-3.5"
        >
          <Accordion title="Standard size row" defaultExpanded>
            <Text size="sm" tone="secondary">
              Default padding makes the row read as a primary list item.
            </Text>
          </Accordion>
        </PropRow>

        <PropRow
          label='size="sm"'
          note="Compact chrome. px-3 py-2.5. Use in dense lists or nested groups."
        >
          <View>
            <Accordion size="sm" title="Compact row 1">
              <Text size="sm" tone="secondary">
                Compact accordions read as secondary information.
              </Text>
            </Accordion>
            <Accordion size="sm" title="Compact row 2">
              <Text size="sm" tone="secondary">
                Good for nested groups, deep settings lists.
              </Text>
            </Accordion>
          </View>
        </PropRow>
      </Section>

      <Section title="Control modes">
        <PropRow
          label="Uncontrolled (default)"
          note="State is owned by the accordion. Optionally pass `defaultExpanded` for the initial state."
        >
          <View>
            <Accordion title="Starts collapsed">
              <Text size="sm" tone="secondary">
                Tap to open. No state plumbing required.
              </Text>
            </Accordion>
            <Accordion title="Starts expanded" defaultExpanded>
              <Text size="sm" tone="secondary">
                Same as above but starts open.
              </Text>
            </Accordion>
          </View>
        </PropRow>

        <PropRow
          label={`Controlled — expanded={${controlled}}`}
          note="Pass `expanded` + `onToggle` to drive the state from outside (useful for accordion groups, search-filtered FAQs, etc.)."
        >
          <View className="gap-3">
            <Accordion
              title="External-controlled row"
              expanded={controlled}
              onToggle={setControlled}
            >
              <Text size="sm" tone="secondary">
                Tap me OR the button below — both flip the same state.
              </Text>
            </Accordion>
            <Button
              size="sm"
              variant="secondary"
              onPress={() => setControlled((v) => !v)}
            >
              External toggle
            </Button>
          </View>
        </PropRow>
      </Section>

      <Section title="Content shapes">
        <PropRow
          label="Plain text body"
          note="The simplest case — paragraph copy inside."
        >
          <Accordion title="What is mindfulness?" defaultExpanded>
            <Text size="sm" tone="secondary">
              Mindfulness is paying attention to the present moment without
              judgment. It&apos;s a skill you build through practice.
            </Text>
          </Accordion>
        </PropRow>

        <PropRow
          label="With icon + subtitle"
          note="Header gains a leading icon + secondary line."
        >
          <Accordion
            variant="card"
            title="Notifications"
            subtitle="Daily reminders + new community activity"
            icon={
              <MaterialIcons
                name="notifications"
                size={22}
                color={colors.primary.pink}
              />
            }
          >
            <View className="gap-4">
              <SettingsRow
                label="Push notifications"
                value={pushOn}
                onValueChange={setPushOn}
              />
              <SettingsRow
                label="Email digest"
                value={emailOn}
                onValueChange={setEmailOn}
              />
            </View>
          </Accordion>
        </PropRow>

        <PropRow
          label="Rich content (form / action)"
          note="Body can be anything — including a Switch row, a Button, or further nested components."
        >
          <Accordion
            variant="card"
            title="Manage your data"
            icon={
              <MaterialIcons
                name="shield"
                size={22}
                color={colors.accent.cyan}
              />
            }
          >
            <View className="gap-3">
              <Text size="sm" tone="secondary">
                Export or delete all the data we&apos;ve collected on your
                behalf — your reflections, conversations, and biometrics.
              </Text>
              <View className="flex-row gap-2">
                <Button size="sm" variant="secondary">
                  Export data
                </Button>
                <Button size="sm" variant="destructive">
                  Delete account
                </Button>
              </View>
            </View>
          </Accordion>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="FAQ list (flat, multiple rows)">
          <Card variant="raised" size="md">
            {FAQ.map((item) => (
              <Accordion key={item.q} title={item.q}>
                <Text size="sm" tone="secondary">
                  {item.a}
                </Text>
              </Accordion>
            ))}
          </Card>
        </PropRow>

        <PropRow label="Settings group (card, with icon + subtitle)">
          <Accordion
            variant="card"
            title="Privacy"
            subtitle="Control what we collect"
            icon={
              <MaterialIcons
                name="lock"
                size={22}
                color={colors.accent.purple}
              />
            }
          >
            <View className="gap-4">
              <SettingsRow
                label="Anonymous analytics"
                value={pushOn}
                onValueChange={setPushOn}
              />
              <SettingsRow
                label="Personalized recommendations"
                value={emailOn}
                onValueChange={setEmailOn}
              />
            </View>
          </Accordion>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Multiple Accordions all defaultExpanded"
          good="If everything starts open, the accordion is doing nothing. Open by default only when the content is critical / the user is mid-flow."
        />

        <DontRow
          bad="Hiding primary actions behind an Accordion"
          good="If the user is going to tap the action anyway, surface it inline. Accordion is for secondary / context-on-demand."
        />

        <DontRow
          bad="Nesting Accordions inside Accordions inside Accordions"
          good="One level of nesting tolerable; two+ feels like a maze. Flatten with sections / headings instead."
        />

        <DontRow
          bad="Very long content inside one Accordion (full article)"
          good="Past a screen-height of content, the user can't tell what's in / out of the panel. Split into multiple Accordions or a separate screen."
        />

        <DontRow
          bad="Using Accordion to swap between mutex options"
          good="Accordion shows / hides extra content. For picking one of N options, use SegmentedControl, DropdownSelect, or SelectionCard."
        />
      </Section>
    </Screen>
  );
}

function SettingsRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text size="sm" weight="semibold">
        {label}
      </Text>
      <Switch value={value} onValueChange={onValueChange} />
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
