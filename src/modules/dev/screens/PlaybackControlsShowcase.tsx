import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { ShowcaseHeader } from '../components/ShowcaseHeader';
import {
  PlaybackControls,
  type PlaybackControlsSize,
} from '@/components/ui/PlaybackControls';
import { Screen } from '@/components/ui/Screen';
import { useState } from 'react';

const SIZES: PlaybackControlsSize[] = ['sm', 'md'];

const SIZE_NOTES: Record<PlaybackControlsSize, string> = {
  sm: '48px side buttons + 64px gradient center. Compact — for in-body session controls (Star/Lazy8 breathing).',
  md: '56px side buttons + 80px gradient center. Prominent — for bottom-anchored / hero session controls (DoubleInhale).',
};

export default function PlaybackControlsShowcase() {
  const [paused1, setPaused1] = useState(false);
  const [muted1, setMuted1] = useState(false);
  const [paused2, setPaused2] = useState(true);
  const [muted2, setMuted2] = useState(false);
  const [paused3, setPaused3] = useState(false);
  const [paused4, setPaused4] = useState(false);
  const [muted4, setMuted4] = useState(false);
  const [pausedReady, setPausedReady] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="PlaybackControls" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          Three-slot bottom control row for breathing / meditation sessions:
          mute (left) + gradient play/pause (center) + restart (right). Use when
          the screen has its own real-time visualization and just needs the
          bottom controls; for a full hero player with artwork + scrubber reach
          for `AudioPlayer variant="hero"` instead.
        </Text>
        <Text size="sm" tone="tertiary">
          Mute is optional — omitting `onMuteToggle` renders an invisible spacer
          so the play button stays horizontally centered. Layout (gap +
          horizontal padding) lives in `className`.
        </Text>
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <PropRow key={size} label={`size="${size}"`} note={SIZE_NOTES[size]}>
            <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
              <PlaybackControls
                size={size}
                className={
                  size === 'md'
                    ? 'justify-between px-12'
                    : 'justify-center gap-8'
                }
                isPaused={size === 'sm' ? paused1 : paused2}
                onPauseToggle={
                  size === 'sm'
                    ? () => setPaused1((p) => !p)
                    : () => setPaused2((p) => !p)
                }
                isMuted={size === 'sm' ? muted1 : muted2}
                onMuteToggle={
                  size === 'sm'
                    ? () => setMuted1((m) => !m)
                    : () => setMuted2((m) => !m)
                }
                onRestart={() => {}}
              />
            </View>
          </PropRow>
        ))}
      </Section>

      <Section title="Without mute (invisible spacer)">
        <PropRow
          label="Omit onMuteToggle"
          note="When the session doesn't need a mute control, drop the handler — the slot becomes an invisible spacer so the play button stays centered."
        >
          <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
            <PlaybackControls
              className="justify-center gap-8"
              isPaused={paused3}
              onPauseToggle={() => setPaused3((p) => !p)}
              onRestart={() => {}}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Restart vs skip-next">
        <Text size="sm" tone="tertiary">
          The right button morphs based on `sessionReady`. When `true`
          (default), it shows `replay` — restart the current session. When
          `false`, it shows `skip-next` — advance to the next phase /
          instruction.
        </Text>
        <PropRow
          label="sessionReady (default true) — replay icon"
          note="Mid-session: tapping restarts the active practice."
        >
          <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
            <PlaybackControls
              className="justify-center gap-8"
              isPaused={pausedReady}
              onPauseToggle={() => setPausedReady((p) => !p)}
              onRestart={() => {}}
            />
          </View>
        </PropRow>

        <PropRow
          label="sessionReady={false} — skip-next icon"
          note="Pre-session / between phases: tapping advances to the next step."
        >
          <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
            <PlaybackControls
              className="justify-center gap-8"
              isPaused={true}
              onPauseToggle={() => setSessionReady((s) => !s)}
              onRestart={() => setSessionReady((s) => !s)}
              sessionReady={sessionReady}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="States">
        <PropRow
          label="paused (gradient center shows play-arrow)"
          note="Idle state — user taps to begin / resume."
        >
          <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
            <PlaybackControls
              className="justify-center gap-8"
              isPaused={true}
              onPauseToggle={() => {}}
              isMuted={false}
              onMuteToggle={() => {}}
              onRestart={() => {}}
            />
          </View>
        </PropRow>

        <PropRow
          label="playing (gradient center shows pause)"
          note="Mid-session — user taps to pause."
        >
          <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
            <PlaybackControls
              className="justify-center gap-8"
              isPaused={false}
              onPauseToggle={() => {}}
              isMuted={false}
              onMuteToggle={() => {}}
              onRestart={() => {}}
            />
          </View>
        </PropRow>

        <PropRow
          label="muted (left button shows volume-off)"
          note="The mute button toggles its icon to volume-off when muted."
        >
          <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
            <PlaybackControls
              className="justify-center gap-8"
              isPaused={false}
              onPauseToggle={() => {}}
              isMuted={true}
              onMuteToggle={() => {}}
              onRestart={() => {}}
            />
          </View>
        </PropRow>

        <PropRow
          label="disabled"
          note="All three buttons reject taps + the row renders at 40% opacity. Use while the session is loading / not yet ready."
        >
          <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
            <PlaybackControls
              className="justify-center gap-8"
              isPaused={false}
              onPauseToggle={() => {}}
              isMuted={false}
              onMuteToggle={() => {}}
              onRestart={() => {}}
              disabled
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow
          label="In-body session controls (sm + gap-8 centered)"
          note="Star / Lazy8 / Kundalini-style session screens — controls sit below the breathing visualization."
        >
          <View className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] py-6">
            <View className="mb-6 items-center">
              <Text size="xs" treatment="caption" tone="tertiary">
                [Breathing visualization above]
              </Text>
            </View>
            <PlaybackControls
              className="justify-center gap-8"
              isPaused={paused4}
              onPauseToggle={() => setPaused4((p) => !p)}
              isMuted={muted4}
              onMuteToggle={() => setMuted4((m) => !m)}
              onRestart={() => {}}
            />
          </View>
        </PropRow>

        <PropRow
          label="Bottom-anchored hero controls (md + justify-between px-12)"
          note="DoubleInhale-style — full-screen visualization with the controls spread across the bottom edge."
        >
          <View
            className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03]"
            style={{ height: 200 }}
          >
            <View className="flex-1 items-center justify-center">
              <Text size="xs" treatment="caption" tone="tertiary">
                [Full-screen visualization]
              </Text>
            </View>
            <PlaybackControls
              size="md"
              className="z-20 justify-between px-12 pb-6"
              isPaused={paused4}
              onPauseToggle={() => setPaused4((p) => !p)}
              isMuted={muted4}
              onMuteToggle={() => setMuted4((m) => !m)}
              onRestart={() => {}}
            />
          </View>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using PlaybackControls for full audio playback with a scrubber"
          good="That's AudioPlayer's hero variant — it composes artwork + scrubber + skip + voice toggle. PlaybackControls is for sessions with their own visualization that just need the bottom controls."
        />

        <DontRow
          bad="Adding a fourth button (volume slider, speed, etc.)"
          good="The three-slot model is intentional — back/play/forward with optional mute on the side. For richer audio UX use AudioPlayer hero with its skip controls + voice toggle."
        />

        <DontRow
          bad="Mixing size='sm' and size='md' in the same flow"
          good="Pick one per session type so the controls feel like one system. sm for breathing sessions, md for meditation-style heroes."
        />

        <DontRow
          bad="Baking layout into the primitive instead of className"
          good="Layout (gap, padding, alignment) lives in className so the primitive can serve both `justify-center gap-8` (in-body) and `justify-between px-12` (bottom-anchored) without forking."
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
