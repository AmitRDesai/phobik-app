import {
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioPlayerOptions,
} from 'expo-audio';
import { useEffect, useRef } from 'react';
import { useAudioSource } from './useAudioSource';
import { useAudioStatusDialog } from './useAudioStatusDialog';

type StreamedOptions = {
  /** 0..1 volume. Defaults to 1. */
  volume?: number;
  /** Forwarded to `useAudioPlayer`. */
  player?: AudioPlayerOptions;
};

/**
 * Wraps `expo-audio`'s `useAudioPlayer` with backend-driven source resolution
 * and on-device caching. The underlying player is created once with no
 * source; once the asset is downloaded (or already cached), `player.replace()`
 * is called automatically. Volume is set declaratively via `options.volume`.
 *
 * `isReady` becomes true the first time the player has audio loaded.
 */
export function useStreamedAudioPlayer(
  key: string | null,
  options: StreamedOptions = {},
) {
  const { volume = 1, player: playerOptions } = options;
  const {
    source,
    isDownloading,
    progress,
    isOffline,
    error,
    errorMessage,
    retry,
  } = useAudioSource(key);
  const player = useAudioPlayer(null, playerOptions);
  const status = useAudioPlayerStatus(player);

  // Surface offline / network-error state via the shared dialog.
  useAudioStatusDialog({
    isReady: !!source,
    isOffline,
    errorMessage,
    onRetry: retry,
  });

  const lastSourceRef = useRef<string | null>(null);
  useEffect(() => {
    if (source && source !== lastSourceRef.current) {
      player.replace(source);
      lastSourceRef.current = source;
    }
  }, [source, player]);

  useEffect(() => {
    player.volume = volume;
  }, [player, volume]);

  return {
    player,
    status,
    isReady: !!source,
    isDownloading,
    progress,
    isOffline,
    error,
    errorMessage,
    retry,
  };
}
