import wavesArtworkImg from '@/assets/images/express-yourself/waves-artwork.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Accordion } from '@/components/ui/Accordion';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';
import { toast } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image } from 'react-native';
import { useDownloadSong } from '../hooks/useDownloadSong';
import { usePlaybackUrl } from '../hooks/usePlaybackUrl';
import { useShareSong } from '../hooks/useShareSong';
import { useSong } from '../hooks/useSong';
import { useUpsertSong } from '../hooks/useUpsertSong';

const FALLBACK_ARTWORK_URI = Image.resolveAssetSource(wavesArtworkImg).uri;

export default function ExpressYourselfReady() {
  const router = useRouter();
  const scheme = useScheme();
  const { id, celebrate } = useLocalSearchParams<{
    id: string;
    celebrate?: string;
  }>();
  const isFreshFromGeneration = celebrate === '1';
  const { data: song } = useSong(id);
  const { data: playback } = usePlaybackUrl(id);
  const upsertMutation = useUpsertSong();
  const downloadMutation = useDownloadSong();
  const shareMutation = useShareSong();

  const handleShare = () => {
    if (!id) return;
    shareMutation.mutate(
      {
        id,
        title: song?.title ?? null,
      },
      {
        onError: (err) =>
          void dialog.error({
            title: 'Share failed',
            message:
              err instanceof Error
                ? err.message
                : 'Could not share. Try again in a moment.',
          }),
      },
    );
  };

  const handleDownload = () => {
    if (!id) return;
    downloadMutation.mutate(
      { id, title: song?.title ?? null },
      {
        onError: (err) =>
          void dialog.error({
            title: 'Download failed',
            message:
              err instanceof Error
                ? err.message
                : 'Could not save the song. Try again in a moment.',
          }),
      },
    );
  };

  const source = useMemo(
    () => (playback?.url ? { uri: playback.url } : null),
    [playback?.url],
  );

  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(status.playing);
  }, [status.playing]);

  useEffect(() => {
    if (!status.playing) return;
    const tag = 'express-yourself-playback';
    void activateKeepAwakeAsync(tag);
    return () => {
      void deactivateKeepAwake(tag);
    };
  }, [status.playing]);

  const togglePlay = useCallback(() => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player, status.playing]);

  const handleSeek = useCallback(
    (seconds: number) => {
      player.seekTo(seconds);
    },
    [player],
  );

  const duration = song?.durationSeconds ?? status.duration ?? 0;
  const progress =
    duration > 0 ? Math.min(1, status.currentTime / duration) : 0;

  const toggleFavorite = () => {
    if (!song || !id) return;
    const next = song.isFavorite ? 0 : 1;
    upsertMutation.mutate({ id, isFavorite: next === 1 });
    toast.success(next ? 'Saved to favorites' : 'Removed from favorites');
  };

  return (
    <Screen
      variant="default"
      scroll
      fade={isFreshFromGeneration}
      header={<Header variant="back" title="Your Song" />}
      sticky={
        isFreshFromGeneration ? (
          <Button
            variant="secondary"
            onPress={() =>
              router.replace('/practices/express-yourself/compose')
            }
            prefixIcon={
              <MaterialIcons
                name="edit-note"
                size={18}
                color={foregroundFor(scheme, 1)}
              />
            }
            fullWidth
          >
            Compose Another Message
          </Button>
        ) : undefined
      }
      contentClassName="gap-6 pb-6"
    >
      {isFreshFromGeneration ? (
        <>
          <View>
            <Text size="h1" weight="bold" align="center">
              Your
            </Text>
            <GradientText className="text-center text-[32px] font-bold leading-tight">
              Song is Ready
            </GradientText>
          </View>
          <Text size="sm" tone="secondary" align="center">
            A unique gift of sound, inspired by your message.
          </Text>
        </>
      ) : null}

      <AudioPlayer
        variant="hero"
        title={song?.title ?? 'Untitled'}
        subtitle={
          song?.compositionNumber
            ? `Composition No. ${song.compositionNumber}`
            : undefined
        }
        artworkUri={playback?.artworkUrl ?? FALLBACK_ARTWORK_URI}
        progress={progress}
        duration={duration}
        playing={isPlaying}
        loading={!source}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onSkipBack={() => player.seekTo(Math.max(0, status.currentTime - 10))}
        onSkipForward={() =>
          player.seekTo(Math.min(duration, status.currentTime + 30))
        }
        tone="pink"
      />

      <View className="flex-row items-start justify-center gap-10 pt-2">
        <View className="items-center gap-2">
          <IconChip
            size="lg"
            shape="circle"
            onPress={handleShare}
            disabled={shareMutation.isPending}
            accessibilityLabel="Share"
          >
            {(c) =>
              shareMutation.isPending ? (
                <ActivityIndicator size="small" color={c} />
              ) : (
                <MaterialIcons name="ios-share" size={22} color={c} />
              )
            }
          </IconChip>
          <Text size="xs" tone="secondary">
            {shareMutation.isPending ? 'Sharing…' : 'Share'}
          </Text>
        </View>
        <View className="items-center gap-2">
          <IconChip
            size="lg"
            shape="circle"
            tone={song?.isFavorite ? 'pink' : undefined}
            onPress={toggleFavorite}
            accessibilityLabel={song?.isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            {(c) => (
              <MaterialIcons
                name={song?.isFavorite ? 'favorite' : 'favorite-border'}
                size={22}
                color={c}
              />
            )}
          </IconChip>
          <Text size="xs" tone={song?.isFavorite ? 'accent' : 'secondary'}>
            {song?.isFavorite ? 'Favorited' : 'Favorite'}
          </Text>
        </View>
        <View className="items-center gap-2">
          <IconChip
            size="lg"
            shape="circle"
            onPress={handleDownload}
            disabled={downloadMutation.isPending}
            accessibilityLabel="Download"
          >
            {(c) =>
              downloadMutation.isPending ? (
                <ActivityIndicator size="small" color={c} />
              ) : (
                <MaterialIcons name="file-download" size={22} color={c} />
              )
            }
          </IconChip>
          <Text size="xs" tone="secondary">
            {downloadMutation.isPending ? 'Saving…' : 'Download'}
          </Text>
        </View>
      </View>

      {song?.prompt ? (
        <Accordion
          variant="flat"
          title="Your message"
          defaultExpanded={isFreshFromGeneration}
          icon={
            <MaterialIcons
              name="format-quote"
              size={18}
              color={foregroundFor(scheme, 0.6)}
            />
          }
        >
          <Text size="sm" tone="body" italic>
            {song.prompt}
          </Text>
        </Accordion>
      ) : null}
    </Screen>
  );
}
