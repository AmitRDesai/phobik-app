import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';

export default function DividerShowcase() {
  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Divider" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Theme-aware hairline divider. Two modes: a single full-width line, or
          a labeled `—— label ——` separator.
        </Text>
        <Text size="sm" tone="tertiary">
          Choose vs. neighbors: `Accordion` for collapsible sections, `Card`
          separation via gap-X instead of dividers when the cards have visible
          chrome. Reach for `Divider` when content groups need a low-noise
          visual break.
        </Text>
      </Section>

      <Section title="Variants">
        <PropRow
          label="Without label"
          note="A single foreground/10 hairline. Use between content groups inside a card or list."
        >
          <View className="gap-4">
            <Text size="md">Above the divider</Text>
            <Divider />
            <Text size="md">Below the divider</Text>
          </View>
        </PropRow>

        <PropRow
          label='With label ("or continue with")'
          note="Two flex-1 hairlines flanking centered tone='secondary' text. Use for section breaks between distinct action groups."
        >
          <View className="gap-4">
            <Text size="md" align="center">
              Sign in with email
            </Text>
            <Divider label="or continue with" />
            <Text size="md" align="center">
              Social providers
            </Text>
          </View>
        </PropRow>

        <PropRow
          label="With label (short)"
          note="Short labels work too — keeps the hairlines short on narrow screens."
        >
          <Divider label="and" />
        </PropRow>
      </Section>

      <Section title="Spacing via className">
        <PropRow
          label='className="my-4"'
          note="Spacing lives on the outer container. Use vertical margin (my-X) to space the divider from surrounding content."
        >
          <View>
            <Text size="md">Above</Text>
            <Divider label="break" className="my-4" />
            <Text size="md">Below</Text>
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Auth: between email form and social row"
          note="The exact pattern from SignIn / CreateAccount — primary form on top, divider with `or continue with`, social row below."
        >
          <View className="gap-4">
            <View className="h-10 rounded-lg bg-foreground/5" />
            <View className="h-10 rounded-lg bg-foreground/5" />
            <Divider label="or continue with" />
            <View className="h-10 flex-row items-center justify-center gap-3">
              <View className="h-10 w-10 rounded-full bg-foreground/5" />
              <View className="h-10 w-10 rounded-full bg-foreground/5" />
            </View>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Stacking dividers between every list row"
          good="Dividers compete with content; multiple = visual noise. Use gap-X spacing between items and a single divider only at section boundaries."
        />

        <DontRow
          bad="Wrapping a divider in a Card"
          good="Cards have their own chrome — adding a divider inside doubles the visual weight. Use the card's gap or border instead."
        />

        <DontRow
          bad="Multi-word label that wraps to two lines"
          good="Keep label to ~3 words max — `or continue with`, `or use email`, `and`. Longer prose belongs in a regular paragraph above/below."
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
