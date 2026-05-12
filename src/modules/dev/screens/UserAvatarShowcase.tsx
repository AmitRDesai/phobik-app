import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { UserAvatar, type UserAvatarSize } from '@/components/ui/UserAvatar';
import { colors, withAlpha } from '@/constants/colors';

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format';

const SIZES: UserAvatarSize[] = ['sm', 'md', 'lg', 'xl'];

const SIZE_NOTES: Record<UserAvatarSize, string> = {
  sm: '32px — list rows, header right slot',
  md: '40px (default) — dashboards, comment authors',
  lg: '48px — feed cards, hero list rows',
  xl: '80px — profile header, large settings row',
};

export default function UserAvatarShowcase() {
  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="UserAvatar" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Circular user avatar with a 3-step fallback: explicit `imageUri` →
          session user image → initials from `name` (or session user name) →
          generic person icon.
        </Text>
        <Text size="sm" tone="tertiary">
          Pulls session state automatically — pass `imageUri` / `name` only when
          rendering someone OTHER than the current user (community feed, shared
          profiles).
        </Text>
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <View className="flex-row items-center gap-4">
              <UserAvatar
                size={size}
                imageUri={SAMPLE_IMAGE}
                name="John Smith"
              />
              <UserAvatar size={size} imageUri={null} name="John Smith" />
              <UserAvatar size={size} imageUri={null} />
            </View>
          </PropRow>
        ))}

        <PropRow
          label="size={120} (custom)"
          note="Pass a number for non-preset dimensions — icon size auto-scales."
        >
          <View className="flex-row items-center gap-4">
            <UserAvatar size={120} imageUri={SAMPLE_IMAGE} />
            <UserAvatar size={120} imageUri={null} name="John Smith" />
            <UserAvatar size={120} imageUri={null} />
          </View>
        </PropRow>
      </Section>

      <Section title="Fallback hierarchy">
        <PropRow
          label="With imageUri"
          note="Most-preferred. Renders the image."
        >
          <UserAvatar size="lg" imageUri={SAMPLE_IMAGE} name="John Smith" />
        </PropRow>

        <PropRow
          label="imageUri={null} + name"
          note="No image; renders initials computed from name."
        >
          <View className="flex-row items-center gap-3">
            <UserAvatar size="lg" imageUri={null} name="John Smith" />
            <UserAvatar size="lg" imageUri={null} name="Jane" />
            <UserAvatar size="lg" imageUri={null} name="John Marvin Smith" />
          </View>
        </PropRow>

        <PropRow
          label="imageUri={null} + no name"
          note="Last-resort — generic person icon."
        >
          <UserAvatar size="lg" imageUri={null} />
        </PropRow>
      </Section>

      <Section title="Initials algorithm">
        <Text size="sm" tone="tertiary">
          One word → first letter. Multi-word → first letter of first + first
          letter of last. Always upper-cased.
        </Text>
        {(
          [
            { name: 'John', display: '"John" → J' },
            { name: 'John Smith', display: '"John Smith" → JS' },
            {
              name: 'John Marvin Smith',
              display: '"John Marvin Smith" → JS',
            },
            { name: '  john   smith  ', display: 'Whitespace tolerant' },
            { name: '✨', display: 'Emoji works as a letter too' },
          ] as const
        ).map((item) => (
          <PropRow key={item.name} label={item.display}>
            <UserAvatar size="md" imageUri={null} name={item.name} />
          </PropRow>
        ))}
      </Section>

      <Section title="Decoration via className + style">
        <PropRow
          label="Pink border (className)"
          note="className handles borders, margins, additional bg overlays."
        >
          <UserAvatar
            size="xl"
            imageUri={SAMPLE_IMAGE}
            className="border-2 border-primary-pink/40"
          />
        </PropRow>

        <PropRow
          label="Drop shadow (style)"
          note="Inline style for boxShadow / non-Tailwind decoration."
        >
          <UserAvatar
            size="xl"
            imageUri={SAMPLE_IMAGE}
            style={{
              boxShadow: `0 4px 12px ${withAlpha(colors.primary.pink, 0.4)}`,
            }}
          />
        </PropRow>

        <PropRow
          label="With presence dot (compose externally)"
          note="The primitive doesn't include status indicators — wrap in a relative parent + position an inner dot if you need one."
        >
          <View className="relative" style={{ width: 80, height: 80 }}>
            <UserAvatar size="xl" imageUri={SAMPLE_IMAGE} />
            <View
              className="absolute h-5 w-5 rounded-full border-2 border-surface bg-status-success"
              style={{ bottom: 0, right: 0 }}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Header right slot (sm)"
          note="Compact avatar that pairs with title + back button."
        >
          <Card variant="raised" size="md">
            <View className="flex-row items-center justify-between">
              <Text size="md" weight="bold">
                Today
              </Text>
              <UserAvatar size="sm" imageUri={SAMPLE_IMAGE} />
            </View>
          </Card>
        </PropRow>

        <PropRow
          label="Comment author row (md + name + body)"
          note="Most common feed pattern — avatar left, content right."
        >
          <Card variant="raised" size="md">
            <View className="flex-row gap-3">
              <UserAvatar size="md" imageUri={SAMPLE_IMAGE} name="John Smith" />
              <View className="flex-1">
                <Text size="sm" weight="semibold">
                  John Smith
                </Text>
                <Text size="xs" tone="secondary" className="mb-1">
                  2 hours ago
                </Text>
                <Text size="sm">
                  Loved the box-breathing session this morning. Going to try it
                  again before my standup tomorrow.
                </Text>
              </View>
            </View>
          </Card>
        </PropRow>

        <PropRow
          label="Profile header (xl with border + shadow)"
          note="Hero presence — the user's primary identity surface."
        >
          <View className="items-center gap-3 py-4">
            <UserAvatar
              size="xl"
              imageUri={SAMPLE_IMAGE}
              className="border-2 border-primary-pink/40"
              style={{
                boxShadow: `0 4px 12px ${withAlpha(colors.primary.pink, 0.3)}`,
              }}
            />
            <Text size="h3" weight="bold">
              John Smith
            </Text>
            <Text size="sm" tone="secondary">
              14-day streak · 23 reflections
            </Text>
          </View>
        </PropRow>

        <PropRow
          label="Stacked avatars (overlapping group)"
          note="Compose multiple at md, with negative margins, to show a group / participants."
        >
          <View className="flex-row items-center">
            <UserAvatar
              size="md"
              imageUri={SAMPLE_IMAGE}
              className="border-2 border-surface"
            />
            <UserAvatar
              size="md"
              imageUri={null}
              name="Jane Doe"
              className="-ml-3 border-2 border-surface"
            />
            <UserAvatar
              size="md"
              imageUri={null}
              name="Sam Park"
              className="-ml-3 border-2 border-surface"
            />
            <Text size="sm" tone="secondary" className="ml-3">
              +3 others
            </Text>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad='Passing `className="h-X w-X"` for sizing'
          good="Use the `size` prop — it auto-scales the icon + initials text. className is for borders / margins / drop shadows."
        />

        <DontRow
          bad="Always using the icon fallback when you have a name"
          good="Pass `name` so the fallback shows initials. The generic person icon is institutional — initials read as personal."
        />

        <DontRow
          bad="Mounting UserAvatar without `imageUri` for someone else's avatar"
          good="UserAvatar defaults to the session user. For community feeds / shared profiles pass `imageUri` (and `name`) explicitly to render the other user."
        />

        <DontRow
          bad="xl avatar in a list row"
          good="xl is for hero profile screens. Inside lists / cards use sm or md."
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
