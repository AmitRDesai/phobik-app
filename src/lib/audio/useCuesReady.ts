import type { AudioPlayer } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 150;

/**
 * Returns `true` once every given (local, bundled) audio player has finished
 * loading. `expo-audio` starts loading a `useAudioPlayer(source)` immediately,
 * but a `play()` issued before the asset has decoded is a silent no-op.
 *
 * This polls each player's `isLoaded` flag briefly on mount and stops the
 * moment they're all ready — so, unlike calling `useAudioPlayerStatus` per
 * player, it adds no ongoing status subscriptions / re-renders during playback
 * on these already-busy session screens.
 *
 * The player set is captured once on mount and must be stable for the hook's
 * lifetime — true for the bundled-cue players these screens create (their
 * sources are constant `require()`d assets, so the instances never change).
 *
 * Use to gate the first cue of a breathing session so the opening inhale isn't
 * skipped because its bundled clip hadn't loaded yet.
 */
export function useCuesReady(players: AudioPlayer[]): boolean {
  // Captured once — the bundled-cue instances are stable for the screen's
  // lifetime, so there's no need to re-sync them on every render.
  const playersRef = useRef(players);

  // Initialize synchronously so that if all players are already loaded on
  // mount (e.g. during fast-refresh or hot reload) we never flash ready=false.
  const [ready, setReady] = useState(() =>
    playersRef.current.every((p) => p.isLoaded),
  );

  useEffect(() => {
    const allLoaded = () => playersRef.current.every((p) => p.isLoaded);
    if (allLoaded()) {
      setReady(true);
      return;
    }
    const id = setInterval(() => {
      if (allLoaded()) {
        setReady(true);
        clearInterval(id);
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return ready;
}
