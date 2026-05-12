import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { Screen } from '@/components/ui/Screen';
import { Image } from 'react-native';

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=800&auto=format';

export default function ImageScrimShowcase() {
  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="ImageScrim" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Darkening overlay for image-backed surfaces. Drop on top of an `Image`
          inside an `overflow-hidden` parent — the scrim absolute-fills and
          fades from transparent to a near-black edge so text overlaid on the
          image (titles, captions) has enough contrast.
        </Text>
        <Text size="sm" tone="tertiary">
          Uses `#0e0e0e` (slightly plum-tinted near-black) instead of pure black
          so the scrim blends with the app&apos;s warm tonality. Always
          `position: absolute; inset: 0` — parent must be a positioned container
          with `overflow: hidden`.
        </Text>
      </Section>

      <Section title="Direction">
        <PropRow
          label='direction="bottom" (default)'
          note="Fades from transparent at the top to dark at the bottom — for captions / titles overlaid on the bottom edge of an image."
        >
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim direction="bottom" />
            <View className="absolute bottom-4 left-4 right-4">
              <Text size="md" weight="bold" tone="inverse">
                Caption overlaid on the bottom
              </Text>
              <Text size="sm" tone="inverse" className="opacity-80">
                Readable thanks to the scrim
              </Text>
            </View>
          </Stage>
        </PropRow>

        <PropRow
          label='direction="top"'
          note="Mirrors the bottom variant — dark at the top, transparent at the bottom. Use for top-edge titles or status bars over a busy image."
        >
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim direction="top" />
            <View className="absolute left-4 right-4 top-4">
              <Text size="md" weight="bold" tone="inverse">
                Title overlaid on the top
              </Text>
            </View>
          </Stage>
        </PropRow>

        <PropRow
          label="Both edges (stack two ImageScrims)"
          note="For images that need contrast at both ends. Compose top + bottom."
        >
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim direction="top" strength={0.5} start={0.6} />
            <ImageScrim direction="bottom" strength={0.7} start={0.4} />
            <View className="absolute left-4 right-4 top-4">
              <Text size="md" weight="bold" tone="inverse">
                Top title
              </Text>
            </View>
            <View className="absolute bottom-4 left-4 right-4">
              <Text size="md" weight="bold" tone="inverse">
                Bottom caption
              </Text>
            </View>
          </Stage>
        </PropRow>
      </Section>

      <Section title="Strength">
        <PropRow label="strength={0.4} — light">
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim strength={0.4} />
            <View className="absolute bottom-4 left-4 right-4">
              <Text size="sm" weight="bold" tone="inverse">
                Subtle darken
              </Text>
            </View>
          </Stage>
        </PropRow>

        <PropRow
          label="strength={0.7} — default"
          note="Most common — clear contrast for body / caption text."
        >
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim strength={0.7} />
            <View className="absolute bottom-4 left-4 right-4">
              <Text size="sm" weight="bold" tone="inverse">
                Standard darken
              </Text>
            </View>
          </Stage>
        </PropRow>

        <PropRow
          label="strength={0.9} — heavy"
          note="For very busy images or small-text overlays where contrast is critical."
        >
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim strength={0.9} />
            <View className="absolute bottom-4 left-4 right-4">
              <Text size="sm" weight="bold" tone="inverse">
                Heavy darken
              </Text>
            </View>
          </Stage>
        </PropRow>
      </Section>

      <Section title="Coverage (start)">
        <PropRow
          label="start={0.2} — bottom 80% darkened"
          note="Gradient starts near the top — darkens most of the image."
        >
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim start={0.2} />
          </Stage>
        </PropRow>

        <PropRow
          label="start={0.5} — bottom 50% darkened"
          note="Gradient starts midway."
        >
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim start={0.5} />
          </Stage>
        </PropRow>

        <PropRow
          label="start={0.75} — bottom 25% darkened"
          note="Gradient starts near the bottom — preserves most of the image, only darkens the caption area."
        >
          <Stage>
            <Image
              source={{ uri: SAMPLE_IMAGE }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <ImageScrim start={0.75} />
          </Stage>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="Hero card with bottom title (start=0.3, strength=0.8)"
          note="Big image with a multi-line title pinned to the bottom — strong scrim ensures legibility on any image."
        >
          <View className="overflow-hidden rounded-3xl">
            <View style={{ height: 280 }}>
              <Image
                source={{ uri: SAMPLE_IMAGE }}
                className="absolute inset-0"
                resizeMode="cover"
              />
              <ImageScrim start={0.3} strength={0.8} />
              <View className="absolute bottom-6 left-6 right-6">
                <Text size="xs" treatment="caption" tone="inverse">
                  FEATURED PRACTICE
                </Text>
                <Text size="h2" weight="bold" tone="inverse" className="mt-1">
                  Soft body scan
                </Text>
                <Text size="sm" tone="inverse" className="mt-1 opacity-80">
                  10 min · slow attention through the body
                </Text>
              </View>
            </View>
          </View>
        </PropRow>

        <PropRow
          label="Compact card row (start=0.65, strength=0.6)"
          note="Lighter scrim — preserves more of the image while keeping the title row legible."
        >
          <View className="overflow-hidden rounded-2xl">
            <View style={{ height: 160 }}>
              <Image
                source={{ uri: SAMPLE_IMAGE }}
                className="absolute inset-0"
                resizeMode="cover"
              />
              <ImageScrim start={0.65} strength={0.6} />
              <View className="absolute bottom-3 left-4 right-4">
                <Text size="md" weight="bold" tone="inverse">
                  Morning Reset
                </Text>
              </View>
            </View>
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using ImageScrim without an `overflow-hidden` positioned parent"
          good="The scrim is `absolute inset-0` — without a positioned parent it fills the nearest ancestor (or the screen). Always wrap in `overflow-hidden rounded-X` with an explicit height / aspect ratio."
        />

        <DontRow
          bad="Strength > 1 (more than full opacity)"
          good="Clamped to [0,1] internally, but >1 is meaningless. If contrast is still too low at strength=1, the image itself needs to change — pick a darker hero or add a black background plate."
        />

        <DontRow
          bad="ImageScrim under text that fights the gradient direction"
          good="bottom-direction scrim → text at the bottom. top-direction → text at the top. Putting a title at the top of a bottom-scrim image leaves the title unprotected."
        />

        <DontRow
          bad="Stacking 3+ ImageScrims for fine-grained tweaking"
          good="One per edge is plenty. If you need a continuous-fade across the whole image (not just edges), use a LinearGradient directly with locations + colors tuned to the design."
        />
      </Section>
    </Screen>
  );
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="overflow-hidden rounded-2xl border border-foreground/10"
      style={{ height: 160 }}
    >
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
