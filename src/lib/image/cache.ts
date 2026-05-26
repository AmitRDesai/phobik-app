/**
 * Thin facade — backed by the unified `lib/media/cache.ts`.
 *
 * Per-track artwork is paired with audio assets, so the manifest entry
 * carries both fields. We return null when the entry has no image fields.
 */

import {
  clearMediaCache,
  getCachedMediaPath,
  getMediaCacheSizeBytes,
  prepareMedia,
  type MediaRef,
} from '../media/cache';
import type { AudioManifestEntry } from '../audio/manifest';

function imageRefFromEntry(entry: AudioManifestEntry): MediaRef | null {
  if (
    !entry.imageSha256 ||
    entry.imageSize == null ||
    !entry.imageContentType
  ) {
    return null;
  }
  return {
    sha256: entry.imageSha256,
    size: entry.imageSize,
    contentType: entry.imageContentType,
    fetchPath: `/api/audio/image/${encodeURIComponent(entry.key)}`,
  };
}

export function getCachedImagePath(entry: AudioManifestEntry): string | null {
  const ref = imageRefFromEntry(entry);
  return ref ? getCachedMediaPath(ref) : null;
}

export async function prepareImage(
  entry: AudioManifestEntry,
  signal?: AbortSignal,
): Promise<string | null> {
  const ref = imageRefFromEntry(entry);
  if (!ref) return null;
  return prepareMedia(ref, undefined, signal);
}

/** Whole-cache size — counts audio AND images together (unified cap). */
export function getImageCacheSizeBytes(): number {
  return getMediaCacheSizeBytes();
}

export function clearImageCache(): void {
  clearMediaCache();
}
