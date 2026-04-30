import {
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioPlayerOptions,
} from 'expo-audio';
import { useEffect, useRef } from 'react';
import { useAudioSource } from './useAudioSource';

/**
 * Wraps `expo-audio`'s `useAudioPlayer` with backend-driven source resolution
 * and on-device caching. The underlying player is created once with no
 * source; once the asset is downloaded (or already cached), `player.replace()`
 * is called automatically.
 *
 * `isReady` becomes true the first time the player has audio loaded.
 */
export function useStreamedAudioPlayer(
  key: string | null,
  options?: AudioPlayerOptions,
) {
  const { source, isDownloading, progress, error } = useAudioSource(key);
  const player = useAudioPlayer(null, options);
  const status = useAudioPlayerStatus(player);

  const lastSourceRef = useRef<string | null>(null);
  useEffect(() => {
    if (source && source !== lastSourceRef.current) {
      player.replace(source);
      lastSourceRef.current = source;
    }
  }, [source, player]);

  return {
    player,
    status,
    isReady: !!source,
    isDownloading,
    progress,
    error,
  };
}
