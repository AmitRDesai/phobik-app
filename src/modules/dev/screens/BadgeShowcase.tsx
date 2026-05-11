import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import {
  Badge,
  type BadgeSize,
  type BadgeVariant,
} from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const VARIANTS: BadgeVariant[] = ['tinted', 'outline', 'solid'];

const VARIANT_NOTES: Record<BadgeVariant, string> = {
  tinted: '15% tinted bg + 30% border + accent text (default)',
  outline: 'transparent bg + 30% border + accent text',
  solid: 'saturated bg + white text (no border)',
};

const SIZES: BadgeSize[] = ['sm', 'md'];

const SIZE_NOTES: Record<BadgeSize, string> = {
  sm: '10px label · px 2.5 · py 0.5 (default)',
  md: '12px label · px 3 · py 1',
};

const TONES: AccentHue[] = [
  'pink',
  'yellow',
  'cyan',
  'purple',
  'orange',
  'gold',
];

export default function BadgeShowcase() {
  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Badge" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="Variants — default tone (pink)">
        {VARIANTS.map((variant) => (
          <PropRow
            key={variant}
            label={`variant="${variant}"`}
            note={VARIANT_NOTES[variant]}
          >
            <View className="flex-row flex-wrap items-center gap-2">
              <Badge variant={variant}>{variant.toUpperCase()}</Badge>
            </View>
          </PropRow>
        ))}
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <View className="flex-row flex-wrap items-center gap-2">
              <Badge size={size} variant="tinted">
                Tinted
              </Badge>
              <Badge size={size} variant="outline">
                Outline
              </Badge>
              <Badge size={size} variant="solid">
                Solid
              </Badge>
            </View>
          </PropRow>
        ))}
      </Section>

      <Section title="Tones × variants">
        <Text size="sm" tone="tertiary">
          Tones derive from `accentFor(scheme, tone)` so they remain readable in
          both schemes.
        </Text>
        {TONES.map((tone) => (
          <View key={tone} className="gap-1">
            <Text size="xs" tone="tertiary" className="font-mono">
              tone=&quot;{tone}&quot;
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              <Badge tone={tone} variant="tinted">
                Tinted
              </Badge>
              <Badge tone={tone} variant="outline">
                Outline
              </Badge>
              <Badge tone={tone} variant="solid">
                Solid
              </Badge>
            </View>
          </View>
        ))}
      </Section>

      <Section title="With leading icon">
        <Text size="sm" tone="tertiary">
          Pass `icon` as a ReactNode OR a function that receives the resolved
          text color — handy for matching the icon to the badge tone.
        </Text>
        <PropRow label="Function-style icon (auto color match)">
          <View className="flex-row flex-wrap items-center gap-2">
            <Badge
              tone="yellow"
              icon={(color) => (
                <MaterialIcons name="bolt" size={10} color={color} />
              )}
            >
              Energized
            </Badge>
            <Badge
              tone="cyan"
              variant="outline"
              icon={(color) => (
                <MaterialIcons name="check" size={10} color={color} />
              )}
            >
              Complete
            </Badge>
            <Badge
              tone="purple"
              variant="solid"
              icon={(color) => (
                <MaterialIcons name="star" size={10} color={color} />
              )}
            >
              Premium
            </Badge>
          </View>
        </PropRow>
        <PropRow label="Static icon (manual color)">
          <Badge
            tone="pink"
            icon={<MaterialIcons name="favorite" size={10} color="#FF4D94" />}
          >
            Favorite
          </Badge>
        </PropRow>
      </Section>

      <Section title="Variant × tone matrix (every combination)">
        {TONES.map((tone) => (
          <View key={tone} className="flex-row flex-wrap items-center gap-2">
            {VARIANTS.map((variant) => (
              <Badge key={variant} tone={tone} variant={variant}>
                {tone}
              </Badge>
            ))}
          </View>
        ))}
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Eyebrow above title (tinted pink sm)">
          <View className="gap-1">
            <Badge>ASSESSMENT</Badge>
            <Text size="h2" weight="bold">
              The Pivot Point
            </Text>
          </View>
        </PropRow>

        <PropRow label="Status badge in list row (solid)">
          <Card>
            <View className="flex-row items-center justify-between">
              <View>
                <Text size="md" weight="semibold">
                  Morning Reset
                </Text>
                <Text size="sm" tone="secondary">
                  3 of 5 steps complete
                </Text>
              </View>
              <Badge tone="yellow" variant="solid">
                IN PROGRESS
              </Badge>
            </View>
          </Card>
        </PropRow>

        <PropRow label="Category chip group (outline)">
          <View className="flex-row flex-wrap items-center gap-2">
            <Badge tone="pink" variant="outline">
              Anxiety
            </Badge>
            <Badge tone="yellow" variant="outline">
              Sleep
            </Badge>
            <Badge tone="cyan" variant="outline">
              Focus
            </Badge>
            <Badge tone="purple" variant="outline">
              Relationships
            </Badge>
          </View>
        </PropRow>

        <PropRow label="Pattern label inside a card hero">
          <Card variant="raised" size="lg">
            <Badge tone="pink" className="self-start">
              PRIMARY PATTERN
            </Badge>
            <Text size="h2" weight="bold" className="mt-3">
              The Avoider
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              You retreat from conflict to stay safe.
            </Text>
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Long-form sentences inside a badge"
          good="Keep label ≤ 3 words — badges are eyebrow labels, not body copy"
        >
          <Badge>This is a long sentence inside a badge</Badge>
        </DontRow>

        <DontRow
          bad="Solid badge on a saturated bg (low contrast)"
          good="Use outline or tinted on saturated bgs"
        >
          <View className="rounded-md bg-primary-pink p-3">
            <Badge tone="pink" variant="solid">
              SOLID ON PINK
            </Badge>
          </View>
        </DontRow>

        <DontRow
          bad="Multiple solid badges side-by-side (visual noise)"
          good="One solid for the most important status; outline / tinted for the rest"
        >
          <View className="flex-row flex-wrap items-center gap-2">
            <Badge tone="pink" variant="solid">
              NEW
            </Badge>
            <Badge tone="yellow" variant="solid">
              POPULAR
            </Badge>
            <Badge tone="cyan" variant="solid">
              FEATURED
            </Badge>
            <Badge tone="purple" variant="solid">
              PREMIUM
            </Badge>
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
