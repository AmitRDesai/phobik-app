import { setAudioModeAsync } from 'expo-audio';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { backgroundMusicVolumeAtom, voiceVolumeAtom } from './music';
import { useStreamedAudioPlayer } from './useStreamedAudioPlayer';

/**
 * Plays a narrated track with an optional looping background-music bed mixed
 * underneath. Both tracks are ordinary `audio_asset` keys resolved through the
 * normal manifest/cache pipeline (no special backend support) — the only new
 * idea is mixing two `useStreamedAudioPlayer`s on-device.
 *
 * The **voice track is the transport lead**: the caller drives playback via
 * `voice.player.play()/pause()`, and the bed mirrors that state automatically.
 * The bed loops indefinitely and plays at the user's on-device bed volume
 * ({@link backgroundMusicVolumeAtom}); pass `bedKey = null` for no bed.
 *
 * Returns the two underlying `useStreamedAudioPlayer` results so the screen can
 * read voice `status`/`isReady`/`progress` for its scrubber + loading UI.
 */
export function useMixedAudioPlayer(
  voiceKey: string | null,
  bedKey: string | null,
) {
  const voiceVolume = useAtomValue(voiceVolumeAtom);
  const bedVolume = useAtomValue(backgroundMusicVolumeAtom);

  const voice = useStreamedAudioPlayer(voiceKey, { volume: voiceVolume });
  // The bed loops under the (finite) narration. The voice track owns the
  // offline/error dialog; suppress the bed's so the two don't clobber.
  const bed = useStreamedAudioPlayer(bedKey, {
    volume: bedVolume,
    loop: true,
    suppressDialog: true,
  });

  // Configure the audio session so the two players mix instead of interrupting
  // each other (and keep sounding through the iOS silent switch). Idempotent —
  // safe to re-run whenever this hook mounts.
  useEffect(() => {
    void setAudioModeAsync({
      interruptionMode: 'mixWithOthers',
      playsInSilentMode: true,
    });
  }, []);

  // Mirror the voice transport onto the bed: the bed plays while the narration
  // plays and pauses when it pauses / completes. Gated on the bed being loaded
  // so we don't call play() before its source is ready.
  const voicePlaying = voice.status.playing;
  const bedReady = bed.isReady;
  const bedPlayer = bed.player;
  useEffect(() => {
    if (!bedReady) return;
    if (voicePlaying) bedPlayer.play();
    else bedPlayer.pause();
  }, [voicePlaying, bedReady, bedPlayer]);

  return { voice, bed, voiceVolume, bedVolume };
}
