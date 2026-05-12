import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { IconChip } from '@/components/ui/IconChip';
import { NotificationBadge } from '@/components/ui/NotificationBadge';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import type { ReactNode } from 'react';

export default function NotificationBadgeShowcase() {
  const scheme = useScheme();
  const [count, setCount] = useState(3);

  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="NotificationBadge" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Small unread-count badge to overlay on icons (tab bar, header action,
          avatar). Hides automatically when `count` ≤ 0 and clamps the display
          to `9+` for counts &gt; 9 so the dot stays compact.
        </Text>
        <Text size="sm" tone="tertiary">
          Absolute-positioned to its parent&apos;s top-right corner — the parent
          must be a positioned container for the badge to anchor correctly (any
          `View` works; `Pressable` works).
        </Text>
      </Section>

      <Section title="Count display">
        <PropRow label="count=0" note="Renders nothing — badge is hidden.">
          <BadgeAnchor>
            <NotificationBadge count={0} />
          </BadgeAnchor>
        </PropRow>
        <PropRow label="count=1">
          <BadgeAnchor>
            <NotificationBadge count={1} />
          </BadgeAnchor>
        </PropRow>
        <PropRow label="count=5">
          <BadgeAnchor>
            <NotificationBadge count={5} />
          </BadgeAnchor>
        </PropRow>
        <PropRow label="count=9 (last single-digit)">
          <BadgeAnchor>
            <NotificationBadge count={9} />
          </BadgeAnchor>
        </PropRow>
        <PropRow
          label="count=10 (overflow)"
          note={`Display clamps to "9+" past 9 — keeps the badge compact.`}
        >
          <BadgeAnchor>
            <NotificationBadge count={10} />
          </BadgeAnchor>
        </PropRow>
        <PropRow label="count=99">
          <BadgeAnchor>
            <NotificationBadge count={99} />
          </BadgeAnchor>
        </PropRow>
      </Section>

      <Section title="Interactive">
        <PropRow
          label={`count=${count}`}
          note="Watch the badge appear / disappear and overflow at 10."
        >
          <BadgeAnchor>
            <NotificationBadge count={count} />
          </BadgeAnchor>
          <View className="flex-row flex-wrap items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              onPress={() => setCount((c) => Math.max(0, c - 1))}
            >
              −
            </Button>
            <Button size="xs" onPress={() => setCount((c) => c + 1)}>
              +
            </Button>
            <Button variant="ghost" size="xs" onPress={() => setCount(0)}>
              Reset
            </Button>
          </View>
        </PropRow>
      </Section>

      <Section title="Anchor parents (real-world)">
        <PropRow
          label="Over an icon button (header right action)"
          note="Wrap the BackButton in a `relative` View so the badge anchors to its corner."
        >
          <View className="flex-row items-center justify-center">
            <View className="relative">
              <BackButton icon="notifications" onPress={() => {}} />
              <NotificationBadge count={3} />
            </View>
          </View>
        </PropRow>

        <PropRow label="Over an IconChip (list-row indicator)">
          <View className="flex-row items-center gap-3">
            <View className="relative">
              <IconChip size="md" shape="circle" tone="pink">
                {(color) => (
                  <MaterialIcons name="message" size={20} color={color} />
                )}
              </IconChip>
              <NotificationBadge count={5} />
            </View>
            <View className="flex-1">
              <Text size="sm" weight="semibold">
                Messages
              </Text>
              <Text size="xs" tone="secondary">
                5 unread conversations
              </Text>
            </View>
          </View>
        </PropRow>

        <PropRow
          label="Over a tab icon (bottom-tab pattern)"
          note="Inside the TabBar primitive, mount a NotificationBadge as a sibling of the icon."
        >
          <View className="flex-row items-center justify-center gap-6">
            <View className="items-center gap-1">
              <View className="relative">
                <MaterialIcons
                  name="today"
                  size={24}
                  color={foregroundFor(scheme, 0.6)}
                />
              </View>
              <Text size="xs" tone="tertiary">
                Today
              </Text>
            </View>
            <View className="items-center gap-1">
              <View className="relative">
                <MaterialIcons
                  name="groups"
                  size={24}
                  color={foregroundFor(scheme, 0.6)}
                />
                <NotificationBadge count={2} />
              </View>
              <Text size="xs" tone="tertiary">
                Community
              </Text>
            </View>
            <View className="items-center gap-1">
              <View className="relative">
                <MaterialIcons
                  name="psychology"
                  size={24}
                  color={foregroundFor(scheme, 0.6)}
                />
                <NotificationBadge count={12} />
              </View>
              <Text size="xs" tone="tertiary">
                Coach
              </Text>
            </View>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Parent without positioning context"
          good="Wrap the icon in a `relative` (or absolute) parent — without it the badge floats to a weird corner of the layout root."
        >
          <View className="flex-row items-center justify-center">
            <View>
              <MaterialIcons
                name="notifications"
                size={24}
                color={foregroundFor(scheme, 0.6)}
              />
              <NotificationBadge count={3} />
            </View>
          </View>
        </DontRow>

        <DontRow
          bad="Showing the exact count past 9"
          good="The component already clamps to `9+`. Don't bypass it with a custom large-number Text — small badges with `99+` overflow the corner and look broken."
        >
          <View className="flex-row items-center justify-center">
            <View className="relative">
              <BackButton icon="notifications" onPress={() => {}} />
              <View className="absolute -right-3 -top-1 rounded-full bg-primary-pink px-1.5 py-0.5">
                <Text size="xs" tone="inverse" weight="bold">
                  123
                </Text>
              </View>
            </View>
          </View>
        </DontRow>

        <DontRow
          bad="Multiple badges stacked on one icon"
          good="One badge per parent. If you need to distinguish notification types, badge each tab separately."
        >
          <View className="flex-row items-center justify-center">
            <View className="relative">
              <BackButton icon="inbox" onPress={() => {}} />
              <NotificationBadge count={3} />
              <View className="absolute -left-1 -top-1 h-[18px] w-[18px] rounded-full border-2 border-surface bg-status-warning" />
            </View>
          </View>
        </DontRow>
      </Section>
    </Screen>
  );
}

function BadgeAnchor({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row items-center justify-center">
      <View className="relative">
        <BackButton icon="notifications" onPress={() => {}} />
        {children}
      </View>
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
