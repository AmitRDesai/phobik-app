import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { Screen } from '@/components/ui/Screen';
import { variantConfig, type Variant } from '@/components/variant-config';
import { withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View as RNView } from 'react-native';

const VARIANTS: Variant[] = ['default'];

const VARIANT_NOTES: Record<Variant, string> = {
  default:
    'Charcoal bg + pink→yellow top glow. App chrome — dashboard, practices, journal, onboarding, auth.',
};

export default function ScreenShowcase() {
  const scheme = useScheme();
  const router = useRouter();

  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="Screen" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What Screen owns">
        <Text size="sm" tone="secondary">
          Screen is the keystone primitive — every route is wrapped in one. It
          owns: safe-area insets (top + bottom, theme-aware), background variant
          + radial glow, optional ScrollView with auto-calculated bottom
          padding, sticky CTA that rises with the keyboard, pinned header, and a
          bottom scroll-fade that matches the screen background.
        </Text>
        <Text size="sm" tone="tertiary">
          Tab screens auto-skip the bottom inset (TabBar owns it). Modal screens
          (`presentation="modal"`) also skip the bottom inset.
        </Text>
      </Section>

      <Section title="Variants">
        <Text size="sm" tone="tertiary">
          Each variant is a token bundle (bg color, card color, accent, glow)
          defined in `src/components/variant-config.ts`. Variants propagate to
          descendants via `VariantProvider` — children can read with
          `useVariant()`.
        </Text>
        {VARIANTS.map((variant) => (
          <PropRow
            key={variant}
            label={`variant="${variant}"`}
            note={VARIANT_NOTES[variant]}
          >
            <ScreenPreview variant={variant} scheme={scheme} />
          </PropRow>
        ))}
      </Section>

      <Section title="Scroll + fade">
        <PropRow
          label="scroll={true}"
          note="Wraps body in a ScrollView. Bottom padding auto-reserves room for the sticky CTA + fade height."
        />
        <PropRow
          label="fade={true}"
          note="Bottom gradient fade matching the screen bg. Defaults to `true` whenever `scroll` is on; pass `false` to disable for full-bleed lists."
        />
        <PropRow
          label="contentClassName"
          note='ScrollView contentContainer className. Use it for inter-item gap + bottom padding (e.g. "gap-4 pb-6").'
        />
        <PropRow
          label="className"
          note='Overrides the body padding container (default "px-screen-x pt-screen-y"). Pass "" to opt out (e.g. when an inner FlatList manages its own padding).'
        />
      </Section>

      <Section title="Header + sticky CTA">
        <PropRow
          label="header={<Header … />}"
          note="Pinned slot rendered above the scrolling body. Stays visible while content scrolls underneath."
        />
        <PropRow
          label="sticky={<Button … />}"
          note="Absolute-positioned bottom slot. Rises with the keyboard via KeyboardStickyView; its measured height feeds bottom-padding so the last list row never clips."
        />
      </Section>

      <Section title="Keyboard">
        <PropRow
          label="keyboard={true}"
          note="Wraps body in KeyboardAvoidingView (behavior='padding'). Use on forms where the input would otherwise be covered by the keyboard. Not needed when you have a `sticky` slot — KeyboardStickyView handles the lift already."
        />
      </Section>

      <Section title="Safe-area insets">
        <PropRow
          label="insetTop={true} (default)"
          note="Apply top safe-area inset. Pass `false` only for full-bleed hero screens that draw their own status-bar overlay."
        />
        <PropRow
          label="insetBottom"
          note="Auto-detected: !inTabs && !modal. Tabs route → TabBar owns bottom inset; modal route → no bottom inset. Override only for special cases."
        />
        <PropRow
          label='presentation="modal"'
          note="Marks the screen as a modal presentation. Tweaks bottom-inset behavior; should be passed whenever the route renders as a sheet/modal."
        />
      </Section>

      <Section title="Real-world patterns">
        <Text size="sm" tone="tertiary">
          The whole app is a live demo — every navigated screen is wrapped in
          this primitive. Below are the canonical wiring patterns.
        </Text>

        <PropRow label="Scrollable dashboard (variant + header + scroll)">
          <CodeBlock>
            {`<Screen
 
  scroll
  header={<ShowcaseHeader title="Today" />}
  contentClassName="gap-4 pb-6"
>
  {/* cards */}
</Screen>`}
          </CodeBlock>
        </PropRow>

        <PropRow label="Auth form (variant + keyboard + sticky CTA)">
          <CodeBlock>
            {`<Screen
  keyboard
  header={<Header backOnly />}
  sticky={<Button onPress={onSubmit}>Continue</Button>}
>
  <TextField label="Email" … />
  <TextField label="Password" type="password" … />
</Screen>`}
          </CodeBlock>
        </PropRow>

        <PropRow label="Onboarding step (variant + sticky + scroll)">
          <CodeBlock>
            {`<Screen
 
  scroll
  header={<ProgressDots step={2} total={5} />}
  sticky={<Button onPress={next}>Next</Button>}
  contentClassName="gap-6 pb-6"
>
  {/* question content */}
</Screen>`}
          </CodeBlock>
        </PropRow>

        <PropRow label="Modal sheet (presentation + no top inset header)">
          <CodeBlock>
            {`<Screen
 
  presentation="modal"
  scroll
  header={<Header title="Filters" close />}
>
  {/* filter form */}
</Screen>`}
          </CodeBlock>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Wrapping a Screen inside another View with its own bg"
          good="Screen owns the bg + insets — let it be the root. Wrap Screen with a stack/modal navigator above, never with extra layout chrome."
        >
          <CodeBlock>
            {`<View className="bg-black">       ✕ defeats variant bg
  <Screen>
    …
  </Screen>
</View>`}
          </CodeBlock>
        </DontRow>

        <DontRow
          bad="Using ScrollView inside Screen instead of `scroll` prop"
          good="`scroll` reserves the right bottom padding (sticky + fade) and wires the fade gradient. A raw ScrollView won't."
        >
          <CodeBlock>
            {`<Screen>
  <ScrollView>            ✕ no fade, no bottom reservation
    …
  </ScrollView>
</Screen>`}
          </CodeBlock>
        </DontRow>

        <DontRow
          bad="Pairing `keyboard` and `sticky` (double lift)"
          good="`sticky` already lifts with the keyboard. Use `keyboard` only on forms without a sticky CTA."
        >
          <CodeBlock>
            {`<Screen keyboard sticky={<Button … />}>   ✕ jitter on keyboard open
  …
</Screen>`}
          </CodeBlock>
        </DontRow>

        <DontRow
          bad="Hardcoding `paddingTop: insets.top` inside the screen body"
          good="Screen already applies the top inset. Add padding to header content, not to the body root."
        >
          <CodeBlock>
            {`<Screen>
  <View style={{ paddingTop: insets.top }}>   ✕ double inset
    …
  </View>
</Screen>`}
          </CodeBlock>
        </DontRow>
      </Section>

      <Section title="Live demo">
        <Text size="sm" tone="tertiary">
          The catalog you're reading right now is a live Screen
          (variant=&quot;default&quot;, scroll, with a Header). Navigate
          anywhere in the app to see the other variants in their natural habitat
          — auth / sign-in for `auth`, account-creation flow for `onboarding`.
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onPress={() => router.push('/auth/sign-in')}
          >
            Open auth
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => router.push('/account-creation')}
          >
            Open onboarding
          </Button>
        </View>
      </Section>
    </Screen>
  );
}

