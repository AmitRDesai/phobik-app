import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import {
  AudioPlayer,
  type AudioPlayerVariant,
} from '@/components/ui/AudioPlayer';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { type AccentHue } from '@/constants/colors';
import { useEffect, useState } from 'react';

const SAMPLE_ARTWORK =
  'https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=600&auto=format';
const TRACK_DURATION = 240;

const VARIANT_NOTES: Record<AudioPlayerVariant, string> = {
  hero: 'Full-screen practice / meditation player. The control row is configurable — pass only the handlers you want and the buttons compose themselves.',
  card: 'List-item card with artwork + 2-line text + scrubber + play. Fills the gap between mini (no scrubber) and inline (no artwork) — best for media-library list rows.',
  mini: 'Compact docked strip — thumbnail + title + small play button + hairline progress at the bottom.',
  inline:
    'Single-row attachment inside a card — play button + small scrubber + timestamps.',
};

const TONES: AccentHue[] = ['pink', 'cyan', 'purple', 'orange'];

export default function AudioPlayerShowcase() {
  // Each section gets its own faux player so they tick independently.
  const meditation = useFauxPlayer();
  const sleep = useFauxPlayer();
  const instruction = useFauxPlayer();
  const ambient = useFauxPlayer();
  const downloading = useFauxPlayer(true);
  const card1 = useFauxPlayer();
  const card2 = useFauxPlayer();
  const card3 = useFauxPlayer();
  const mini = useFauxPlayer();
  const inline = useFauxPlayer();
  const seekable = useFauxPlayer();
  const tonedHero = useFauxPlayer();

  const [voice, setVoice] = useState<'female' | 'male'>('female');
  const [muted, setMuted] = useState(false);
  const [ambientMuted, setAmbientMuted] = useState(false);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="AudioPlayer" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Themed audio-playback UI. PRESENTATION ONLY — the parent owns the
          audio player hook (e.g. `useManagedAudioPlayer`) and feeds the
          primitive with `progress`, `duration`, `playing`, and `onTogglePlay`.
          The control row composes itself from whichever optional handlers you
          pass.
        </Text>
        <Text size="sm" tone="tertiary">
          Three layout variants — `hero` (default, full-screen), `mini` (docked
          strip), `inline` (row inside a card). The hero variant gets
          configurable control buttons: skip-back, skip-forward (time-based or
          `skip-next` instruction), voice toggle pill, and mute toggle.
        </Text>
      </Section>

      <Section title='variant="hero" — meditation (canonical)'>
        <Text size="sm" tone="tertiary">
          Back (-10s) + play + forward (+30s) + voice toggle pill above the
          scrubber. Pattern lifted from `MeditationScreen.tsx`.
        </Text>
        <AudioPlayer
          variant="hero"
          title="Loving Kindness"
          subtitle="10-minute guided meditation"
          artworkUri={SAMPLE_ARTWORK}
          progress={meditation.progress}
          duration={TRACK_DURATION}
          playing={meditation.playing}
          onTogglePlay={meditation.toggle}
          onSeek={meditation.seek}
          onSkipBack={meditation.skipBack}
          onSkipForward={meditation.skipForward}
          voiceLabel={`${voice === 'female' ? 'Female' : 'Male'} voice`}
          voiceIcon={voice}
          onToggleVoice={() =>
            setVoice((v) => (v === 'female' ? 'male' : 'female'))
          }
        />
      </Section>

      <Section title='variant="hero" — sleep meditation (no forward)'>
        <Text size="sm" tone="tertiary">
          Sleep flows omit forward — users shouldn&apos;t skip ahead in a
          wind-down. Drop `onSkipForward` and the button disappears.
        </Text>
        <AudioPlayer
          variant="hero"
          title="Sleep Meditation"
          subtitle="20-minute wind-down"
          artworkUri={SAMPLE_ARTWORK}
          progress={sleep.progress}
          duration={1200}
          playing={sleep.playing}
          onTogglePlay={sleep.toggle}
          onSkipBack={sleep.skipBack}
          tone="purple"
        />
      </Section>

      <Section title='variant="hero" — instruction skip'>
        <Text size="sm" tone="tertiary">
          Practice screens that move between phases need a `skip-to-next-step`
          action instead of fixed-time forward. Pass{' '}
          <Text className="font-mono">
            skipForwardKind=&quot;instruction&quot;
          </Text>{' '}
          to swap the forward icon to `skip-next` (no seconds label).
        </Text>
        <AudioPlayer
          variant="hero"
          title="Box Breathing"
          subtitle="4-4-4-4 · phase 2 of 4"
          artworkUri={SAMPLE_ARTWORK}
          progress={instruction.progress}
          duration={TRACK_DURATION}
          playing={instruction.playing}
          onTogglePlay={instruction.toggle}
          onSkipBack={instruction.skipBack}
          onSkipForward={instruction.skipForward}
          skipForwardKind="instruction"
          tone="cyan"
        />
      </Section>

      <Section title='variant="hero" — ambient (mute toggle)'>
        <Text size="sm" tone="tertiary">
          Ambient / background-audio flows often want mute as the primary
          control — no scrubbing, no skip. Drop all skip handlers and add{' '}
          <Text className="font-mono">muted</Text> +{' '}
          <Text className="font-mono">onToggleMute</Text>.
        </Text>
        <AudioPlayer
          variant="hero"
          title="Forest Soundscape"
          subtitle="Background loop"
          artworkUri={SAMPLE_ARTWORK}
          progress={ambient.progress}
          duration={TRACK_DURATION}
          playing={ambient.playing}
          onTogglePlay={ambient.toggle}
          muted={ambientMuted}
          onToggleMute={() => setAmbientMuted((m) => !m)}
          tone="orange"
        />
      </Section>

      <Section title="Loading + download progress">
        <Text size="sm" tone="tertiary">
          When `loading` is true the play button hides the icon. Pass
          `loadingLabel` to replace the spinner with text (e.g. "67%") — used by
          meditation while downloading the audio asset.
        </Text>
        <PropRow label="loading={true} + loadingLabel='67%'">
          <AudioPlayer
            variant="hero"
            title="Buffering download"
            subtitle="Downloading 67%"
            artworkUri={SAMPLE_ARTWORK}
            progress={0.1}
            duration={TRACK_DURATION}
            playing={false}
            loading
            loadingLabel="67%"
            onTogglePlay={downloading.toggle}
            onSkipBack={downloading.skipBack}
            onSkipForward={downloading.skipForward}
          />
        </PropRow>
        <PropRow label="loading={true} (spinner, no label)">
          <AudioPlayer
            variant="mini"
            title="Loading…"
            subtitle="Generic spinner"
            progress={0}
            duration={TRACK_DURATION}
            playing={false}
            loading
            onTogglePlay={() => {}}
          />
        </PropRow>
      </Section>

      <Section title="Mute toggle (everywhere)">
        <Text size="sm" tone="tertiary">
          `muted` + `onToggleMute` adds a volume button. In hero it joins the
          control row; in mini/inline it sits flush-right.
        </Text>
        <PropRow label="hero with all controls + mute">
          <AudioPlayer
            variant="hero"
            title="Full control set"
            subtitle="Skip + forward + mute"
            artworkUri={SAMPLE_ARTWORK}
            progress={meditation.progress}
            duration={TRACK_DURATION}
            playing={meditation.playing}
            onTogglePlay={meditation.toggle}
            onSkipBack={meditation.skipBack}
            onSkipForward={meditation.skipForward}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
          />
        </PropRow>
      </Section>

      <Section title='variant="card"'>
        <Text size="sm" tone="tertiary">
          {VARIANT_NOTES.card}
        </Text>
        <AudioPlayer
          variant="card"
          title="Yoga Nidra"
          subtitle="Guided sleep meditation · 24 min"
          artworkUri={SAMPLE_ARTWORK}
          progress={card1.progress}
          duration={1440}
          playing={card1.playing}
          onTogglePlay={card1.toggle}
        />
        <AudioPlayer
          variant="card"
          title="Loving Kindness"
          subtitle="Phobik · 10 min"
          artworkUri={SAMPLE_ARTWORK}
          progress={card2.progress}
          duration={600}
          playing={card2.playing}
          onTogglePlay={card2.toggle}
          tone="purple"
        />
        <AudioPlayer
          variant="card"
          title="Body Scan"
          subtitle="No artwork example · 8 min"
          progress={card3.progress}
          duration={480}
          playing={card3.playing}
          onTogglePlay={card3.toggle}
          onSeek={card3.seek}
        />
      </Section>

      <Section title='variant="mini"'>
        <Text size="sm" tone="tertiary">
          {VARIANT_NOTES.mini}
        </Text>
        <AudioPlayer
          variant="mini"
          title="Body Scan — gentle reset"
          subtitle="Phobik · 4:00"
          artworkUri={SAMPLE_ARTWORK}
          progress={mini.progress}
          duration={TRACK_DURATION}
          playing={mini.playing}
          onTogglePlay={mini.toggle}
        />
      </Section>

      <Section title='variant="inline"'>
        <Text size="sm" tone="tertiary">
          {VARIANT_NOTES.inline}
        </Text>
        <Card variant="raised" size="md" className="gap-3">
          <Text size="md" weight="semibold">
            Voice note from today
          </Text>
          <Text size="sm" tone="secondary">
            A quick reflection on the morning&apos;s pivot.
          </Text>
          <AudioPlayer
            variant="inline"
            title="Voice note · 0:42"
            progress={inline.progress}
            duration={42}
            playing={inline.playing}
            onTogglePlay={inline.toggle}
          />
        </Card>
      </Section>

      <Section title="Tones">
        <Text size="sm" tone="tertiary">
          The `tone` prop colors the scrubber + the glow around the play button.
          Use to tie playback color to the surrounding screen.
        </Text>
        {TONES.map((t) => (
          <PropRow key={t} label={`tone="${t}"`}>
            <AudioPlayer
              variant="inline"
              title="Sample track"
              progress={0.4}
              duration={TRACK_DURATION}
              playing={false}
              onTogglePlay={() => {}}
              tone={t}
            />
          </PropRow>
        ))}
        <PropRow label='hero + tone="cyan"'>
          <AudioPlayer
            variant="hero"
            title="Calm Reset"
            subtitle="Cyan-toned meditation"
            artworkUri={SAMPLE_ARTWORK}
            progress={tonedHero.progress}
            duration={TRACK_DURATION}
            playing={tonedHero.playing}
            onTogglePlay={tonedHero.toggle}
            tone="cyan"
          />
        </PropRow>
      </Section>

      <Section title="Without artwork">
        <Text size="sm" tone="tertiary">
          Skip `artworkUri` on hero to render a music-note placeholder; mini
          falls back to a smaller placeholder chip.
        </Text>
        <PropRow label="hero (no artwork)">
          <AudioPlayer
            variant="hero"
            title="No artwork track"
            subtitle="Placeholder fills the slot"
            progress={0.3}
            duration={TRACK_DURATION}
            playing={false}
            onTogglePlay={() => {}}
            onSkipBack={() => {}}
            onSkipForward={() => {}}
          />
        </PropRow>
        <PropRow label="mini (no artwork)">
          <AudioPlayer
            variant="mini"
            title="No artwork track"
            subtitle="Music-note placeholder"
            progress={0.3}
            duration={TRACK_DURATION}
            playing={false}
            onTogglePlay={() => {}}
          />
        </PropRow>
      </Section>

      <Section title="Seekable scrubber">
        <Text size="sm" tone="tertiary">
          Pass `onSeek` to enable tap-to-seek. The handler receives the target
          time in seconds. (Drag-to-scrub is left to the caller — pair with a
          Gesture if needed.)
        </Text>
        <AudioPlayer
          variant="inline"
          title="Tap the scrubber to seek"
          progress={seekable.progress}
          duration={TRACK_DURATION}
          playing={seekable.playing}
          onTogglePlay={seekable.toggle}
          onSeek={seekable.seek}
        />
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Coupling AudioPlayer directly to expo-audio inside the primitive"
          good="The primitive stays presentation-only. The screen owns the player hook and feeds props in — keeps the surface testable + reusable with mocked state."
        />

        <DontRow
          bad="Using `inline` for a full-screen practice session"
          good="Inline is a single row inside a card. Practice / meditation flows need `hero` so artwork + skip controls have room to breathe."
        />

        <DontRow
          bad="Using `hero` as a persistent docked player"
          good="Hero is meant to live on its own screen. A docked player below a body needs `mini` so it doesn't dominate."
        />

        <DontRow
          bad="Mixing variants on the same screen (hero + mini both visible)"
          good="One variant per surface. Two players competing for attention means neither feels primary."
        />

        <DontRow
          bad="Passing every skip / voice / mute handler when only one is needed"
          good="Omit handlers you don't need — the control row composes itself. Extra buttons add noise and steal taps."
        />

        <DontRow
          bad="Using a generic spinner when you have download progress"
          good="If you know the percent (asset downloading), pass `loadingLabel='67%'` — users prefer a visible number over an indefinite spinner."
        />
      </Section>
    </Screen>
  );
}

function useFauxPlayer(initialLoading = false) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 1 / TRACK_DURATION));
    }, 1000);
    return () => clearInterval(id);
  }, [playing]);

  return {
    progress,
    playing,
    loading: initialLoading,
    toggle: () => setPlaying((p) => !p),
    seek: (seconds: number) =>
      setProgress(Math.max(0, Math.min(1, seconds / TRACK_DURATION))),
    skipBack: () => setProgress((p) => Math.max(0, p - 10 / TRACK_DURATION)),
    skipForward: () => setProgress((p) => Math.min(1, p + 30 / TRACK_DURATION)),
  };
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
