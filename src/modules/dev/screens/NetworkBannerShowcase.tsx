import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { NetworkBanner } from '@/components/ui/NetworkBanner';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { clsx } from 'clsx';

export default function NetworkBannerShowcase() {
  const { isConnected, isInternetReachable } = useNetInfo();
  const isOffline = isConnected === false || isInternetReachable === false;

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="NetworkBanner" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Auto-managed yellow warning strip that appears when the device drops
          connectivity. Subscribes to `@react-native-community/netinfo` and
          checks BOTH `isConnected` and `isInternetReachable` — so captive
          portals and dead Wi-Fi networks (radio up, no real internet) also
          surface the banner. Pass a single `message` describing what&apos;s
          degraded (saves queued, sync paused, etc.) so the user knows why
          something isn&apos;t loading.
        </Text>
        <View className="gap-1">
          <Text size="xs" tone="tertiary">
            Live NetInfo state right now:
          </Text>
          <Text size="xs" className="font-mono" weight="bold">
            isConnected={String(isConnected)} · isInternetReachable=
            {String(isInternetReachable)}
          </Text>
          <Text size="xs" tone="tertiary">
            Banner is{' '}
            <Text size="xs" weight="bold">
              {isOffline ? 'visible' : 'hidden'}
            </Text>
            .
          </Text>
        </View>
      </Section>

      <Section title="Live banner">
        <Text size="sm" tone="tertiary">
          The component below is the real `NetworkBanner` mounted with the live
          netinfo subscription. Toggle Airplane Mode (or kill Wi-Fi / cellular)
          to see it animate in.
        </Text>
        <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-2">
          <NetworkBanner message="You're offline — your work will sync when you reconnect." />
          {!isOffline ? (
            <View className="items-center px-4 py-3">
              <Text size="xs" tone="disabled">
                Banner is hidden (currently online).
              </Text>
            </View>
          ) : null}
        </View>
      </Section>

      <Section title="Static previews (what the banner looks like)">
        <Text size="sm" tone="tertiary">
          Since the live banner only renders when offline, these are hand-built
          previews of the visual chrome — useful for design review.
        </Text>
        <PropRow
          label={`message="Offline — work will sync when you reconnect."`}
        >
          <Preview message="Offline — your work will sync when you reconnect." />
        </PropRow>

        <PropRow
          label='message="No connection. Daily reflections paused."'
          note="Short, status-focused messages work better than long explanations — the user already knows something is wrong."
        >
          <Preview message="No connection. Daily reflections paused." />
        </PropRow>

        <PropRow
          label='message="Reconnecting…"'
          note="Use during the transient reconnect window (also visible while NetInfo evaluates initial state)."
        >
          <Preview message="Reconnecting…" />
        </PropRow>
      </Section>

      <Section title="Layout (className override)">
        <Text size="sm" tone="tertiary">
          Defaults to `mx-4 mb-2` so it slots cleanly under a Header without
          extra wiring. Override `className` when the parent owns spacing (e.g.
          inside a card with its own padding).
        </Text>
        <PropRow
          label={`className="" (no outer margin)`}
          note="Strip the default margin — the parent View handles its own layout."
        >
          <View className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-3">
            <Preview
              message="Offline — work will sync when you reconnect."
              className=""
            />
          </View>
        </PropRow>

        <PropRow
          label={`className="mx-0"`}
          note="Edge-to-edge banner (full-bleed) — useful at the very top of a Screen body."
        >
          <Preview message="Reconnecting…" className="mx-0 rounded-none" />
        </PropRow>
      </Section>

      <Section title="Real-world placement">
        <Text size="sm" tone="tertiary">
          Mount inside a `Screen` near the top of the body so the banner is
          always visible without scrolling. Place above content cards, not below
          — users need to see the network state before they read the data that
          depends on it.
        </Text>
        <PropRow label="Inside Screen body (top of scroll content)">
          <View className="overflow-hidden rounded-2xl border border-foreground/10">
            <View className="bg-surface px-0 pb-3 pt-3">
              <View className="px-4 pb-3">
                <Text size="md" weight="bold">
                  Reflections
                </Text>
              </View>
              <Preview message="You're offline — work will sync when you reconnect." />
              <View className="px-4 pt-2">
                <Card variant="raised" size="md">
                  <Text size="sm" tone="secondary">
                    Reflection cards load below.
                  </Text>
                </Card>
              </View>
            </View>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using NetworkBanner for non-network status (e.g. sync errors that aren't connectivity-related)"
          good="Reserve this primitive for offline state. For other errors / warnings, use an inline Badge or a dialog so the user can dismiss."
        />

        <DontRow
          bad="Mounting multiple NetworkBanners on the same screen"
          good="One per screen, near the top. Multiple banners stack and waste vertical space — connectivity status is global, not per-component."
        />

        <DontRow
          bad="Long-form troubleshooting copy in `message`"
          good="Keep messages ≤ 1 line. If the user needs more help, route them to a Settings screen or a Help link via a separate flow."
        />

        <DontRow
          bad="Manually conditionally rendering on top of the auto-hide behavior"
          good="The component already returns null when online. Just render `<NetworkBanner message=… />` unconditionally inside your Screen body."
        />
      </Section>
    </Screen>
  );
}

function Preview({
  message,
  className = 'mx-4 mb-2',
}: {
  message: string;
  className?: string;
}) {
  return (
    <View
      className={clsx(
        'flex-row items-center gap-2 rounded-2xl px-4 py-2.5',
        className,
      )}
      style={{ backgroundColor: withAlpha(colors.status.warning, 0.1) }}
    >
      <Ionicons
        name="cloud-offline-outline"
        size={16}
        color={colors.status.warning}
      />
      <Text
        size="sm"
        className="flex-1"
        style={{ color: colors.status.warning }}
      >
        {message}
      </Text>
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
