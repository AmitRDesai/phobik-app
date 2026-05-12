import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import type { ReactNode } from 'react';

// All demo headers in the catalog override their left slot with a noop
// BackButton so tapping inside the showcase doesn't actually navigate away.
const noopBack = <BackButton onPress={() => {}} />;
const noopClose = <BackButton icon="close" onPress={() => {}} />;

export default function HeaderShowcase() {
  const [step, setStep] = useState(2);

  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="Header" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          The pinned chrome at the top of every screen. Owns left nav (back /
          close), the center title or wordmark, an optional right action slot,
          and an optional progress strip below.
        </Text>
        <Text size="sm" tone="tertiary">
          Always passed via Screen&apos;s `header` slot — never rendered freely.
          Header itself handles back navigation (`router.back()` /
          `router.dismissAll()`); pass `confirmClose` to gate it behind a
          confirmation dialog.
        </Text>
      </Section>

      <Section title="Variants">
        <PropRow
          label={'variant="back"'}
          note="Default. Back arrow left (when canGoBack) + optional title + optional right. Use everywhere except modals and brand-flow screens."
        >
          <HeaderFrame>
            <Header title="Today" left={noopBack} />
          </HeaderFrame>
        </PropRow>

        <PropRow
          label={'variant="close"'}
          note="Close (X) left that calls `router.dismissAll()`. Use on modals and one-off sheets that exit the entire flow."
        >
          <HeaderFrame>
            <Header variant="close" title="Filters" left={noopClose} />
          </HeaderFrame>
        </PropRow>

        <PropRow
          label={'variant="wordmark"'}
          note="Brand wordmark center, no left nav. Use for top-level flow screens that don't belong to a back stack (sign-in landing, onboarding step 1)."
        >
          <HeaderFrame>
            <Header variant="wordmark" />
          </HeaderFrame>
        </PropRow>
      </Section>

      <Section title="Center stack">
        <PropRow
          label="title only"
          note="Single line, h3 size, truncates with numberOfLines=1."
        >
          <HeaderFrame>
            <Header title="Reflections" left={noopBack} />
          </HeaderFrame>
        </PropRow>

        <PropRow
          label="title + subtitle"
          note="Two-line center. Subtitle uses tone-secondary at body-sm; both single-line clamp."
        >
          <HeaderFrame>
            <Header
              title="Empathy Challenge"
              subtitle="Day 3 of 7"
              left={noopBack}
            />
          </HeaderFrame>
        </PropRow>

        <PropRow
          label="long title"
          note="Truncated mid-word — keep titles ≤ ~22 chars on iPhone; use subtitle for the rest."
        >
          <HeaderFrame>
            <Header
              title="A really very long title that won't fit"
              left={noopBack}
            />
          </HeaderFrame>
        </PropRow>
      </Section>

      <Section title="Right slot (action)">
        <PropRow
          label="right={<UserAvatar />}"
          note="Profile entry pattern — most common right slot."
        >
          <HeaderFrame>
            <Header
              title="Dashboard"
              left={noopBack}
              right={<UserAvatar size="sm" />}
            />
          </HeaderFrame>
        </PropRow>

        <PropRow
          label="right={<Button size='xs' />}"
          note="Inline CTA — keep label ≤ 1 word so it doesn't crowd the title."
        >
          <HeaderFrame>
            <Header
              title="Journal"
              left={noopBack}
              right={
                <Button size="xs" onPress={() => {}}>
                  Save
                </Button>
              }
            />
          </HeaderFrame>
        </PropRow>

        <PropRow
          label="right={<icon button>}"
          note="Use the BackButton primitive (or an iconOnly Button) so the right slot matches the left visually."
        >
          <HeaderFrame>
            <Header
              title="Practice"
              left={noopBack}
              right={<BackButton icon="more-horiz" onPress={() => {}} />}
            />
          </HeaderFrame>
        </PropRow>
      </Section>

      <Section title="Progress strip">
        <Text size="sm" tone="tertiary">
          Pass a `progress` object with `current` and `total` keys to render a
          ProgressDots row below the header. Use on onboarding / multi-step
          flows so progress lives in the header chrome instead of competing with
          body content.
        </Text>
        <PropRow label={`progress={{ current: ${step}, total: 5 }}`}>
          <HeaderFrame>
            <Header variant="wordmark" progress={{ current: step, total: 5 }} />
          </HeaderFrame>
          <View className="flex-row gap-2">
            <Button
              size="xs"
              variant="secondary"
              onPress={() => setStep((s) => Math.max(1, s - 1))}
            >
              Prev
            </Button>
            <Button
              size="xs"
              onPress={() => setStep((s) => Math.min(5, s + 1))}
            >
              Next
            </Button>
          </View>
        </PropRow>
      </Section>

      <Section title="Confirm close">
        <Text size="sm" tone="tertiary">
          Pass `confirmClose` to gate the back / close action behind a dialog
          (uses `utils/dialog.error`). Use on long forms / multi-step flows
          where leaving mid-way loses work. Optional `confirmCloseConfig`
          customizes title / message / button labels — defaults to a generic
          "Discard progress?" prompt.
        </Text>
        <Text size="xs" tone="disabled">
          Not demoed live — pressing the back button here would just close the
          dialog without leaving (router has nowhere to go from this preview).
        </Text>
      </Section>

      <Section title="Center / left full override">
        <PropRow
          label="center={<custom />}"
          note="Skip the title stack entirely — render anything in the center slot (e.g. a Badge, a SegmentedControl)."
        >
          <HeaderFrame>
            <Header
              left={noopBack}
              center={
                <View className="flex-row items-center gap-2">
                  <MaterialIcons
                    name="local-fire-department"
                    size={18}
                    color="#FF8E53"
                  />
                  <Text size="md" weight="bold">
                    14-day streak
                  </Text>
                </View>
              }
            />
          </HeaderFrame>
        </PropRow>

        <PropRow
          label="left={null}"
          note="Suppress the back button entirely. Useful on root tabs where there's nowhere to go back."
        >
          <HeaderFrame>
            <Header title="Practices" left={null} />
          </HeaderFrame>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Settings screen (back + title)">
          <HeaderFrame>
            <Header title="Settings" left={noopBack} />
          </HeaderFrame>
        </PropRow>

        <PropRow label="Modal sheet (close + title + save action)">
          <HeaderFrame>
            <Header
              variant="close"
              title="Edit profile"
              left={noopClose}
              right={
                <Button size="xs" onPress={() => {}}>
                  Save
                </Button>
              }
            />
          </HeaderFrame>
        </PropRow>

        <PropRow label="Onboarding step (wordmark + progress)">
          <HeaderFrame>
            <Header variant="wordmark" progress={{ current: 3, total: 5 }} />
          </HeaderFrame>
        </PropRow>

        <PropRow label="Dashboard tab (no left + title + avatar)">
          <HeaderFrame>
            <Header
              title="Today"
              left={null}
              right={<UserAvatar size="sm" />}
            />
          </HeaderFrame>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Wordmark variant WITH a title"
          good="Pick one — wordmark is for top-level flows, title is for stack screens. Mixing both makes the header feel cluttered."
        >
          <HeaderFrame>
            <Header variant="wordmark" title="Settings" />
          </HeaderFrame>
        </DontRow>

        <DontRow
          bad="Multiple right-slot actions crammed in"
          good="At most one right action. For more actions, use a single overflow (more-horiz) that opens a sheet."
        >
          <HeaderFrame>
            <Header
              title="Journal"
              left={noopBack}
              right={
                <View className="flex-row gap-2">
                  <BackButton icon="search" onPress={() => {}} />
                  <BackButton icon="filter-list" onPress={() => {}} />
                  <BackButton icon="more-horiz" onPress={() => {}} />
                </View>
              }
            />
          </HeaderFrame>
        </DontRow>

        <DontRow
          bad="Rendering Header outside a Screen"
          good="Always pass via `<Screen header={<Header />} />` — Screen handles safe-area inset; bare Header will collide with the status bar."
        >
          <Text size="xs" tone="secondary">
            (Conceptual — the visual collision happens at the device top edge.)
          </Text>
        </DontRow>

        <DontRow
          bad="`variant='close'` on a stack screen (not a modal)"
          good="Close dismisses the entire stack. Use `variant='back'` on stack screens; reserve close for modal presentations."
        >
          <HeaderFrame>
            <Header variant="close" title="Reflections" left={noopClose} />
          </HeaderFrame>
        </DontRow>
      </Section>
    </Screen>
  );
}

function HeaderFrame({ children }: { children: ReactNode }) {
  return (
    <View className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
      {children}
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
