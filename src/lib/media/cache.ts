/**
 * Unified on-disk media cache for audio + image assets.
 *
 * - Single directory under `Paths.document/media`.
 * - File naming is `<sha256>.<ext>` so content changes naturally produce
 *   a cache miss (new sha256 → different filename → fresh download).
 * - Shared LRU eviction at `MAX_CACHE_BYTES` total. Audio and image entries
 *   compete for the same cap.
 * - `pruneOrphans()` removes any cached file whose sha256 isn't referenced
 *   by the current manifest. Hook into manifest refresh so dropped /
 *   replaced content gets evicted automatically.
 *
 * Both `audio/cache.ts` and `image/cache.ts` are thin facades on top of
 * this module — callers can keep their existing imports.
 */

import { Directory, File, Paths } from 'expo-file-system';
import { audioFetch } from '../audio/manifest';

const CACHE_DIR_NAME = 'media';
const MAX_CACHE_BYTES = 250 * 1024 * 1024; // 250 MB (audio + image combined)
const ACCESS_INDEX_NAME = '.access-index.json';

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  // audio
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/ogg': 'ogg',
  // image
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function extForMediaContentType(contentType: string): string {
  return EXT_BY_CONTENT_TYPE[contentType] ?? 'bin';
}

export interface MediaRef {
  /** sha256 of the file content — the cache key. */
  sha256: string;
  /** Expected size in bytes; mismatch = partial / corrupted file. */
  size: number;
  /** MIME — determines the cached file extension. */
  contentType: string;
  /**
   * Path to GET on the backend for download.
   *   Audio: `/api/audio/file/<key>`
   *   Image: `/api/audio/image/<key>`
   */
  fetchPath: string;
}

export type DownloadProgress = {
  receivedBytes: number;
  totalBytes: number;
  ratio: number;
};

function mediaDir(): Directory {
  return new Directory(Paths.document, CACHE_DIR_NAME);
}

function ensureDir(): Directory {
  const dir = mediaDir();
  if (!dir.exists) dir.create();
  return dir;
}

function fileNameFor(ref: MediaRef): string {
  return `${ref.sha256}.${extForMediaContentType(ref.contentType)}`;
}

function fileFor(ref: MediaRef): File {
  return new File(mediaDir(), fileNameFor(ref));
}

/** Sha256 from a cached filename `<sha256>.<ext>`. Null for malformed names. */
function sha256FromFilename(name: string): string | null {
  const dot = name.indexOf('.');
  if (dot <= 0) return null;
  const sha = name.slice(0, dot);
  // sha256 is 64 hex chars
  if (sha.length !== 64) return null;
  return sha;
}

/* ───────────── Read paths (sync) ───────────── */

/** Synchronously check if a ref is present + the right size on disk. */
export function isMediaCached(ref: MediaRef): boolean {
  const file = fileFor(ref);
  return file.exists && file.size === ref.size;
}

/** Returns local `file://` URI if cached and the right size; `null` otherwise. */
export function getCachedMediaPath(ref: MediaRef): string | null {
  const file = fileFor(ref);
  if (file.exists && file.size === ref.size) {
    recordAccess(file.name);
    return file.uri;
  }
  return null;
}

/* ───────────── Download + cache ───────────── */

/**
 * Download the file if missing or size-mismatched, write to cache, return
 * the local URI. Streams progress chunks if the runtime supports it.
 */
export async function prepareMedia(
  ref: MediaRef,
  onProgress?: (p: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<string> {
  ensureDir();
  const file = fileFor(ref);

  if (file.exists && file.size === ref.size) {
    recordAccess(file.name);
    return file.uri;
  }
  if (file.exists) file.delete();

  const response = await audioFetch(ref.fetchPath, { signal });
  const reader = response.body?.getReader();
  let bytes: Uint8Array;

  if (!reader) {
    bytes = new Uint8Array(await response.arrayBuffer());
    onProgress?.({
      receivedBytes: bytes.byteLength,
      totalBytes: ref.size,
      ratio: 1,
    });
  } else {
    const chunks: Uint8Array[] = [];
    let received = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.byteLength;
        onProgress?.({
          receivedBytes: received,
          totalBytes: ref.size,
          ratio: ref.size > 0 ? received / ref.size : 0,
        });
      }
    }
    bytes = concatChunks(chunks, received);
  }

  file.create();
  file.write(bytes);
  recordAccess(file.name);
  enforceCacheCap();
  return file.uri;
}

