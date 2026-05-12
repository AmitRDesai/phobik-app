import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState, type EmptyStateSize } from '@/components/ui/EmptyState';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const SIZES: EmptyStateSize[] = ['sm', 'md', 'lg'];

const SIZE_NOTES: Record<EmptyStateSize, string> = {
  sm: 'Compact — inside a Card body or a sub-section of a screen.',
  md: 'Default — primary empty state for tab / list screens.',
  lg: 'Hero — full-screen empty splash (onboarding, first-run, dashboard with no data).',
};

const TONES: AccentHue[] = ['pink', 'cyan', 'purple', 'orange', 'yellow'];

export default function EmptyStateShowcase() {
  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="EmptyState" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Empty-state primitive for "no data yet" screens. Combines an icon
          chip, a headline, optional body copy, and an optional CTA into one
          centered block.
        </Text>
        <Text size="sm" tone="tertiary">
          For "no data on this date" filtered sub-states inside a populated
          list, prefer a single inline body line — EmptyState reads as a
          full-screen miss and is heavier than that interaction deserves.
        </Text>
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <EmptyState
              size={size}
              icon={(color) => (
                <Ionicons
                  name="chatbubbles-outline"
                  size={size === 'lg' ? 32 : size === 'md' ? 24 : 20}
                  color={color}
                />
              )}
              title="No conversations yet"
              description="Start a chat with your AI coach — replies are typically under 10 seconds."
              action={<Button size="sm">Start a chat</Button>}
            />
          </PropRow>
        ))}
      </Section>

      <Section title="Tones (icon chip color)">
        <Text size="sm" tone="tertiary">
          Tone colors the icon chip&apos;s background + supplies the resolved
          color to the render-prop icon. Card chrome / title color stay neutral.
        </Text>
        {TONES.map((tone) => (
          <PropRow key={tone} label={`tone="${tone}"`}>
            <EmptyState
              size="sm"
              tone={tone}
              icon={(color) => (
                <MaterialIcons name="auto-awesome" size={20} color={color} />
              )}
              title={`No ${tone} data`}
              description="Tone tints only the icon chip."
            />
          </PropRow>
        ))}
        <PropRow
          label="No tone (neutral)"
          note="Skip `tone` for a theme-aware neutral chip (foreground/8 bg, foreground/85 icon)."
        >
          <EmptyState
            size="sm"
            icon={(color) => (
              <MaterialIcons name="folder-open" size={20} color={color} />
            )}
            title="No saved items"
            description="Bookmark something to save it here."
          />
        </PropRow>
      </Section>

      <Section title="Content variants">
        <PropRow
          label="Title only"
          note="Drop description + action for a minimal placeholder."
        >
          <EmptyState
            size="sm"
            icon={(color) => (
              <Ionicons name="calendar-outline" size={20} color={color} />
            )}
            title="No entries for this date"
          />
        </PropRow>

        <PropRow
          label="Title + description (no action)"
          note="When the path to add content is obvious from context."
        >
          <EmptyState
            size="sm"
            icon={(color) => (
              <Ionicons name="leaf-outline" size={20} color={color} />
            )}
            title="No mindfulness sessions yet"
            description="Complete a session to see your history here."
          />
        </PropRow>

        <PropRow
          label="Title + action (no description)"
          note="Use when the title is self-explanatory."
        >
          <EmptyState
            size="sm"
            icon={(color) => (
              <MaterialIcons name="bookmark-border" size={20} color={color} />
            )}
            title="No saved practices"
            action={
              <Button size="sm" variant="secondary">
                Browse practices
              </Button>
            }
          />
        </PropRow>

        <PropRow
          label="Full (icon + title + description + action)"
          note="The canonical pattern — strongest empty state."
        >
          <EmptyState
            size="md"
            tone="pink"
            icon={(color) => (
              <MaterialIcons name="favorite-border" size={24} color={color} />
            )}
            title="Start your first reflection"
            description="A short journal entry takes 2 minutes and helps you see patterns over time."
            action={<Button>Write entry</Button>}
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Inside a list section (Card-wrapped, sm)">
          <Card variant="raised" size="md">
            <EmptyState
              size="sm"
              icon={(color) => (
                <MaterialIcons name="event-note" size={20} color={color} />
              )}
              title="No entries for April 12"
              description="Try a different date or write a new entry."
            />
          </Card>
        </PropRow>

        <PropRow label="Tab screen with no data (md)">
          <EmptyState
            size="md"
            tone="cyan"
            icon={(color) => (
              <Ionicons name="chatbubbles-outline" size={24} color={color} />
            )}
            title="No conversations yet"
            description="Start a chat with your AI coach — replies are typically under 10 seconds."
            action={<Button>Open coach</Button>}
          />
        </PropRow>

        <PropRow label="Full-screen splash (lg)">
          <EmptyState
            size="lg"
            tone="pink"
            icon={(color) => (
              <MaterialIcons name="auto-awesome" size={32} color={color} />
            )}
            title="Your journey starts here"
            description="Tap below to take your first check-in. We'll guide you through it."
            action={<Button size="lg">Get started</Button>}
          />
        </PropRow>

        <PropRow label="Filter / search miss (sm, no action)">
          <Card variant="flat" size="md">
            <EmptyState
              size="sm"
              icon={(color) => (
                <Ionicons name="search" size={20} color={color} />
              )}
              title="No matches"
              description="Try a different tag or clear filters to see all entries."
            />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using EmptyState for transient loading"
          good="Empty state is a stable rest state. For a transient skeleton / spinner during fetch, use a loader and switch to EmptyState only after the request returns zero results."
        />

        <DontRow
          bad="Long-form essays in `description`"
          good="Keep description to ~2 lines. Anything longer belongs in onboarding / help screens linked from the action button."
        />

        <DontRow
          bad="Multiple CTAs (primary + secondary in the `action` slot)"
          good="One action button. Multiple buttons fragment focus — pick the most likely path. Provide alternates via a Settings or a separate ghost link below if truly needed."
        />

        <DontRow
          bad="No action when the user can clearly take one"
          good="If there's a obvious next step (compose, browse, retry), include the action button. Empty states without paths feel like dead ends."
        />

        <DontRow
          bad="Reaching for `lg` for in-list empty rows"
          good="lg is for full-screen splashes. Inside a list or card body, use `sm` so the empty state doesn't dominate."
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
