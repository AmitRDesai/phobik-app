import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { FloatingAddButton } from '@/components/ui/FloatingAddButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { toast } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';

export default function FloatingAddButtonShowcase() {
  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="FloatingAddButton" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Floating action button (FAB). Circular gradient pinned to the
          bottom-right of the screen with a centered icon — the brand
          pink→yellow gradient + drop shadow signal "primary action."
        </Text>
        <Text size="sm" tone="tertiary">
          Use sparingly — one per screen, for the most likely action (compose,
          add, start). For secondary actions reach for an inline Button.
        </Text>
      </Section>

      <Section title="Default (add icon)">
        <PropRow
          label="Just `onPress`"
          note="The default + icon covers the most common case. Demos are anchored inside a 240px-tall frame so the FAB lands in the bottom-right of the frame instead of the screen."
        >
          <Stage>
            <FloatingAddButton
              onPress={() => toast.info('Add tapped')}
              className="absolute bottom-4 right-4"
            />
          </Stage>
        </PropRow>
      </Section>

      <Section title="Custom icons">
        <PropRow
          label="Compose / edit"
          note="Pass any React node as `icon`. The icon should be white and ~28px to match the default."
        >
          <Stage>
            <FloatingAddButton
              accessibilityLabel="Compose"
              icon={<MaterialIcons name="edit" size={26} color="white" />}
              onPress={() => toast.info('Compose tapped')}
              className="absolute bottom-4 right-4"
            />
          </Stage>
        </PropRow>

        <PropRow label="Search">
          <Stage>
            <FloatingAddButton
              accessibilityLabel="Search"
              icon={<MaterialIcons name="search" size={28} color="white" />}
              onPress={() => toast.info('Search tapped')}
              className="absolute bottom-4 right-4"
            />
          </Stage>
        </PropRow>

        <PropRow label="Start practice (play)">
          <Stage>
            <FloatingAddButton
              accessibilityLabel="Start practice"
              icon={
                <MaterialIcons
                  name="play-arrow"
                  size={32}
                  color="white"
                  style={{ marginLeft: 2 }}
                />
              }
              onPress={() => toast.info('Practice started')}
              className="absolute bottom-4 right-4"
            />
          </Stage>
        </PropRow>
      </Section>

      <Section title="Disabled">
        <PropRow
          label="disabled"
          note="Rejects taps + renders at 40% opacity. Use sparingly — a disabled FAB is confusing without surrounding context."
        >
          <Stage>
            <FloatingAddButton
              disabled
              onPress={() => {}}
              className="absolute bottom-4 right-4"
            />
          </Stage>
        </PropRow>
      </Section>

      <Section title="Positioning override">
        <PropRow
          label='className="absolute bottom-4 left-4"'
          note="Default is bottom-right. Override `className` to anchor differently — e.g. bottom-left if the right edge is reserved for another control."
        >
          <Stage>
            <FloatingAddButton
              onPress={() => toast.info('Left-anchored')}
              className="absolute bottom-4 left-4"
            />
          </Stage>
        </PropRow>

        <PropRow
          label='className="absolute bottom-4 self-center"'
          note="Centered horizontally — uncommon but useful for celebratory single-action moments."
        >
          <Stage>
            <FloatingAddButton
              onPress={() => toast.success('Centered')}
              icon={<MaterialIcons name="favorite" size={28} color="white" />}
              accessibilityLabel="Like"
              className="absolute bottom-4 self-center"
            />
          </Stage>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Journal list with FAB to compose"
          note="The canonical pattern — list of items below, FAB anchors the primary 'create new' action."
        >
          <Stage tall>
            <View className="gap-3 p-4">
              <Text size="md" weight="bold">
                Reflections
              </Text>
              <FauxEntry title="Morning reset" />
              <FauxEntry title="Felt anxious before standup" />
              <FauxEntry title="Reframed: I'm allowed to need help" />
            </View>
            <FloatingAddButton
              accessibilityLabel="New reflection"
              onPress={() => toast.info('New reflection')}
              className="absolute bottom-4 right-4"
            />
          </Stage>
        </PropRow>

        <PropRow
          label="Empty list — FAB still in place"
          note="On empty screens the FAB pairs naturally with an EmptyState that explains what to do."
        >
          <Stage tall>
            <View className="flex-1 items-center justify-center gap-2 p-4">
              <Text size="md" weight="bold">
                No letters yet
              </Text>
              <Text size="sm" tone="secondary" align="center">
                Start your first gentle letter practice.
              </Text>
            </View>
            <FloatingAddButton
              accessibilityLabel="New letter"
              icon={<MaterialIcons name="edit" size={26} color="white" />}
              onPress={() => toast.info('New letter')}
              className="absolute bottom-4 right-4"
            />
          </Stage>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Two FABs on the same screen"
          good="One per screen. Two compete for the 'primary action' read — pick the most likely one and surface the other as an inline Button."
        />

        <DontRow
          bad="Using FAB for destructive actions (delete, archive)"
          good="FAB is always-visible primary. A persistent destructive button invites accidental taps. Put destructive in a context menu / sheet."
        />

        <DontRow
          bad="Anchoring a FAB above a sticky bottom CTA"
          good="If a Screen already has a `sticky` CTA, drop the FAB — the user has two primary actions and won't know which one to tap."
        />

        <DontRow
          bad="Missing accessibilityLabel when the icon isn't a plain '+'"
          good="Default 'Add' assumes the + icon. For compose / search / play, pass a matching label so screen readers announce the action."
        />

        <DontRow
          bad="Custom icon at the wrong size or color"
          good="Match the default: white, ~28px MaterialIcons / Ionicons. Smaller / colored icons look broken against the gradient bg."
        />
      </Section>
    </Screen>
  );
}

function Stage({ children, tall }: { children: ReactNode; tall?: boolean }) {
  return (
    <View
      className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03]"
      style={{ height: tall ? 280 : 180 }}
    >
      {children}
    </View>
  );
}

function FauxEntry({ title }: { title: string }) {
  return (
    <View className="rounded-xl border border-foreground/10 bg-foreground/[0.04] px-3 py-2">
      <Text size="sm">{title}</Text>
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
