import type { AudioPlayer } from 'expo-audio';

/**
 * Replays a short cue from the top, reliably.
 *
 * `expo-audio` does not auto-reset a finished clip — it stays paused at its end
 * position — and `player.seekTo()` is asynchronous. So the documented
 * `seekTo(0); play()` sequence can fire `play()` while the player is still
 * parked at the end, producing a silent no-op (intermittently, depending on how
 * the async seek races the sync play). Awaiting the seek before playing makes
 * the restart deterministic.
 *
 * Returns a cancel function — call it from an effect cleanup so a pending
 * `play()` is suppressed if the session pauses or the phase changes while the
 * seek is still in flight.
 */
export function replayCue(player: AudioPlayer): () => void {
  let cancelled = false;
  player
    .seekTo(0)
    .then(() => {
      if (!cancelled) player.play();
    })
    .catch(() => {
      // Ignore seek failures (e.g. the player was released mid-seek).
    });
  return () => {
    cancelled = true;
  };
}
