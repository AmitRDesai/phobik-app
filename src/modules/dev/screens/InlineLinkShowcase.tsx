import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { InlineLink } from '@/components/ui/InlineLink';
import { Screen } from '@/components/ui/Screen';
import { toast } from '@/utils/toast';

export default function InlineLinkShowcase() {
  return (
    <Screen
      variant="default"
      scroll
      header={<ShowcaseHeader title="InlineLink" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Single-row link with a `tone="secondary"` prefix + a `tone="accent"
          weight="bold"` action word — the canonical "Already have an account?
          **Sign In**" pattern from auth / form screens. Tap target is the whole
          row; the action word visually anchors it.
        </Text>
        <Text size="sm" tone="tertiary">
          Use at the bottom of auth flows, signup forms, and any screen with a
          single navigation cue ("Remember your password? **Sign In**"). For
          richer in-flow CTAs reach for `Button` with `variant="ghost"` instead.
        </Text>
      </Section>

      <Section title="Basic">
        <PropRow
          label="prefix + action"
          note="The canonical shape — secondary prefix copy, accent action word."
        >
          <InlineLink
            prefix="Already have an account?"
            action="Sign In"
            onPress={() => toast.info('Sign In tapped')}
          />
        </PropRow>

        <PropRow
          label="No prefix"
          note="Action-only link — use when the surrounding context already explains."
        >
          <InlineLink
            action="View privacy policy"
            onPress={() => toast.info('Privacy policy tapped')}
          />
        </PropRow>
      </Section>

      <Section title="States">
        <PropRow
          label="disabled"
          note="Rejects taps + renders at 40% opacity. Useful while an async submit is pending."
        >
          <InlineLink
            prefix="Don't have an account?"
            action="Sign Up"
            onPress={() => {}}
            disabled
          />
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Bottom of sign-up form"
          note="Anchored at the foot of CreateAccount — gives a clear path to the alternate flow."
        >
          <Card variant="raised" size="md" className="gap-4">
            <Text size="md" weight="semibold">
              Create your account
            </Text>
            <Text size="sm" tone="secondary">
              [Form fields would go here…]
            </Text>
            <Button onPress={() => toast.success('Account created')}>
              Create Account
            </Button>
            <InlineLink
              prefix="Already have an account?"
              action="Sign In"
              onPress={() => toast.info('→ /auth/sign-in')}
            />
          </Card>
        </PropRow>

        <PropRow
          label="Bottom of sign-in form (reverse direction)"
          note="The same primitive on SignIn points back to Sign Up."
        >
          <Card variant="raised" size="md" className="gap-4">
            <Text size="md" weight="semibold">
              Welcome back
            </Text>
            <Text size="sm" tone="secondary">
              [Form fields would go here…]
            </Text>
            <Button onPress={() => toast.success('Signed in')}>Sign In</Button>
            <InlineLink
              prefix="Don't have an account?"
              action="Sign Up"
              onPress={() => toast.info('→ /auth/create-account')}
            />
          </Card>
        </PropRow>

        <PropRow
          label="Bottom of forgot/reset password"
          note="Send the user back to the main sign-in flow once they've recovered."
        >
          <Card variant="raised" size="md" className="gap-4">
            <Text size="md" weight="semibold">
              Reset password
            </Text>
            <Text size="sm" tone="secondary">
              [Form fields would go here…]
            </Text>
            <Button onPress={() => toast.success('Email sent')}>
              Send reset link
            </Button>
            <InlineLink
              prefix="Remember your password?"
              action="Sign In"
              onPress={() => toast.info('→ /auth/sign-in')}
            />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using InlineLink as a primary CTA"
          good="It's a low-stakes inline navigation cue. For the primary action use Button; reserve InlineLink for the secondary path at the bottom of a form."
        />

        <DontRow
          bad="Long-form prose with multiple links inline"
          good="If the screen needs a paragraph with multiple inline links (Terms / Privacy / Help), inline `<Text tone='accent' onPress={...}>` segments are clearer than chaining InlineLinks."
        />

        <DontRow
          bad="Hard-coded prefix that competes with the action"
          good="Prefix should be short context (≤ 5 words). The action word is the visual anchor — keep it 1–2 words ('Sign In', 'Sign Up', 'Learn more')."
        />

        <DontRow
          bad="Mixing different tone treatments across the same form"
          good="One auth flow → one InlineLink style. The convention reads as one system; varying tones in nearby screens feels random."
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
