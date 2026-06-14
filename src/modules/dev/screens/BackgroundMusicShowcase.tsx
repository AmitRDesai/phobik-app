import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Slider } from '@/components/ui/Slider';
import { backgroundMusicVolumeAtom, voiceVolumeAtom } from '@/lib/audio/music';
import { useMixedAudioPlayer } from '@/lib/audio/useMixedAudioPlayer';
import { useAtom } from 'jotai';
import { ShowcaseHeader } from '../components/ShowcaseHeader';

const VOICE_KEY = 'sample-audio';
const BED_KEY = 'sample-bed';

export default function BackgroundMusicShowcase() {
  const [voiceVolume, setVoiceVolume] = useAtom(voiceVolumeAtom);
  const [bedVolume, setBedVolume] = useAtom(backgroundMusicVolumeAtom);
  const { voice, bed } = useMixedAudioPlayer(VOICE_KEY, BED_KEY);

  const playing = voice.status.playing;
  const togglePlay = () => {
    if (playing) voice.player.pause();
    else voice.player.play();
  };

  return (
    <Screen
      scroll
      header={<ShowcaseHeader title="Background Music (POC)" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          A narrated track (`{VOICE_KEY}`) and a separate looping bed (`
          {BED_KEY}
          `) are streamed as two ordinary `audio_asset` keys and mixed on-device
          by `useMixedAudioPlayer`. The voice is the transport lead; the bed
          loops underneath at a user-controlled volume and mirrors play/pause
          automatically.
        </Text>
        <Text size="xs" tone="disabled">
          Requires a dev build + the two sample assets synced to S3 (`bun run
          scripts/sync-audio.ts`). On first play each track downloads, then
          plays from the on-device cache.
        </Text>
      </Section>

      <Section title="Transport">
        <Button
          onPress={togglePlay}
          variant={playing ? 'secondary' : 'primary'}
          disabled={!voice.isReady}
        >
          {voice.isReady ? (playing ? 'Pause' : 'Play') : 'Loading…'}
        </Button>

        <StatusRow label="Voice" track={voice} />
        <StatusRow label="Bed" track={bed} />
      </Section>

      <Section title="Volume — independent per track">
        <Text size="xs" tone="tertiary">
          Two on-device atoms balance the mix. Drag either while playing — the
          track reacts live.
        </Text>

        <VolumeRow
          label="Voice"
          atom="voiceVolumeAtom"
          value={voiceVolume}
          onChange={setVoiceVolume}
        />
        <VolumeRow
          label="Background music"
          atom="backgroundMusicVolumeAtom"
          value={bedVolume}
          onChange={setBedVolume}
        />
      </Section>
    </Screen>
  );
}

function VolumeRow({
  label,
  atom,
  value,
  onChange,
}: {
  label: string;
  atom: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row justify-between">
        <Text size="xs" tone="secondary">
          {label}
        </Text>
        <Text size="xs" tone="tertiary" className="font-mono">
          {Math.round(value * 100)}%
        </Text>
      </View>
      <Slider
        value={value}
        min={0}
        max={1}
        step={0.05}
        onValueChange={onChange}
      />
      <Text size="xs" tone="disabled" className="font-mono">
        {atom}
      </Text>
    </View>
  );
}

function StatusRow({
  label,
  track,
}: {
  label: string;
  track: ReturnType<typeof useMixedAudioPlayer>['voice'];
}) {
  const state = track.isDownloading
    ? `downloading${track.progress != null ? ` ${Math.round(track.progress * 100)}%` : '…'}`
    : track.isReady
      ? track.status.playing
        ? 'playing'
        : 'ready'
      : track.isOffline
        ? 'offline'
        : (track.errorMessage ?? 'idle');

  return (
    <View className="flex-row justify-between">
      <Text size="xs" tone="tertiary" className="font-mono">
        {label}
      </Text>
      <Text size="xs" tone="secondary" className="font-mono">
        {state}
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
      <Card variant="raised" size="lg" className="gap-4">
        {children}
      </Card>
    </View>
  );
}
