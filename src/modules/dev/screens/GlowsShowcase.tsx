import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GlowBg } from '@/components/ui/GlowBg';
import { Header } from '@/components/ui/Header';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';

export default function GlowsShowcase() {
  const router = useRouter();

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Glows (GlowBg + RadialGlow)" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What they are">
        <Text size="sm" tone="secondary">
          Two radial-gradient primitives for ambient brand color behind
          surfaces. They look similar but operate at different scales.
        </Text>
        <View className="gap-1.5">
          <Text size="sm" tone="primary" weight="semibold">
            GlowBg
          </Text>
          <Text size="sm" tone="secondary">
            Full-window radial gradient with two color stops + a fade mask.
            Mainly used through Screen variants (the page you&apos;re reading is
            rendering one right now); occasionally instantiated directly for
            hero / splash cards.
          </Text>
        </View>
        <View className="gap-1.5">
          <Text size="sm" tone="primary" weight="semibold">
            RadialGlow
          </Text>
          <Text size="sm" tone="secondary">
            Sized, absolutely-positioned single-color halo. Used to ambient-
            color a single element (card, illustration, button cluster) — think
            soft pink halo behind a hero number.
          </Text>
        </View>
      </Section>

      <Section title="RadialGlow — API">
        <PropRow label="Props">
          <View className="gap-1.5">
            <PropDoc name="color">
              Single accent color. Flowed at 15% center → 5% mid → 0% edge —
              pick a saturated brand color so the halo reads at low alpha.
            </PropDoc>
            <PropDoc name="size">
              Edge length in px of the (square) SVG canvas. The ellipse fills
              it. Pick ~1.5–2× the diameter of the element being haloed.
            </PropDoc>
            <PropDoc name="style">
              Forwarded to the wrapping SVG. Use for absolute offsets (`top`,
              `left`, etc.) — the primitive is already `position: absolute`, so
              style positions it inside its relative parent.
            </PropDoc>
          </View>
        </PropRow>
      </Section>

      <Section title="RadialGlow — sizes">
        <PropRow label="size=120" note="Behind a small icon or chip.">
          <GlowStage>
            <RadialGlow color={colors.primary.pink} size={120} />
            <MaterialIcons
              name="favorite"
              size={32}
              color={colors.primary.pink}
            />
          </GlowStage>
        </PropRow>

        <PropRow label="size=240" note="Behind a card or numeric milestone.">
          <GlowStage tall>
            <RadialGlow color={colors.primary.pink} size={240} />
            <Text size="display" weight="black">
              14
            </Text>
          </GlowStage>
        </PropRow>

        <PropRow
          label="size=360"
          note="Hero / splash — the glow extends past the framed element."
        >
          <GlowStage tall>
            <RadialGlow color={colors.primary.pink} size={360} />
            <View className="items-center gap-1">
              <Text size="h1" weight="black">
                Phobik
              </Text>
              <Text size="sm" tone="secondary">
                Start your day grounded
              </Text>
            </View>
          </GlowStage>
        </PropRow>
      </Section>

      <Section title="RadialGlow — colors">
        <Text size="sm" tone="tertiary">
          Single color flowed at 15% center → 5% mid → 0% edge. Pick a saturated
          brand color so the halo reads even at low opacity.
        </Text>
        <View className="flex-row flex-wrap gap-4">
          {(
            [
              { color: colors.primary.pink, label: 'pink' },
              { color: colors.accent.yellow, label: 'yellow' },
              { color: colors.accent.cyan, label: 'cyan' },
              { color: colors.accent.purple, label: 'purple' },
              { color: colors.accent.orange, label: 'orange' },
            ] as const
          ).map((opt) => (
            <View key={opt.label} className="items-center gap-2">
              <GlowStage square>
                <RadialGlow color={opt.color} size={160} />
                <View
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: opt.color }}
                />
              </GlowStage>
              <Text size="xs" tone="tertiary" className="font-mono">
                {opt.label}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="RadialGlow — positioning">
        <PropRow
          label="style={{ top: -40, left: -40 }}"
          note="Glow center can extend past the parent. Pair with `overflow-hidden` to clip the bleed."
        >
          <View className="overflow-hidden rounded-2xl border border-foreground/10 p-6">
            <View className="relative h-32">
              <RadialGlow
                color={colors.primary.pink}
                size={200}
                style={{ top: -40, left: -40 }}
              />
              <RadialGlow
                color={colors.accent.cyan}
                size={200}
                style={{ bottom: -40, right: -40 }}
              />
              <View className="absolute inset-0 items-center justify-center">
                <Text size="lg" weight="bold">
                  Dual-corner glow
                </Text>
              </View>
            </View>
          </View>
        </PropRow>
      </Section>

      <Section title="GlowBg">
        <Text size="sm" tone="tertiary">
          The full-window glow primitive — sized to `useWindowDimensions()`. The
          Screen primitive owns its lifecycle for the 3 variants; for free-form
          usage, mount it inside an `absolute inset-0` parent under your screen
          content.
        </Text>

        <PropRow
          label="Cropped preview"
          note="GlowBg always paints to the window, so this frame shows the top-left portion of a window-sized glow centered at (0.5, 0.25) — exactly what the default variant renders."
        >
          <View
            className="overflow-hidden rounded-2xl border border-foreground/10"
            style={{ height: 220 }}
            pointerEvents="none"
          >
            <GlowBg
              centerX={0.5}
              centerY={0.25}
              intensity={0.6}
              radius={0.4}
              startColor={colors.primary.pink}
              endColor={colors.accent.yellow}
              bgClassName="bg-transparent"
            />
          </View>
        </PropRow>

        <PropRow label="Props">
          <View className="gap-1.5">
            <PropDoc name="startColor / endColor">
              Two-stop diagonal gradient (top-left → bottom-right). Defaults to
              chakra orange → primary pink.
            </PropDoc>
            <PropDoc name="centerX / centerY (0..1)">
              Position of the glow center as a fraction of the screen. Default
              0.5 / 0.5 (centered).
            </PropDoc>
            <PropDoc name="radius (0..1)">
              Glow radius as a fraction of `max(width, height)`. Default 0.4.
            </PropDoc>
            <PropDoc name="intensity (0..1)">
              Multiplier on the alpha stops. 1 = full saturation. 0 = no glow
              (still renders the bg). Default 1.
            </PropDoc>
            <PropDoc name="bgClassName">
              Underlying solid bg class. Default `bg-surface` (theme-aware).
              Pass `bg-transparent` when stacking inside an existing bg.
            </PropDoc>
          </View>
        </PropRow>

        <PropRow
          label="Live demo via Screen variants"
          note="Each of the 3 Screen variants composes a different GlowBg config — the easiest way to see GlowBg behavior is to flip through them."
        >
          <View className="flex-row flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onPress={() => router.push('/dev/design-system/screens')}
            >
              Open Screen showcase
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => router.push('/auth/sign-in')}
            >
              Open auth variant
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => router.push('/account-creation')}
            >
              Open onboarding variant
            </Button>
          </View>
        </PropRow>
      </Section>

      <Section title="When to use which">
        <View className="gap-3">
          <View className="gap-1">
            <Text size="sm" weight="semibold">
              Use GlowBg when…
            </Text>
            <Text size="sm" tone="secondary">
              The whole screen needs a brand-color wash (auth landing, splash,
              dashboard hero). Pair with `Screen variant=` first before reaching
              for a free-form GlowBg.
            </Text>
          </View>
          <View className="gap-1">
            <Text size="sm" weight="semibold">
              Use RadialGlow when…
            </Text>
            <Text size="sm" tone="secondary">
              A single element needs a halo (hero numeric milestone, celebratory
              card, illustration backdrop). Position it absolutely behind the
              element with overflow-hidden on the parent to clip the bleed.
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Stacking multiple full-window GlowBgs on the same screen"
          good="GlowBg always paints the entire window. Two GlowBgs = overdraw + muddled brand color. Pick one config and adjust centerX/Y/radius."
        >
          <Text size="xs" tone="secondary">
            (Conceptual — visually you&apos;d get two competing washes that
            cancel each other.)
          </Text>
        </DontRow>

        <DontRow
          bad="RadialGlow with low-opacity tertiary colors"
          good="The primitive already renders at 5–15% alpha. Layering a soft pastel color on top makes the halo invisible — pick a saturated brand color."
        >
          <GlowStage>
            <RadialGlow color="#e0e0e0" size={160} />
            <Text size="sm" tone="tertiary">
              Barely visible
            </Text>
          </GlowStage>
        </DontRow>

        <DontRow
          bad="RadialGlow without an `overflow-hidden` parent"
          good="When the glow extends past the element bounds, surrounding content gets a stray halo. Always clip on the parent."
        >
          <View className="rounded-2xl border border-foreground/10 p-6">
            <View className="relative h-24">
              <RadialGlow
                color={colors.primary.pink}
                size={400}
                style={{ top: -80, left: -80 }}
              />
              <View className="absolute inset-0 items-center justify-center">
                <Text size="sm" tone="tertiary">
                  Halo bleeds outside the card
                </Text>
              </View>
            </View>
          </View>
        </DontRow>

        <DontRow
          bad="GlowBg on light-mode surfaces with full intensity"
          good="The variant config already drops `glow` to null on light mode for a reason — bright radial gradients wash out near-white bgs. Keep light-mode surfaces glow-free or hand-tune intensity ≤ 0.3."
        >
          <Text size="xs" tone="secondary">
            (Conceptual — see Screen showcase: light-mode variants intentionally
            have no glow.)
          </Text>
        </DontRow>
      </Section>
    </Screen>
  );
}

function GlowStage({
  children,
  tall,
  square,
}: {
  children: ReactNode;
  tall?: boolean;
  square?: boolean;
}) {
  return (
    <View
      className="items-center justify-center overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02]"
      style={{
        height: square ? 120 : tall ? 200 : 120,
        width: square ? 120 : undefined,
      }}
    >
      {children}
    </View>
  );
}

function PropDoc({ name, children }: { name: string; children: ReactNode }) {
  return (
    <View className="gap-0.5">
      <Text size="xs" tone="primary" className="font-mono">
        {name}
      </Text>
      <Text size="xs" tone="secondary">
        {children}
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
