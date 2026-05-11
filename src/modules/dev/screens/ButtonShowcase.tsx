import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { MaterialIcons } from '@expo/vector-icons';

const VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'ghost',
  'destructive',
];

const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg'];

const SIZE_NOTES: Record<ButtonSize, string> = {
  xs: '~28h · 10/up tracked · inline chip / link',
  sm: '~36h · 13/semibold · list-row action',
  md: '~44h · 15/bold · card / form CTA',
  lg: '~56h · 17/bold · hero / sticky bottom (auto full-width)',
};

export default function ButtonShowcase() {
  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Button" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="Variants — default size (md)">
        {VARIANTS.map((variant) => (
          <PropRow key={variant} label={`variant="${variant}"`}>
            <Button variant={variant}>{labelForVariant(variant)}</Button>
          </PropRow>
        ))}
      </Section>

      <Section title="Size scale">
        <Text size="xs" tone="tertiary">
          Names mirror the Text scale. `lg` auto-stretches to full-width; xs/sm/
          md size to their content for inline / chip / card use.
        </Text>
        {SIZES.map((size) => (
          <View key={size} className="gap-1">
            <Text size="xs" tone="tertiary" className="font-mono">
              size=&quot;{size}&quot; · {SIZE_NOTES[size]}
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              <Button size={size}>{size.toUpperCase()} Button</Button>
            </View>
          </View>
        ))}
      </Section>

      <Section title="With icons">
        <PropRow label="prefixIcon (left of label)">
          <Button
            prefixIcon={
              <MaterialIcons name="play-arrow" size={20} color="white" />
            }
          >
            Start Session
          </Button>
        </PropRow>
        <PropRow label="icon (right of label)">
          <Button
            icon={
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            }
          >
            Continue
          </Button>
        </PropRow>
        <PropRow label="both prefixIcon + icon">
          <Button
            prefixIcon={
              <MaterialIcons name="favorite" size={18} color="white" />
            }
            icon={
              <MaterialIcons name="chevron-right" size={20} color="white" />
            }
          >
            Save & Continue
          </Button>
        </PropRow>
        <PropRow label='secondary + prefixIcon (icon color uses "white" for contrast — switch to themed in real use)'>
          <Button
            variant="secondary"
            prefixIcon={<MaterialIcons name="add" size={20} color="#FF4D94" />}
          >
            Add to Plan
          </Button>
        </PropRow>
      </Section>

      <Section title="States">
        <PropRow label="default (idle)">
          <Button>Idle Button</Button>
        </PropRow>
        <PropRow label="disabled — 40% opacity, no haptics, no press">
          <Button disabled>Disabled Button</Button>
        </PropRow>
        <PropRow label="loading — spinner replaces label, press blocked">
          <Button loading>Saving…</Button>
        </PropRow>
        <PropRow label="loading on each variant">
          <View className="gap-3">
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} loading>
                {labelForVariant(variant)}
              </Button>
            ))}
          </View>
        </PropRow>
      </Section>

      <Section title="Layout">
        <PropRow label='size="lg" — full-width by default'>
          <Button>Default fills container</Button>
        </PropRow>
        <PropRow label='size="xs" — fits content, sits inline'>
          <View className="flex-row items-center gap-2">
            <Button size="xs">First</Button>
            <Button size="xs" variant="secondary">
              Second
            </Button>
          </View>
        </PropRow>
        <PropRow label="Stacked CTAs (primary + ghost) — common form pattern">
          <View className="gap-2">
            <Button>Save Reflection</Button>
            <Button variant="ghost">Cancel</Button>
          </View>
        </PropRow>
        <PropRow label="Destructive + secondary — confirmation dialog">
          <View className="gap-2">
            <Button variant="destructive">Delete forever</Button>
            <Button variant="secondary">Keep</Button>
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Sticky sheet CTA (full-width primary)">
          <Card variant="flat" className="gap-2 p-4">
            <Text size="md" tone="secondary" className="leading-relaxed">
              Your changes are saved locally and will sync when you reconnect.
            </Text>
            <Button
              prefixIcon={
                <MaterialIcons name="check-circle" size={20} color="white" />
              }
            >
              Continue
            </Button>
          </Card>
        </PropRow>

        <PropRow label="Inline link-style action (ghost compact)">
          <Card variant="flat" className="flex-row items-center gap-3 p-4">
            <View className="flex-1">
              <Text size="md" weight="semibold">
                Sync paused
              </Text>
              <Text size="sm" tone="secondary">
                3 entries waiting to upload
              </Text>
            </View>
            <Button size="xs" variant="ghost">
              Retry
            </Button>
          </Card>
        </PropRow>

        <PropRow label="Settings danger zone">
          <Card variant="flat" className="gap-3 p-4">
            <Text size="md" weight="semibold">
              Delete account
            </Text>
            <Text size="sm" tone="secondary">
              This permanently erases your journal and synced data.
            </Text>
            <Button variant="destructive">Delete account</Button>
          </Card>
        </PropRow>
      </Section>

      <Section title="Variant × size matrix">
        {VARIANTS.map((variant) => (
          <View key={variant} className="gap-2">
            <Text size="xs" tone="tertiary" className="font-mono">
              {variant}
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              {SIZES.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size}
                </Button>
              ))}
            </View>
          </View>
        ))}
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using primary for every CTA on a screen"
          good="Only one primary per surface — secondary or ghost for siblings"
        >
          <View className="gap-2">
            <Button>Save</Button>
            <Button>Cancel</Button>
            <Button>Reset</Button>
          </View>
        </DontRow>

        <DontRow
          bad="Using destructive for low-stakes 'no' actions"
          good="destructive is reserved for delete/sign-out/irreversible"
        >
          <Button variant="destructive">Dismiss banner</Button>
        </DontRow>

        <DontRow
          bad="Putting a plain Pressable + Text where Button fits"
          good="Use Button variant=ghost for tap-able label-only actions"
        >
          <Button variant="ghost" size="xs">
            View All
          </Button>
        </DontRow>
      </Section>
    </Screen>
  );
}

function labelForVariant(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return 'Primary CTA';
    case 'secondary':
      return 'Secondary';
    case 'ghost':
      return 'Ghost / Link';
    case 'destructive':
      return 'Delete';
  }
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
      <Card variant="flat" className="gap-5 p-5">
        {children}
      </Card>
    </View>
  );
}

function PropRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text size="xs" tone="tertiary" className="font-mono">
        {label}
      </Text>
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
