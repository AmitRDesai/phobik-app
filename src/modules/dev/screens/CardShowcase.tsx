import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card, type CardSize, type CardVariant } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const VARIANTS: CardVariant[] = ['flat', 'raised', 'toned'];

const VARIANT_NOTES: Record<CardVariant, string> = {
  flat: 'foreground/5 bg · neutral border · in-flow / list rows',
  raised: 'surface-elevated bg · neutral border · default subtle drop shadow',
  toned: 'accent border + tinted bg · requires `tone`',
};

const SIZES: CardSize[] = ['sm', 'md', 'lg'];

const SIZE_NOTES: Record<CardSize, string> = {
  sm: '12px padding · 12px radius',
  md: '16px padding · 16px radius (default)',
  lg: '24px padding · 24px radius',
};

const TONES: AccentHue[] = [
  'pink',
  'yellow',
  'cyan',
  'purple',
  'orange',
  'gold',
];

export default function CardShowcase() {
  return (
    <Screen
      variant="default"
      scroll
      header={<ShowcaseHeader title="Card" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="Variants — default size (md)">
        {VARIANTS.filter((v) => v !== 'toned').map((variant) => (
          <PropRow
            key={variant}
            label={`variant="${variant}"`}
            note={VARIANT_NOTES[variant]}
          >
            <Card variant={variant}>
              <Text size="md" weight="semibold">
                {variant.charAt(0).toUpperCase() + variant.slice(1)} card
              </Text>
              <Text size="sm" tone="secondary" className="mt-1">
                Short body copy describing the card content.
              </Text>
            </Card>
          </PropRow>
        ))}
        <PropRow label='variant="toned" tone="pink"' note={VARIANT_NOTES.toned}>
          <Card variant="toned" tone="pink">
            <Text size="md" weight="semibold">
              Toned card
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              Border + bg derive from the tone accent.
            </Text>
          </Card>
        </PropRow>
      </Section>

      <Section title="Size scale (decoupled from variant)">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <View className="gap-2">
              <Card variant="flat" size={size}>
                <Text size="sm" weight="semibold">
                  flat · {size}
                </Text>
              </Card>
              <Card variant="raised" size={size}>
                <Text size="sm" weight="semibold">
                  raised · {size}
                </Text>
              </Card>
            </View>
          </PropRow>
        ))}
      </Section>

      <Section title="Toned tones">
        <Text size="sm" tone="tertiary">
          `variant="toned"` requires a `tone`. Both border and bg derive from
          `accentFor(scheme, tone)` so it adapts to the active scheme.
        </Text>
        {TONES.map((tone) => (
          <PropRow key={tone} label={`tone="${tone}"`}>
            <Card variant="toned" tone={tone}>
              <Text size="md" weight="semibold">
                Tinted with {tone}
              </Text>
              <Text size="sm" tone="secondary" className="mt-1">
                Category-coded callout.
              </Text>
            </Card>
          </PropRow>
        ))}
      </Section>

      <Section title="Optional tone on flat / raised (border accent only)">
        <Text size="sm" tone="tertiary">
          Pass `tone` to a non-toned variant to subtly tint the border without
          filling the bg. Useful for color-coding cards by category.
        </Text>
        <PropRow label='variant="flat" tone="pink"'>
          <Card variant="flat" tone="pink">
            <Text size="md" weight="semibold">
              Pink-bordered flat
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              Bg stays neutral; only the border is tinted.
            </Text>
          </Card>
        </PropRow>
        <PropRow label='variant="raised" tone="cyan"'>
          <Card variant="raised" tone="cyan">
            <Text size="md" weight="semibold">
              Cyan-bordered raised
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              Same surface-elevated bg, cyan-tinted border.
            </Text>
          </Card>
        </PropRow>
      </Section>

      <Section title="Interactive (onPress + haptic + disabled)">
        <Text size="sm" tone="tertiary">
          Passing `onPress` makes the whole card tappable. Fires a light haptic
          by default (set `noHaptic` to suppress). `disabled` renders at 40%
          opacity for visible feedback.
        </Text>
        <PropRow label="flat + onPress">
          <Card onPress={() => {}}>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
                <MaterialIcons
                  name="favorite"
                  size={20}
                  color={colors.primary.pink}
                />
              </View>
              <View className="flex-1">
                <Text size="md" weight="semibold">
                  Daily reflection
                </Text>
                <Text size="sm" tone="secondary">
                  Tap — fires haptic + scales
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#888" />
            </View>
          </Card>
        </PropRow>
        <PropRow label="raised + onPress + disabled (40% opacity)">
          <Card variant="raised" onPress={() => {}} disabled>
            <Text size="md" weight="semibold">
              Disabled card
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              Press is blocked; opacity drops so users see why.
            </Text>
          </Card>
        </PropRow>
      </Section>

      <Section title="Shadow override (colored glow)">
        <Text size="sm" tone="tertiary">
          On `raised`, `shadow` replaces the neutral default. On `flat` and
          `toned`, it adds a glow on top.
        </Text>
        <PropRow label="raised default (neutral drop shadow)">
          <Card variant="raised" size="lg">
            <Text size="md" weight="semibold">
              Subtle default shadow
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              Theme-aware neutral drop — visible on plain bg.
            </Text>
          </Card>
        </PropRow>
        <PropRow label="raised + shadow={{ color: pink }}">
          <Card
            variant="raised"
            size="lg"
            shadow={{ color: colors.primary.pink }}
          >
            <Text size="md" weight="semibold">
              Pink halo
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              Custom shadow overrides the neutral default.
            </Text>
          </Card>
        </PropRow>
        <PropRow label="flat + shadow={{ color: yellow, opacity: 0.35, blur: 30 }}">
          <Card
            shadow={{ color: colors.accent.yellow, opacity: 0.35, blur: 30 }}
          >
            <Text size="md" weight="semibold">
              Glowing flat card
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              Adds the glow on top of the flat surface.
            </Text>
          </Card>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="List row (flat + onPress + chevron)">
          <Card onPress={() => {}}>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-pink/15">
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={colors.primary.pink}
                />
              </View>
              <View className="flex-1">
                <Text size="md" weight="semibold">
                  Private Journal
                </Text>
                <Text size="sm" tone="secondary">
                  Encrypted reflections
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#888" />
            </View>
          </Card>
        </PropRow>

        <PropRow label="Hero panel (raised + lg)">
          <Card variant="raised" size="lg">
            <Text size="h3" weight="bold">
              Ready to begin?
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              Estimated duration: 3-5 minutes
            </Text>
            <View className="mt-4">
              <Button>Start Session</Button>
            </View>
          </Card>
        </PropRow>

        <PropRow label="Toned notice (toned + yellow)">
          <Card variant="toned" tone="yellow">
            <View className="flex-row items-start gap-3">
              <MaterialIcons
                name="info-outline"
                size={20}
                color={colors.accent.yellow}
              />
              <View className="flex-1">
                <Text size="sm" weight="semibold">
                  Notification permission needed
                </Text>
                <Text size="sm" tone="secondary" className="mt-1">
                  Enable notifications to receive your daily reminders.
                </Text>
              </View>
            </View>
          </Card>
        </PropRow>

        <PropRow label="Stat card pair (flat + sm)">
          <View className="flex-row gap-3">
            <Card size="sm" className="flex-1">
              <Text size="xs" treatment="caption" tone="tertiary">
                Heart Rate
              </Text>
              <Text size="h2" weight="black" className="mt-1">
                72{' '}
                <Text size="xs" tone="tertiary">
                  bpm
                </Text>
              </Text>
            </Card>
            <Card size="sm" className="flex-1">
              <Text size="xs" treatment="caption" tone="tertiary">
                Sleep
              </Text>
              <Text size="h2" weight="black" className="mt-1">
                7.2{' '}
                <Text size="xs" tone="tertiary">
                  hrs
                </Text>
              </Text>
            </Card>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad='variant="toned" without `tone`'
          good="Always pair toned with a tone — defaults to pink silently"
        >
          <Card variant="toned">
            <Text size="sm">Toned with no tone — defaults to pink</Text>
          </Card>
        </DontRow>

        <DontRow
          bad="Nested cards 3+ levels deep"
          good="At most 2 levels — flat inside a raised hero is fine"
        >
          <Card variant="raised" size="lg">
            <Text size="sm" weight="semibold">
              Outer (raised)
            </Text>
            <Card variant="flat" className="mt-2">
              <Text size="sm">Inner (flat)</Text>
              <Card variant="flat" className="mt-2">
                <Text size="sm">Too deep — don&apos;t do this</Text>
              </Card>
            </Card>
          </Card>
        </DontRow>

        <DontRow
          bad="Pressable Card containing a separate Button"
          good="Either the whole card is tappable OR controls are; not both"
        >
          <Card onPress={() => {}}>
            <View className="flex-row items-center justify-between">
              <Text size="md">Tappable card</Text>
              <Button size="xs" variant="secondary">
                Action
              </Button>
            </View>
          </Card>
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
