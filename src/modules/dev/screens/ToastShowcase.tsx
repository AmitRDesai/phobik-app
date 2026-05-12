import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { toast } from '@/utils/toast';

export default function ToastShowcase() {
  return (
    <Screen
      variant="default"
      scroll
      header={<ShowcaseHeader title="Toast" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Transient, non-blocking feedback. Use for confirmations the user
          doesn&apos;t need to acknowledge ("Entry saved", "Synced", "Copied to
          clipboard"). For anything requiring a choice or an explicit OK tap,
          reach for `dialog` instead.
        </Text>
        <Text size="sm" tone="tertiary">
          Single-toast model — firing a new toast replaces the visible one
          rather than stacking. Auto-dismisses after 3 seconds by default; tap
          the toast to dismiss early. Pass `duration: 0` for a sticky toast that
          stays until programmatically dismissed.
        </Text>
        <View className="rounded-md border border-foreground/10 bg-foreground/[0.04] p-3">
          <Text size="xs" tone="secondary" className="font-mono">
            toast.success(&apos;Entry saved&apos;){'\n'}
            toast.info({`{ message, description?, duration? }`}){'\n'}
            toast.warning(...){'\n'}
            toast.error(...){'\n'}
            toast.dismiss()
          </Text>
        </View>
      </Section>

      <Section title="Types">
        <PropRow
          label="toast.success"
          note="Green check icon. Use for completed actions (saved, synced, sent)."
        >
          <Button size="sm" onPress={() => toast.success('Entry saved')}>
            Fire success
          </Button>
        </PropRow>

        <PropRow
          label="toast.info"
          note="Pink info icon. Use for neutral status updates (signed in, copied, switched mode)."
        >
          <Button
            size="sm"
            variant="secondary"
            onPress={() => toast.info('Switched to dark mode')}
          >
            Fire info
          </Button>
        </PropRow>

        <PropRow
          label="toast.warning"
          note="Yellow alert icon. Use for soft warnings (offline, draft, will retry)."
        >
          <Button
            size="sm"
            variant="secondary"
            onPress={() =>
              toast.warning("You're offline — changes will sync later")
            }
          >
            Fire warning
          </Button>
        </PropRow>

        <PropRow
          label="toast.error"
          note="Red close icon. Use for transient failures that the user can ignore (failed to copy, retry available)."
        >
          <Button
            size="sm"
            variant="secondary"
            onPress={() => toast.error('Failed to copy')}
          >
            Fire error
          </Button>
        </PropRow>
      </Section>

      <Section title="Content shapes">
        <PropRow
          label="Plain string"
          note="The simplest case. The string is the message."
        >
          <Button
            size="sm"
            variant="secondary"
            onPress={() => toast.success('Entry saved')}
          >
            Fire plain
          </Button>
        </PropRow>

        <PropRow
          label="Message + description"
          note="Two-line toast — keep the second line short. Use sparingly; the eye glances toasts, not reads."
        >
          <Button
            size="sm"
            variant="secondary"
            onPress={() =>
              toast.error({
                message: 'Sync failed',
                description: 'Will retry shortly.',
              })
            }
          >
            Fire two-line
          </Button>
        </PropRow>

        <PropRow
          label="Custom duration"
          note="duration in ms. Default 3000. Pass 0 for sticky (no auto-dismiss)."
        >
          <View className="flex-row flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onPress={() =>
                toast.info({
                  message: 'Quick toast (1s)',
                  duration: 1000,
                })
              }
            >
              1s
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onPress={() =>
                toast.info({
                  message: 'Long toast (8s)',
                  duration: 8000,
                })
              }
            >
              8s
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onPress={() =>
                toast.warning({
                  message: 'Sticky toast — tap to dismiss',
                  duration: 0,
                })
              }
            >
              Sticky
            </Button>
            <Button size="sm" variant="ghost" onPress={() => toast.dismiss()}>
              Dismiss now
            </Button>
          </View>
        </PropRow>
      </Section>

      <Section title="Replacement behavior">
        <Text size="sm" tone="tertiary">
          Firing a new toast cancels the previous one&apos;s dismiss timer and
          shows the new one. The app intentionally renders one toast at a time —
          calmer than a stack, and matches how users glance at transient
          feedback.
        </Text>
        <PropRow label="Fire 3 in quick succession">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              toast.info('Step 1 done');
              setTimeout(() => toast.info('Step 2 done'), 600);
              setTimeout(() => toast.success('All done'), 1200);
            }}
          >
            Fire 3-step sequence
          </Button>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Save confirmation">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => toast.success('Reflection saved')}
          >
            Save
          </Button>
        </PropRow>

        <PropRow label="Copy to clipboard">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => toast.info('Copied to clipboard')}
          >
            Copy
          </Button>
        </PropRow>

        <PropRow label="Offline / sync queued">
          <Button
            size="sm"
            variant="secondary"
            onPress={() =>
              toast.warning({
                message: "You're offline",
                description: 'Changes will sync when you reconnect.',
              })
            }
          >
            Simulate offline
          </Button>
        </PropRow>

        <PropRow label="Transient error with retry hint">
          <Button
            size="sm"
            variant="secondary"
            onPress={() =>
              toast.error({
                message: 'Failed to save',
                description: 'Pull down to retry.',
              })
            }
          >
            Simulate error
          </Button>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using toast for actions that need acknowledgement (delete confirmations, errors with retry choices)"
          good="Toast is fire-and-forget. If the user must choose, use `dialog.error` / `dialog.info` with buttons instead."
        />

        <DontRow
          bad="Long-form copy in the toast"
          good="Keep message ≤ 1 line, description ≤ 1 line. Anything longer means it's not a toast — surface it inline as a banner or a card."
        />

        <DontRow
          bad="Reaching for `dialog.info` to confirm a save"
          good="A modal that says 'Saved.' [OK] interrupts the flow. Use `toast.success('Saved')` — the user knows immediately and keeps working."
        />

        <DontRow
          bad="Stacking 5 toasts to show step-by-step progress"
          good="A single toast model means later toasts replace earlier ones. For multi-step progress use a ProgressBar / Dialog loader, not a toast cascade."
        />

        <DontRow
          bad="Sticky toasts for warnings the user can't resolve"
          good="A persistent yellow banner that won't go away is anxiety-inducing. If state needs to persist (offline), use NetworkBanner instead."
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
