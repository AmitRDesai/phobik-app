import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';

export default function GradientTextShowcase() {
  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="GradientText" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Text masked with a LinearGradient — used for brand-forward hero
          titles. Powered by MaskedView so the gradient flows through the glyphs
          themselves.
        </Text>
        <Text size="sm" tone="tertiary">
          Limitation: `children` must be a plain string (no nested Text with
          mixed formatting). Use `className` for size + weight (NativeWind
          classes only — themed Text props don&apos;t apply here).
        </Text>
      </Section>

      <Section title="Default (pink → yellow horizontal)">
        <PropRow
          label="<GradientText className='text-4xl font-bold'>Title</GradientText>"
          note="No props — defaults to the brand pink→yellow horizontal sweep."
        >
          <GradientText className="text-4xl font-bold">
            Welcome back
          </GradientText>
        </PropRow>
      </Section>

      <Section title="Color pairs">
        <PropRow
          label="Brand (pink → yellow)"
          note="Default. The brand identity gradient."
        >
          <GradientText className="text-3xl font-bold">Phobik</GradientText>
        </PropRow>

        <PropRow
          label="Warm (pink → orange)"
          note="Energetic, used for hero CTAs."
        >
          <GradientText
            className="text-3xl font-bold"
            startColor={colors.primary.pink}
            endColor={colors.accent.orange}
          >
            Energy boost
          </GradientText>
        </PropRow>

        <PropRow
          label="Cool (cyan → purple)"
          note="Calm, used for reflection / meditation titles."
        >
          <GradientText
            className="text-3xl font-bold"
            startColor={colors.accent.cyan}
            endColor={colors.accent.purple}
          >
            Stay grounded
          </GradientText>
        </PropRow>

        <PropRow
          label="Mono (pink → pink-soft)"
          note="Single-hue tonal shift — quieter than pink→yellow, still brand-pink."
        >
          <GradientText
            className="text-3xl font-bold"
            startColor={colors.primary.pink}
            endColor={colors.primary['pink-soft']}
          >
            Gentle nudge
          </GradientText>
        </PropRow>

        <PropRow
          label="Sunset (orange → pink)"
          note="Warm onboarding flavor — matches the onboarding variant glow."
        >
          <GradientText
            className="text-3xl font-bold"
            startColor={colors.accent.orange}
            endColor={colors.primary.pink}
          >
            Begin your journey
          </GradientText>
        </PropRow>
      </Section>

      <Section title="Direction">
        <PropRow
          label="Horizontal (default)"
          note="start={{x:0,y:0}} end={{x:1,y:0}} — left-to-right sweep."
        >
          <GradientText className="text-3xl font-bold">Horizontal</GradientText>
        </PropRow>

        <PropRow
          label="Vertical"
          note="start={{x:0,y:0}} end={{x:0,y:1}} — top-to-bottom sweep."
        >
          <GradientText
            className="text-3xl font-bold"
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            Vertical
          </GradientText>
        </PropRow>

        <PropRow
          label="Diagonal"
          note="start={{x:0,y:0}} end={{x:1,y:1}} — top-left to bottom-right."
        >
          <GradientText
            className="text-3xl font-bold"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            Diagonal
          </GradientText>
        </PropRow>
      </Section>

      <Section title="Sizes (via className)">
        <PropRow label="text-2xl" note="Header-size body title.">
          <GradientText className="text-2xl font-bold">
            Medium heading
          </GradientText>
        </PropRow>

        <PropRow label="text-4xl">
          <GradientText className="text-4xl font-bold">Large hero</GradientText>
        </PropRow>

        <PropRow label="text-6xl" note="Display — splash / onboarding hero.">
          <GradientText className="text-6xl font-bold">Display</GradientText>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Hero greeting (splash / dashboard)">
          <View className="gap-1">
            <Text size="xs" treatment="caption" tone="tertiary">
              GOOD MORNING
            </Text>
            <GradientText className="text-4xl font-bold">John</GradientText>
            <Text size="sm" tone="secondary">
              Ready for today&apos;s reset?
            </Text>
          </View>
        </PropRow>

        <PropRow label="Brand wordmark (header / splash)">
          <View className="items-center">
            <GradientText className="text-5xl font-black tracking-tight">
              Phobik
            </GradientText>
          </View>
        </PropRow>

        <PropRow label="Numeric streak / milestone">
          <View className="flex-row items-baseline gap-2">
            <GradientText className="text-5xl font-black">14</GradientText>
            <Text size="md" tone="secondary">
              day streak
            </Text>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Body copy in GradientText"
          good="Gradient text is for hero / display titles only. Body copy reads worse with a gradient than with a flat foreground color."
        >
          <GradientText className="text-sm">
            This is a body paragraph rendered as gradient text and it is hard to
            read because the gradient distracts from the words.
          </GradientText>
        </DontRow>

        <DontRow
          bad="Tiny text with a gradient"
          good="At text-xs the gradient becomes invisible (the gradient cycle is wider than a glyph). Use plain Text instead."
        >
          <GradientText className="text-xs font-bold">
            Caption gradient — invisible
          </GradientText>
        </DontRow>

        <DontRow
          bad="Light gradient on a light surface"
          good="Yellow → cyan on light mode washes out. Pick saturated brand colors and ensure both stops have enough contrast against the bg."
        >
          <View className="rounded-md bg-white p-3">
            <GradientText
              className="text-3xl font-bold"
              startColor="#FFD700"
              endColor="#80FFFF"
            >
              Washed out
            </GradientText>
          </View>
        </DontRow>

        <DontRow
          bad="More than one gradient title per screen"
          good="GradientText is an attention magnet. Multiple gradients on one screen compete and dilute the brand signal."
        >
          <View className="gap-2">
            <GradientText className="text-3xl font-bold">
              First gradient
            </GradientText>
            <GradientText className="text-3xl font-bold">
              Second gradient
            </GradientText>
            <GradientText className="text-3xl font-bold">
              Third gradient
            </GradientText>
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