function ScreenPreview({
  variant,
  scheme,
}: {
  variant: Variant;
  scheme: 'light' | 'dark';
}) {
  const v = variantConfig[variant][scheme];
  const hasGlow = !!v.glow;
  return (
    <View
      style={[
        previewStyles.frame,
        { backgroundColor: v.bgHex, borderColor: withAlpha('#ffffff', 0.08) },
      ]}
    >
      {hasGlow && v.glow ? (
        <LinearGradient
          colors={[
            withAlpha(v.glow.startColor, 0.35 * v.glow.intensity),
            withAlpha(v.glow.endColor, 0.18 * v.glow.intensity),
            withAlpha(v.bgHex, 0),
          ]}
          start={{ x: v.glow.centerX, y: 0 }}
          end={{ x: v.glow.centerX, y: 0.7 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      <View className="flex-1 justify-between p-4">
        <View className="flex-row items-center justify-between">
          <Badge tone="pink" variant="tinted">
            {variant}
          </Badge>
          <Text size="xs" tone="tertiary" className="font-mono">
            {v.bgHex}
          </Text>
        </View>
        <View className="gap-1">
          <Text size="md" weight="bold">
            Sample header
          </Text>
          <Text size="sm" tone="secondary">
            Body content uses variant tokens for bg + accent.
          </Text>
        </View>
      </View>
    </View>
  );
}

function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <RNView className="rounded-md border border-foreground/10 bg-foreground/[0.04] p-3">
      <Text size="xs" tone="secondary" className="font-mono leading-relaxed">
        {children}
      </Text>
    </RNView>
  );
}

const previewStyles = StyleSheet.create({
  frame: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

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
  children?: React.ReactNode;
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
