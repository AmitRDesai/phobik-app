import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BiometricStatCard } from '@/components/ui/BiometricStatCard';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function BiometricStatCardShowcase() {
  const [selected, setSelected] = useState<'5' | '10' | '15'>('10');

  return (
    <Screen
      variant="default"
      scroll
      header={<ShowcaseHeader title="BiometricStatCard" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Compact stat tile for session screens — eyebrow label + big numeric
          value + optional unit + optional tone-coded icon. Used in meditation /
          breathing / movement session bottoms to display heart rate, HRV,
          duration, pace, breath count, etc.
        </Text>
        <Text size="sm" tone="tertiary">
          Compose 2–3 tiles in a `flex-row gap-3` row. Each tile takes `flex-1`
          to share width equally. Use `isStale` to show a dash placeholder when
          the live data is missing or older than your freshness window.
        </Text>
      </Section>

      <Section title="Basic shapes">
        <PropRow
          label="Label + value (no unit, no icon)"
          note="The simplest shape — for time-style values that don't need a unit."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              className="flex-1"
              label="DURATION"
              value="03:42"
            />
            <BiometricStatCard
              className="flex-1"
              label="REMAINING"
              value="06:18"
            />
          </View>
        </PropRow>

        <PropRow
          label="Label + value + unit"
          note="Unit sits next to the value, baseline-aligned, tracking-caption."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              className="flex-1"
              label="HEART RATE"
              value="72"
              unit="BPM"
            />
            <BiometricStatCard
              className="flex-1"
              label="HRV"
              value="45"
              unit="MS"
            />
          </View>
        </PropRow>

        <PropRow
          label="With icon"
          note="Icon sits in the eyebrow row alongside the label. Pass `tone` to color-code it."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              className="flex-1"
              label="HEART RATE"
              value="72"
              unit="BPM"
              tone="pink"
              icon={(color) => (
                <MaterialIcons name="favorite" size={14} color={color} />
              )}
            />
            <BiometricStatCard
              className="flex-1"
              label="HRV"
              value="45"
              unit="MS"
              tone="yellow"
              icon={(color) => (
                <MaterialIcons name="monitor-heart" size={14} color={color} />
              )}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Sizes">
        <PropRow
          label='size="sm" (default)'
          note="px-4 py-3, lg value. For 3-across rows and dense session bottoms."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              className="flex-1"
              label="DURATION"
              value="03:42"
            />
            <BiometricStatCard className="flex-1" label="BREATHS" value="12" />
            <BiometricStatCard
              className="flex-1"
              label="PACE"
              value="72"
              unit="BPM"
            />
          </View>
        </PropRow>

        <PropRow
          label='size="md"'
          note="px-5 py-4, h2 value. For 2-across rows where the stat is the dominant screen content."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              size="md"
              className="flex-1"
              label="HEART RATE"
              value="72"
              unit="BPM"
              tone="pink"
              icon={(color) => (
                <MaterialIcons name="favorite" size={18} color={color} />
              )}
            />
            <BiometricStatCard
              size="md"
              className="flex-1"
              label="HRV"
              value="45"
              unit="MS"
              tone="yellow"
              icon={(color) => (
                <MaterialIcons name="monitor-heart" size={18} color={color} />
              )}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Stale / missing data">
        <PropRow
          label="isStale={true}"
          note="Shows a `—` placeholder. Use when the live reading is unavailable or older than your freshness window (typically 30 min for HR / HRV)."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              className="flex-1"
              label="HEART RATE"
              value="72"
              unit="BPM"
              tone="pink"
              icon={(color) => (
                <MaterialIcons name="favorite" size={14} color={color} />
              )}
              isStale
            />
            <BiometricStatCard
              className="flex-1"
              label="HRV"
              value="45"
              unit="MS"
              tone="yellow"
              icon={(color) => (
                <MaterialIcons name="monitor-heart" size={14} color={color} />
              )}
              isStale
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Tappable">
        <PropRow
          label="onPress provided"
          note="Card gets selection haptic + active:opacity-80. Use for stats that drill into detail (e.g., tapping HR opens a trend view)."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              className="flex-1"
              label="HEART RATE"
              value="72"
              unit="BPM"
              tone="pink"
              icon={(color) => (
                <MaterialIcons name="favorite" size={14} color={color} />
              )}
              onPress={() => {}}
            />
            <BiometricStatCard
              className="flex-1"
              label="HRV"
              value="45"
              unit="MS"
              tone="yellow"
              icon={(color) => (
                <MaterialIcons name="monitor-heart" size={14} color={color} />
              )}
              onPress={() => {}}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Session bottom: 3 neutral stats"
          note="MeditationScreen pattern — duration + remaining + heart rate at the bottom of a session screen."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              className="flex-1"
              label="DURATION"
              value="03:42"
            />
            <BiometricStatCard
              className="flex-1"
              label="REMAINING"
              value="06:18"
            />
            <BiometricStatCard className="flex-1" label="BPM" value="72" />
          </View>
        </PropRow>

        <PropRow
          label="Breathing session: 2 tone-coded stats"
          note="Breathing478 pattern — HR (pink) + HRV (yellow), with leading icons."
        >
          <View className="flex-row gap-3">
            <BiometricStatCard
              size="md"
              className="flex-1"
              label="HR"
              value="72"
              unit="BPM"
              tone="pink"
              icon={(color) => (
                <MaterialIcons name="favorite" size={18} color={color} />
              )}
            />
            <BiometricStatCard
              size="md"
              className="flex-1"
              label="HRV"
              value="45"
              unit="MS"
              tone="yellow"
              icon={(color) => (
                <MaterialIcons name="monitor-heart" size={18} color={color} />
              )}
            />
          </View>
        </PropRow>

        <PropRow
          label="Kundalini pattern: duration toggle + live BPM"
          note="The duration card is a custom layout (toggle group inside a Card); the pace card is a BiometricStatCard. Mixing is fine when the toggle case is too bespoke for the primitive."
        >
          <View className="flex-row gap-3">
            <Card variant="raised" size="lg" className="flex-1 gap-2">
              <Text size="xs" treatment="caption" weight="bold" tone="tertiary">
                DURATION
              </Text>
              <View className="flex-row gap-2">
                {(['5', '10', '15'] as const).map((d) => {
                  const active = selected === d;
                  return (
                    <View
                      key={d}
                      className={
                        active
                          ? 'rounded-full bg-foreground/15 px-3 py-1'
                          : 'rounded-full bg-foreground/5 px-3 py-1'
                      }
                      onTouchEnd={() => setSelected(d)}
                    >
                      <Text size="xs" weight="bold">
                        {d}m
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>
            <BiometricStatCard
              size="md"
              className="flex-1"
              label="PACE"
              value="72"
              unit="BPM"
              tone="yellow"
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using BiometricStatCard for long-form text values"
          good="The value is sized as a numeric/short-text display. For descriptive cards use `Card` with a header row + body."
        />

        <DontRow
          bad="Color-coding all three stats with different tones"
          good="Use accent tones to differentiate signal types (HR pink, HRV yellow). If all three would be pink, leave them neutral — the row already groups them."
        />

        <DontRow
          bad="4+ stats in one row"
          good="Keep to 2 (size='md') or 3 (size='sm'). Past that the values get cramped and unreadable. Wrap to a second row instead."
        />

        <DontRow
          bad="Embedding a chart / progress bar inside the value"
          good="BiometricStatCard is for at-a-glance readings only. Trend visualizations live in their own card (StarBreathing's hero card pattern, etc.)."
        />

        <DontRow
          bad="Tappable stat without a clear destination"
          good="Only pass `onPress` if tapping the stat opens detail (trend, history). Decorative cards stay non-tappable to avoid affordance noise."
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
