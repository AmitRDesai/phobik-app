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
  /** Loop the clip indefinitely. Defaults to false. */
  loop?: boolean;
  /** Forwarded to `useAudioPlayer`. */
  player?: AudioPlayerOptions;
  /**
   * Suppress this player's offline / error dialog. Set when the screen
   * pre-caches all clips via `useAudioPrefetch` (which owns the single global
   * dialog) — after prefetch the source resolves instantly from cache, so this
   * per-step dialog is redundant and would otherwise clobber the prefetch one.
   */
  suppressDialog?: boolean;
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
  const {
    volume = 1,
    loop = false,
    player: playerOptions,
    suppressDialog = false,
  } = options;
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

  // Surface offline / network-error state via the shared dialog. When
  // `suppressDialog` is set, the dialog is disabled so the prefetch hook
  // remains the sole dialog owner.
  useAudioStatusDialog({
    enabled: !suppressDialog,
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

  useEffect(() => {
    player.loop = loop;
  }, [player, loop]);

  return {
    player,
    status,
    /** Resolved local `file://` URI of the current clip, or `null`. Changes
     *  after `player.replace()` runs, so screens can key playback off it. */
    source,
    isReady: !!source,
    isDownloading,
    progress,
    isOffline,
    error,
    errorMessage,
    retry,
  };
}
