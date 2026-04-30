import {
  useAudioPlayer,
  type AudioPlayer,
  type AudioPlayerOptions,
  type AudioSource,
} from 'expo-audio';
import { useEffect } from 'react';

type ManagedOptions = {
  /** 0..1 volume. Defaults to 1. */
  volume?: number;
  /** When true, the player is paused. */
  paused?: boolean;
  /** Forwarded to `useAudioPlayer`. */
  player?: AudioPlayerOptions;
};

/**
 * Wraps `expo-audio`'s `useAudioPlayer` so volume + pause are passed
 * declaratively. The player object expo-audio returns is mutable by design;
 * encapsulating those mutations here keeps screens free of `player.volume = X`
 * and similar imperative side effects.
 */
export function useManagedAudioPlayer(
  source: AudioSource,
  { volume = 1, paused, player: playerOptions }: ManagedOptions = {},
): AudioPlayer {
  const player = useAudioPlayer(source, playerOptions);

  useEffect(() => {
    player.volume = volume;
  }, [player, volume]);

  useEffect(() => {
    if (paused) player.pause();
  }, [player, paused]);

  return player;
}
