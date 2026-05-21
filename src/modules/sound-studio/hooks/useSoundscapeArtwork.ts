import { findManifestEntry, useAudioManifest } from '@/lib/audio/manifest';
import { getCachedImagePath, prepareImage } from '@/lib/image/cache';
import { useEffect, useState } from 'react';

import { MOOD_BY_ID, type SoundscapeMood } from '../data/sound-studio';

export type SoundscapeArtworkSource = number | { uri: string };

/**
 * Resolves artwork for a curated soundscape track. Returns the bundled
 * mood-level image immediately, then upgrades to the cached/remote
 * per-track image once the manifest is fetched and the file is on disk.
 *
 * Cache hits resolve synchronously on the first render so there's no
 * flicker from fallback → remote.
 */
export function useSoundscapeArtwork(
  audioAssetKey: string | null | undefined,
  mood: SoundscapeMood | null | undefined,
): SoundscapeArtworkSource | undefined {
  const { data: manifest } = useAudioManifest();
  const entry = audioAssetKey
    ? findManifestEntry(manifest, audioAssetKey)
    : undefined;
  const fallback = mood ? MOOD_BY_ID[mood].fallbackImage : undefined;

  const initialUri = entry?.imageSha256 ? getCachedImagePath(entry) : null;
  const [uri, setUri] = useState<string | null>(initialUri);

  useEffect(() => {
    if (!entry?.imageSha256) {
      setUri(null);
      return;
    }
    const synced = getCachedImagePath(entry);
    if (synced) {
      setUri(synced);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    prepareImage(entry, controller.signal)
      .then((next) => {
        if (cancelled || !next) return;
        setUri(next);
      })
      .catch(() => {
        // Swallow — UI keeps showing the mood fallback if download fails.
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [entry?.key, entry?.imageSha256]);

  return uri ? { uri } : fallback;
}
