import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { InlineLink } from '@/components/ui/InlineLink';
import { Screen } from '@/components/ui/Screen';
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import { toast } from '@/utils/toast';
import { Platform } from 'react-native';

export default function SocialAuthButtonShowcase() {
  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="SocialAuthButton" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Round 56×56 social-auth button. Compose multiple in a `flex-row gap-4`
          row at the bottom of an auth form (Google + Apple). The icon color
          resolves theme-aware (foreground/0.8 on dark, near-black on light) so
          the brand glyphs read on both schemes.
        </Text>
        <Text size="sm" tone="tertiary">
          Apple sign-in is iOS-only — gate the apple variant with `Platform.OS
          === 'ios'` in the caller.
        </Text>
      </Section>

      <Section title="Providers">
        <PropRow
          label='provider="google"'
          note="Google logo on a neutral foreground/10 chip. Always renders on both platforms."
        >
          <View className="flex-row gap-4">
            <SocialAuthButton
              provider="google"
              onPress={() => toast.info('Google sign-in')}
            />
          </View>
        </PropRow>

        <PropRow
          label='provider="apple"'
          note="Apple logo. Gate with Platform.OS === 'ios' at the call site."
        >
          <View className="flex-row gap-4">
            <SocialAuthButton
              provider="apple"
              onPress={() => toast.info('Apple sign-in')}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="States">
        <PropRow label="disabled (40% opacity, rejects taps)">
          <View className="flex-row gap-4">
            <SocialAuthButton provider="google" onPress={() => {}} disabled />
            <SocialAuthButton provider="apple" onPress={() => {}} disabled />
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Bottom of an auth form (Google + Apple in a row)"
          note="The canonical placement — below the primary CTA, above the bottom InlineLink."
        >
          <Card variant="raised" size="md" className="gap-4">
            <Text size="md" weight="semibold">
              Sign in
            </Text>
            <Text size="sm" tone="secondary">
              [Email + password fields would go here…]
            </Text>
            <Button onPress={() => toast.success('Signed in')}>Sign In</Button>

            <View className="my-2 flex-row items-center">
              <View className="h-px flex-1 bg-foreground/10" />
              <Text size="sm" tone="secondary" className="mx-4">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-foreground/10" />
            </View>

            <View className="flex-row justify-center gap-4">
              <SocialAuthButton
                provider="google"
                onPress={() => toast.info('Google sign-in')}
              />
              {Platform.OS === 'ios' && (
                <SocialAuthButton
                  provider="apple"
                  onPress={() => toast.info('Apple sign-in')}
                />
              )}
            </View>

            <InlineLink
              prefix="Don't have an account?"
              action="Sign Up"
              onPress={() => toast.info('→ /auth/create-account')}
              className="mt-2"
            />
          </Card>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Rendering the apple variant without Platform.OS check"
          good="Apple sign-in only works on iOS. The primitive doesn't gate by default — caller must wrap apple with Platform.OS === 'ios'."
        />

        <DontRow
          bad="Using SocialAuthButton as the primary submit CTA"
          good="It's a secondary entrypoint. Always pair with a primary Button (email/password) — never replace it."
        />

        <DontRow
          bad="Overriding the icon color via className"
          good="Theme-aware resolution is baked in. Overriding breaks the contrast guarantee on light vs dark mode."
        />

        <DontRow
          bad="A single social button on its own line"
          good="Either render Google + Apple side-by-side in a row, or wrap a single button so it doesn't read as the primary action."
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
