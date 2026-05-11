import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const ACCENT_TONES: AccentHue[] = [
  'pink',
  'yellow',
  'cyan',
  'purple',
  'orange',
  'gold',
];

export default function AccentPillShowcase() {
  const [voice, setVoice] = useState<'female' | 'male'>('female');

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="AccentPill" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Small text pill used for status labels, category tags, biometric
          chips, voice toggles, and corner badges. Always rounded-full,
          tracked-caption text, optional leading + trailing icon.
        </Text>
        <Text size="sm" tone="tertiary">
          Choose vs. neighbors: `Badge` lives inside a list row or beside a
          heading — it&apos;s purely informational and uses the same
          tracked-caption style but is tied to the badge family (also used for
          `solid` notification dots). `AccentPill` is for free-floating
          accent-coded labels (e.g. a meditation flow&apos;s "DOPAMINE" tag, a
          card&apos;s "Most Popular" corner). `Button size="xs"` for tappable
          CTAs. `IconChip` for icon-only square / circular chips. `ChipSelect`
          for interactive multi-select chip rows.
        </Text>
      </Section>

      <Section title="Variants">
        <PropRow
          label='variant="neutral" (default)'
          note="foreground/5 bg + foreground/10 border. Quiet by default; tone (if passed) colors the icon + label without dressing the chrome."
        >
          <View className="flex-row flex-wrap gap-2">
            <AccentPill label="Active flow: Tai Chi" />
            <AccentPill label="Grounding active" />
            <AccentPill
              label="5 MIN"
              icon={(color) => (
                <MaterialIcons name="schedule" size={12} color={color} />
              )}
            />
          </View>
        </PropRow>

        <PropRow
          label='variant="tinted"'
          note="bg-tone/10 + border-tone/25 + tone-colored text. For accent-coded labels (dopamine cyan, energy pink, etc.)."
        >
          <View className="flex-row flex-wrap gap-2">
            <AccentPill
              variant="tinted"
              tone="pink"
              label="142 BPM"
              icon={(color) => (
                <MaterialIcons name="favorite" size={12} color={color} />
              )}
            />
            <AccentPill
              variant="tinted"
              tone="cyan"
              label="DOPAMINE"
              icon={(color) => (
                <MaterialIcons name="bolt" size={12} color={color} />
              )}
            />
            <AccentPill variant="tinted" tone="yellow" label="SUNNY ENERGY" />
          </View>
        </PropRow>

        <PropRow
          label='variant="solid"'
          note="Solid accent bg + dark text. Use sparingly — only for high-priority moments like 'Most Popular' or feature flags. Yellow / gold / cyan / orange work best (light accents); pink / purple solids feel heavy."
        >
          <View className="flex-row flex-wrap gap-2">
            <AccentPill variant="solid" tone="yellow" label="Most Popular" />
            <AccentPill variant="solid" tone="gold" label="Premium" />
          </View>
        </PropRow>
      </Section>

      <Section title="Sizes">
        <PropRow
          label='size="sm" (default)'
          note="px-3 py-1, 12px icon, gap-1.5. Use inside lists / corners / inline next to titles."
        >
          <View className="flex-row gap-2">
            <AccentPill label="STATUS" />
            <AccentPill variant="tinted" tone="pink" label="LIVE" />
          </View>
        </PropRow>

        <PropRow
          label='size="md"'
          note="px-3.5 py-1.5, 14px icon, gap-2. Use for standalone status banners or tappable toggles."
        >
          <View className="flex-row gap-2">
            <AccentPill size="md" label="Active flow: Tai Chi" />
            <AccentPill
              size="md"
              variant="tinted"
              tone="cyan"
              label="GROUNDING"
              icon={(color) => (
                <MaterialIcons name="terrain" size={14} color={color} />
              )}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Tones (tinted)">
        <View className="flex-row flex-wrap gap-2">
          {ACCENT_TONES.map((tone) => (
            <AccentPill
              key={tone}
              variant="tinted"
              tone={tone}
              label={tone.toUpperCase()}
            />
          ))}
        </View>
      </Section>

      <Section title="Content shapes">
        <PropRow label="Label only" note="Smallest shape — pure status text.">
          <AccentPill label="ANALYZING" />
        </PropRow>

        <PropRow
          label="Leading icon"
          note="Icon + label — most common for accent-coded tags."
        >
          <AccentPill
            variant="tinted"
            tone="pink"
            label="142 BPM"
            icon={(color) => (
              <MaterialIcons name="favorite" size={12} color={color} />
            )}
          />
        </PropRow>

        <PropRow
          label="Leading + trailing icon"
          note="For tappable toggles that hint at the swap action."
        >
          <AccentPill
            label={voice === 'female' ? 'Female voice' : 'Male voice'}
            icon={(color) => (
              <MaterialIcons
                name={voice === 'female' ? 'female' : 'male'}
                size={12}
                color={color}
              />
            )}
            trailingIcon={(color) => (
              <MaterialIcons name="swap-horiz" size={12} color={color} />
            )}
            onPress={() =>
              setVoice((v) => (v === 'female' ? 'male' : 'female'))
            }
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Practice list row category tags"
          note="Alternating accent tones on category chips so the eye can scan by hue."
        >
          <View className="flex-row flex-wrap gap-2">
            <AccentPill variant="tinted" tone="pink" label="BREATH" />
            <AccentPill variant="tinted" tone="yellow" label="MOVEMENT" />
            <AccentPill variant="tinted" tone="cyan" label="DOPAMINE" />
            <AccentPill variant="tinted" tone="purple" label="OXYTOCIN" />
          </View>
        </PropRow>

        <PropRow
          label="Session control toggle (md, tappable)"
          note="Voice swap pill — single tappable surface."
        >
          <AccentPill
            size="md"
            label="Female voice"
            icon={(color) => (
              <MaterialIcons name="female" size={14} color={color} />
            )}
            trailingIcon={(color) => (
              <MaterialIcons name="swap-horiz" size={14} color={color} />
            )}
            onPress={() => {}}
          />
        </PropRow>

        <PropRow
          label="Corner badge over a card"
          note="Use absolute positioning via className — AccentPill defaults to relative."
        >
          <View
            className="overflow-hidden rounded-3xl bg-foreground/5 p-5"
            style={{ height: 120 }}
          >
            <AccentPill
              variant="solid"
              tone="yellow"
              label="Most Popular"
              className="absolute right-4 top-4"
            />
            <Text size="lg" weight="bold">
              Premium plan
            </Text>
            <Text size="sm" tone="secondary">
              Everything unlocked
            </Text>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using AccentPill for tappable CTAs"
          good="If the pill is the primary action of a screen / form, use `Button size='xs'`. AccentPill onPress is for inline toggles (voice swap, mode switch) — not navigation."
        />

        <DontRow
          bad="Long multi-word labels (3+ words)"
          good="Caption-style pills hold 1–3 words. For longer labels use a `Badge` or just a sentence with `treatment='caption'`."
        />

        <DontRow
          bad="Solid variant for purple / pink (high-contrast accents)"
          good="Solid pink / purple read as heavy stickers. Use tinted for those tones; solid is reserved for lighter accents (yellow / gold / cyan / orange)."
        />

        <DontRow
          bad="Stacking 4+ pills in a single row"
          good="3 pills max per row before they compete with the screen's primary content. If you need more, switch to a `ChipSelect` (more compact + interactive) or pivot to a list view."
        />

        <DontRow
          bad="Mixing variants on the same row"
          good="Pick one variant per group (all tinted, all neutral). Mixing variants makes the row feel inconsistent."
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