function concatChunks(chunks: Uint8Array[], total: number): Uint8Array {
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

/* ───────────── Change-detection / pruning ───────────── */

/**
 * Remove every cached file whose sha256 is NOT in `validSha256s`.
 *
 * Call this after every successful manifest refresh — when content on the
 * backend is replaced (new sha256), the stale local file becomes orphaned
 * and gets evicted here so disk doesn't grow forever.
 *
 * Returns the number of files removed.
 */
export function pruneOrphans(validSha256s: Iterable<string>): number {
  const dir = mediaDir();
  if (!dir.exists) return 0;
  const valid = new Set(validSha256s);
  const access = readAccessIndex();
  let removed = 0;
  for (const entry of dir.list()) {
    if (!(entry instanceof File)) continue;
    if (entry.name === ACCESS_INDEX_NAME) continue;
    const sha = sha256FromFilename(entry.name);
    if (!sha || !valid.has(sha)) {
      entry.delete();
      delete access[entry.name];
      removed++;
    }
  }
  if (removed > 0) writeAccessIndex(access);
  return removed;
}

/* ───────────── Maintenance ───────────── */

export function clearMediaCache(): void {
  const dir = mediaDir();
  if (dir.exists) dir.delete();
}

export function getMediaCacheSizeBytes(): number {
  const dir = mediaDir();
  if (!dir.exists) return 0;
  let total = 0;
  for (const entry of dir.list()) {
    if (entry instanceof File && entry.name !== ACCESS_INDEX_NAME) {
      total += entry.size ?? 0;
    }
  }
  return total;
}

/* ───────────── LRU access tracking ───────────── */

type AccessIndex = Record<string, number>;

function readAccessIndex(): AccessIndex {
  const file = new File(mediaDir(), ACCESS_INDEX_NAME);
  if (!file.exists) return {};
  try {
    return JSON.parse(file.textSync()) as AccessIndex;
  } catch {
    return {};
  }
}

function writeAccessIndex(index: AccessIndex): void {
  const file = new File(mediaDir(), ACCESS_INDEX_NAME);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(index));
}

function recordAccess(fileName: string): void {
  const index = readAccessIndex();
  index[fileName] = Date.now();
  writeAccessIndex(index);
}

function enforceCacheCap(): void {
  const dir = mediaDir();
  if (!dir.exists) return;
  const files = dir
    .list()
    .filter(
      (entry): entry is File =>
        entry instanceof File && entry.name !== ACCESS_INDEX_NAME,
    );
  let total = files.reduce((sum, f) => sum + (f.size ?? 0), 0);
  if (total <= MAX_CACHE_BYTES) return;

  const access = readAccessIndex();
  const sorted = files.slice().sort((a, b) => {
    const ta = access[a.name] ?? 0;
    const tb = access[b.name] ?? 0;
    return ta - tb;
  });
  for (const f of sorted) {
    if (total <= MAX_CACHE_BYTES) break;
    const size = f.size ?? 0;
    f.delete();
    delete access[f.name];
    total -= size;
  }
  writeAccessIndex(access);
}

/* ───────────── One-time migration: drop old per-kind dirs ─────────────
 * Old builds used separate `audio/` and `images/` cache directories. On
 * first launch after this update, delete them so they don't accumulate
 * stale content outside the unified cap.
 */
let migrated = false;
export function migrateLegacyCacheDirs(): void {
  if (migrated) return;
  migrated = true;
  for (const name of ['audio', 'images']) {
    const dir = new Directory(Paths.document, name);
    if (dir.exists) dir.delete();
  }
}
