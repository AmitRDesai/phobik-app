/**
 * Thin facade — backed by the unified `lib/media/cache.ts`.
 *
 * Kept so existing consumers (`useAudioSource`, settings AudioStorage screen)
 * can import the same names without changes.
 */

import {
  clearMediaCache,
  getCachedMediaPath,
  getMediaCacheSizeBytes,
  isMediaCached,
  prepareMedia,
  type DownloadProgress,
  type MediaRef,
} from '../media/cache';
import type { AudioManifestEntry } from './manifest';

export type { DownloadProgress };

function audioRef(entry: AudioManifestEntry): MediaRef {
  return {
    sha256: entry.sha256,
    size: entry.size,
    contentType: entry.contentType,
    fetchPath: `/api/audio/file/${encodeURIComponent(entry.key)}`,
  };
}

export function isAudioCached(entry: AudioManifestEntry): boolean {
  return isMediaCached(audioRef(entry));
}

export function getCachedAudioPath(entry: AudioManifestEntry): string | null {
  return getCachedMediaPath(audioRef(entry));
}

export function prepareAudio(
  entry: AudioManifestEntry,
  onProgress?: (progress: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<string> {
  return prepareMedia(audioRef(entry), onProgress, signal);
}

/** Whole-cache size — counts audio AND images together (unified cap). */
export function getCacheSizeBytes(): number {
  return getMediaCacheSizeBytes();
}

export function clearAudioCache(): void {
  clearMediaCache();
}
