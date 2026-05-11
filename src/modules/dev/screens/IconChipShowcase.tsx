import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import {
  IconChip,
  type IconChipShape,
  type IconChipSize,
} from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { accentFor, type AccentHue } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

const SIZES: IconChipSize[] = ['sm', 'md', 'lg'];

const SIZE_NOTES: Record<IconChipSize, string> = {
  sm: '32px square — list rows, inline labels',
  md: '40px square (default) — card headers, primary chips',
  lg: '48px square — hero / feature tiles',
};

const SHAPES: IconChipShape[] = ['rounded', 'circle', 'square'];

const SHAPE_NOTES: Record<IconChipShape, string> = {
  rounded: '12px radius (default) — most card / list use',
  circle: 'fully rounded — avatars, status pills',
  square: '8px radius — dense grids, hard-edged moodboards',
};

const TONES: AccentHue[] = [
  'pink',
  'yellow',
  'cyan',
  'purple',
  'orange',
  'gold',
];

export default function IconChipShowcase() {
  const scheme = useScheme();

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="IconChip" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <IconChip size={size}>
              <MaterialIcons
                name="favorite"
                size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
                color={accentFor(scheme, 'pink')}
              />
            </IconChip>
          </PropRow>
        ))}
        <PropRow
          label="size={64}"
          note="Custom number — escape hatch for one-off larger chips"
        >
          <IconChip size={64} tone="pink">
            {(color) => (
              <MaterialIcons name="favorite" size={32} color={color} />
            )}
          </IconChip>
        </PropRow>
      </Section>

      <Section title="Shapes">
        {SHAPES.map((shape) => (
          <PropRow
            key={shape}
            label={`shape="${shape}"`}
            note={SHAPE_NOTES[shape]}
          >
            <IconChip shape={shape} tone="cyan">
              {(color) => <MaterialIcons name="bolt" size={20} color={color} />}
            </IconChip>
          </PropRow>
        ))}
      </Section>

      <Section title="Tones (render-prop auto-colors the icon)">
        <Text size="sm" tone="tertiary">
          Pass `tone` to tint the bg at 15% accent and receive the resolved
          accent color via the children render-prop.
        </Text>
        <View className="flex-row flex-wrap items-center gap-3">
          {TONES.map((tone) => (
            <View key={tone} className="items-center gap-1">
              <IconChip tone={tone}>
                {(color) => (
                  <MaterialIcons name="star" size={20} color={color} />
                )}
              </IconChip>
              <Text size="xs" tone="tertiary" className="font-mono">
                {tone}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Neutral (no tone)">
        <Text size="sm" tone="tertiary">
          Drop `tone` for a theme-aware neutral chip (foreground/8 bg,
          foreground/85 icon). Use for generic actions where no category color
          applies.
        </Text>
        <View className="flex-row items-center gap-3">
          <IconChip>
            {(color) => (
              <MaterialIcons name="settings" size={20} color={color} />
            )}
          </IconChip>
          <IconChip shape="circle">
            {(color) => <MaterialIcons name="person" size={20} color={color} />}
          </IconChip>
          <IconChip shape="square">
            {(color) => <MaterialIcons name="folder" size={20} color={color} />}
          </IconChip>
        </View>
      </Section>

      <Section title="Shape × tone matrix">
        {TONES.map((tone) => (
          <View key={tone} className="flex-row flex-wrap items-center gap-3">
            {SHAPES.map((shape) => (
              <IconChip key={shape} tone={tone} shape={shape}>
                {(color) => (
                  <MaterialIcons name="bolt" size={20} color={color} />
                )}
              </IconChip>
            ))}
            <Text size="xs" tone="tertiary" className="font-mono">
              {tone}
            </Text>
          </View>
        ))}
      </Section>

      <Section title="Custom bg / border (escape hatches)">
        <PropRow
          label="bg + border"
          note="Override resolved bg + add a border — useful when chip needs to live on top of a colored surface"
        >
          <View className="flex-row items-center gap-3">
            <IconChip bg="#1a1a1a" border="rgba(255,255,255,0.15)">
              <MaterialIcons name="lock" size={20} color="#FFD700" />
            </IconChip>
            <IconChip tone="purple" border={accentFor(scheme, 'purple')}>
              {(color) => (
                <MaterialIcons name="check" size={20} color={color} />
              )}
            </IconChip>
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Card header icon (md, rounded, tone)">
          <Card variant="raised" size="md">
            <View className="flex-row items-center gap-3">
              <IconChip tone="yellow">
                {(color) => (
                  <MaterialIcons name="bolt" size={20} color={color} />
                )}
              </IconChip>
              <View className="flex-1">
                <Text size="md" weight="semibold">
                  Energy Boost
                </Text>
                <Text size="sm" tone="secondary">
                  5-min reset routine
                </Text>
              </View>
            </View>
          </Card>
        </PropRow>

        <PropRow label="Avatar slot (sm, circle, neutral)">
          <View className="flex-row items-center gap-2">
            <IconChip size="sm" shape="circle">
              {(color) => (
                <MaterialIcons name="person" size={16} color={color} />
              )}
            </IconChip>
            <Text size="sm">@johnsmith</Text>
          </View>
        </PropRow>

        <PropRow label="Feature tile (lg, square, tone)">
          <View className="flex-row flex-wrap gap-3">
            {(
              [
                { tone: 'pink', icon: 'self-improvement', label: 'Breathe' },
                { tone: 'cyan', icon: 'water-drop', label: 'Hydrate' },
                { tone: 'yellow', icon: 'wb-sunny', label: 'Light' },
              ] as const
            ).map((tile) => (
              <View key={tile.label} className="items-center gap-1">
                <IconChip size="lg" shape="square" tone={tile.tone}>
                  {(color) => (
                    <MaterialIcons name={tile.icon} size={24} color={color} />
                  )}
                </IconChip>
                <Text size="xs" tone="secondary">
                  {tile.label}
                </Text>
              </View>
            ))}
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Hardcoding bg with raw hex instead of `tone`"
          good="Use `tone` so the chip adapts to light + dark mode"
        >
          <IconChip bg="#FFD700">
            <MaterialIcons name="bolt" size={20} color="#000" />
          </IconChip>
        </DontRow>

        <DontRow
          bad="Render-prop ignored — icon color drifts from chip tone"
          good="Use the render-prop so icon color = resolved tone"
        >
          <IconChip tone="cyan">
            <MaterialIcons name="bolt" size={20} color="#FF4D94" />
          </IconChip>
        </DontRow>

        <DontRow
          bad="Tiny icon inside a large chip (looks empty)"
          good="Match icon size to chip — ~50% of chip edge is a good rule"
        >
          <IconChip size="lg" tone="purple">
            {(color) => <MaterialIcons name="star" size={10} color={color} />}
          </IconChip>
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
