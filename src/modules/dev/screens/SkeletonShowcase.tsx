import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SkeletonShowcase() {
  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="Skeleton" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Animated placeholder shape for loading content. Compose multiple
          Skeletons to mimic the real layout (avatar + text lines + image) so
          when data lands the swap-in feels stable instead of a layout jump.
        </Text>
        <Text size="sm" tone="tertiary">
          Use Skeleton for predictable layouts (list rows, cards, profiles). For
          full-screen / indefinite loads where the shape isn&apos;t known (auth
          gate, initial sync), reach for the spinner / LoadingScreen instead.
        </Text>
      </Section>

      <Section title="Shapes">
        <PropRow
          label='shape="rect" (default)'
          note="Rounded rectangle. Default radius 6 — tune via `radius` prop."
        >
          <View className="gap-2">
            <Skeleton width="100%" height={16} />
            <Skeleton width="70%" height={16} />
          </View>
        </PropRow>

        <PropRow
          label='shape="pill"'
          note="Fully rounded ends. Useful for chips, badges, tab placeholders."
        >
          <View className="flex-row flex-wrap items-center gap-2">
            <Skeleton width={60} height={22} shape="pill" />
            <Skeleton width={80} height={22} shape="pill" />
            <Skeleton width={48} height={22} shape="pill" />
            <Skeleton width={64} height={22} shape="pill" />
          </View>
        </PropRow>

        <PropRow
          label='shape="circle"'
          note="Avatar / IconChip placeholder. Pair equal width + height."
        >
          <View className="flex-row items-center gap-3">
            <Skeleton width={32} height={32} shape="circle" />
            <Skeleton width={40} height={40} shape="circle" />
            <Skeleton width={48} height={48} shape="circle" />
            <Skeleton width={64} height={64} shape="circle" />
          </View>
        </PropRow>
      </Section>

      <Section title="Sizes">
        <PropRow
          label="Text-line widths (h=16)"
          note="Vary widths across lines so the placeholder reads as paragraphed copy, not a wall of identical bars."
        >
          <View className="gap-2">
            <Skeleton width="95%" height={16} />
            <Skeleton width="80%" height={16} />
            <Skeleton width="65%" height={16} />
            <Skeleton width="50%" height={16} />
          </View>
        </PropRow>

        <PropRow
          label="Heading + body (h=24, h=16)"
          note="Bigger height for headings; thinner for body."
        >
          <View className="gap-2">
            <Skeleton width="70%" height={24} />
            <Skeleton width="95%" height={14} />
            <Skeleton width="85%" height={14} />
            <Skeleton width="60%" height={14} />
          </View>
        </PropRow>

        <PropRow
          label="Image / artwork (h=160)"
          note="Large rectangle for image slots. Tune `radius` to match the real image's corners."
        >
          <Skeleton width="100%" height={160} radius={16} />
        </PropRow>
      </Section>

      <Section title="Static mode">
        <PropRow
          label="static"
          note="Disables the shimmer animation. Use for tests, snapshots, or surfaces where the pulse would compete with surrounding motion."
        >
          <View className="gap-2">
            <Skeleton width="95%" height={16} static />
            <Skeleton width="70%" height={16} static />
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world compositions">
        <PropRow
          label="List row (avatar + 2 lines)"
          note="The canonical skeleton for chat lists, feed posts, comments."
        >
          <Card variant="raised" size="md">
            <View className="flex-row items-center gap-3">
              <Skeleton width={48} height={48} shape="circle" />
              <View className="flex-1 gap-2">
                <Skeleton width="60%" height={16} />
                <Skeleton width="40%" height={12} />
              </View>
            </View>
          </Card>
        </PropRow>

        <PropRow
          label="Card with image"
          note="Cover image + title + body + tag row. Matches the practice / meditation card layout."
        >
          <Card variant="raised" size="md" className="gap-4">
            <Skeleton width="100%" height={140} radius={16} />
            <View className="gap-2">
              <Skeleton width="80%" height={20} />
              <Skeleton width="95%" height={14} />
              <Skeleton width="70%" height={14} />
            </View>
            <View className="flex-row gap-2">
              <Skeleton width={56} height={22} shape="pill" />
              <Skeleton width={72} height={22} shape="pill" />
              <Skeleton width={48} height={22} shape="pill" />
            </View>
          </Card>
        </PropRow>

        <PropRow label="Profile header" note="Large avatar + name + bio.">
          <View className="items-center gap-3 py-4">
            <Skeleton width={88} height={88} shape="circle" />
            <Skeleton width={160} height={22} />
            <View className="w-full max-w-[260px] items-center gap-1">
              <Skeleton width="80%" height={12} />
              <Skeleton width="60%" height={12} />
            </View>
          </View>
        </PropRow>

        <PropRow
          label="List of rows (repeating)"
          note="A short repeating pattern reads as a loading list immediately."
        >
          <View className="gap-3">
            {[0, 1, 2, 3].map((i) => (
              <View key={i} className="flex-row items-center gap-3">
                <Skeleton width={40} height={40} shape="circle" />
                <View className="flex-1 gap-1.5">
                  <Skeleton width={i % 2 === 0 ? '70%' : '55%'} height={14} />
                  <Skeleton width={i % 2 === 0 ? '40%' : '50%'} height={10} />
                </View>
              </View>
            ))}
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using Skeleton for full-screen indefinite loads (auth check, app init)"
          good="The shape isn't predictable so a Skeleton is just abstract motion. Use the existing LoadingScreen / spinner pattern instead."
        />

        <DontRow
          bad="Single huge Skeleton block in place of structured content"
          good="A wall of grey doesn't communicate what's loading. Compose multiple smaller Skeletons to mirror the real layout."
        />

        <DontRow
          bad="Identical-width text lines (4 bars all 100% wide)"
          good="Vary widths (95% / 80% / 65%) — real paragraph copy doesn't justify perfectly, and the eye reads the variance as 'this is text loading'."
        />

        <DontRow
          bad="Showing a Skeleton for sub-second fetches"
          good="Below ~300ms the Skeleton flicker is worse than the brief content shift. Render nothing for very fast loads."
        />

        <DontRow
          bad="Mixing animated + static Skeletons in the same view"
          good="Pick one mode per surface. A static row next to a pulsing row looks broken."
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
