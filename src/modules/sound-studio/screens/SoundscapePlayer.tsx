import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { useKeepAwake } from 'expo-keep-awake';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';

import { BAND_BY_ID, MOOD_BY_ID } from '../data/sound-studio';
import { useSoundscapePlayback } from '../hooks/useSoundscapePlayback';
import { useSoundscapeArtwork } from '../hooks/useSoundscapeArtwork';

export default function SoundscapePlayer() {
  const params = useLocalSearchParams<{ slug: string; autoplay?: string }>();
  const slug = params.slug ?? null;
  const autoplay = params.autoplay === '1';

  if (!slug) {
    return <Redirect href="/sound-studio/curated" />;
  }

  return <SoundscapePlayerInner slug={slug} autoplay={autoplay} />;
}

function SoundscapePlayerInner({
  slug,
  autoplay,
}: {
  slug: string;
  autoplay: boolean;
}) {
  useKeepAwake();
  const { soundscape, isLoadingDetail, detailError, audio } =
    useSoundscapePlayback(slug);
  const { player, status, isReady, isDownloading, progress } = audio;
  const artwork = useSoundscapeArtwork(
    soundscape?.audioAssetKey,
    soundscape?.mood,
  );

  const hasAutoPlayedRef = useRef(false);
  useEffect(() => {
    if (!autoplay) return;
    if (!isReady) return;
    if (hasAutoPlayedRef.current) return;
    hasAutoPlayedRef.current = true;
    player.play();
  }, [autoplay, isReady, player]);

  const onTogglePlay = () => {
    if (!isReady) return;
    if (status.playing) player.pause();
    else player.play();
  };

  const onSeek = (seconds: number) => {
    if (!isReady || status.duration <= 0) return;
    player.seekTo(Math.max(0, Math.min(status.duration, seconds)));
  };

  const onSkipBack = () => {
    if (!isReady) return;
    player.seekTo(Math.max(0, status.currentTime - 15));
  };

  const onSkipForward = () => {
    if (!isReady || status.duration <= 0) return;
    player.seekTo(Math.min(status.duration, status.currentTime + 30));
  };

  if (isLoadingDetail || !soundscape) {
    return (
      <Screen header={<Header variant="back" title="Soundscape" />} scroll>
        {detailError ? (
          <Card variant="toned" tone="pink" size="md">
            <Text size="sm" weight="semibold">
              Couldn’t load this soundscape
            </Text>
            <Text size="sm" tone="secondary" className="mt-1">
              {detailError.message}
            </Text>
          </Card>
        ) : (
          <View className="gap-4">
            <Skeleton height={320} radius={28} />
            <Skeleton height={28} width="60%" />
            <Skeleton height={20} width="80%" />
          </View>
        )}
      </Screen>
    );
  }

  const band = BAND_BY_ID[soundscape.band];
  const mood = MOOD_BY_ID[soundscape.mood];

  const progressRatio =
    isReady && status.duration > 0 ? status.currentTime / status.duration : 0;
  const loadingPercent =
    isDownloading && progress != null
      ? `${Math.round(progress * 100)}%`
      : undefined;

  return (
    <Screen
      header={<Header variant="back" title="Soundscape" />}
      scroll
      contentClassName="gap-6 pb-12"
    >
      <AudioPlayer
        variant="hero"
        title={soundscape.title}
        subtitle={`${band.label} · ${band.hzRange} · ${mood.label}`}
        artwork={artwork}
        progress={progressRatio}
        duration={isReady ? status.duration : 0}
        playing={!!status.playing}
        loading={isDownloading || !isReady}
        loadingLabel={loadingPercent}
        onTogglePlay={onTogglePlay}
        onSeek={onSeek}
        onSkipBack={onSkipBack}
        backSeconds={15}
        onSkipForward={onSkipForward}
        forwardSeconds={30}
        tone="pink"
      />

      {soundscape.description ? (
        <View>
          {soundscape.eyebrow ? (
            <Text size="xs" treatment="caption" tone="secondary">
              {soundscape.eyebrow}
            </Text>
          ) : null}
          <Text size="md" tone="body" className="mt-2 leading-relaxed">
            {soundscape.description}
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}
