import { Directory, File, Paths } from 'expo-file-system';
import {
  audioFetch,
  extForImageContentType,
  type AudioManifestEntry,
} from '../audio/manifest';

const CACHE_DIR_NAME = 'images';
const MAX_CACHE_BYTES = 50 * 1024 * 1024; // 50 MB
const ACCESS_INDEX_NAME = '.access-index.json';

function imageDir(): Directory {
  return new Directory(Paths.document, CACHE_DIR_NAME);
}

function ensureDir(): Directory {
  const dir = imageDir();
  if (!dir.exists) dir.create();
  return dir;
}

type ImageRef = {
  key: string;
  sha256: string;
  size: number;
  contentType: string;
};

function imageRefFromEntry(entry: AudioManifestEntry): ImageRef | null {
  if (
    !entry.imageSha256 ||
    entry.imageSize == null ||
    !entry.imageContentType
  ) {
    return null;
  }
  return {
    key: entry.key,
    sha256: entry.imageSha256,
    size: entry.imageSize,
    contentType: entry.imageContentType,
  };
}

function fileNameFor(ref: ImageRef): string {
  return `${ref.sha256}.${extForImageContentType(ref.contentType)}`;
}

function fileFor(ref: ImageRef): File {
  return new File(imageDir(), fileNameFor(ref));
}

/** Returns the cached file URI without downloading. `null` if not cached. */
export function getCachedImagePath(entry: AudioManifestEntry): string | null {
  const ref = imageRefFromEntry(entry);
  if (!ref) return null;
  const file = fileFor(ref);
  if (file.exists && file.size === ref.size) {
    recordAccess(file.name);
    return file.uri;
  }
  return null;
}

/**
 * Returns the local file URI for the image, downloading it if not already
 * cached. Updates an access index on cache hit so LRU eviction targets the
 * least-recently-used entry first. Returns null if the manifest entry has
 * no image fields.
 */
export async function prepareImage(
  entry: AudioManifestEntry,
  signal?: AbortSignal,
): Promise<string | null> {
  const ref = imageRefFromEntry(entry);
  if (!ref) return null;

  ensureDir();
  const file = fileFor(ref);

  if (file.exists && file.size === ref.size) {
    recordAccess(file.name);
    return file.uri;
  }
  if (file.exists) file.delete();

  const response = await audioFetch(
    `/api/audio/image/${encodeURIComponent(ref.key)}`,
    { signal },
  );
  const bytes = new Uint8Array(await response.arrayBuffer());

  file.create();
  file.write(bytes);
  recordAccess(file.name);
  enforceCacheCap();

  return file.uri;
}

type AccessIndex = Record<string, number>;

function readAccessIndex(): AccessIndex {
  const file = new File(imageDir(), ACCESS_INDEX_NAME);
  if (!file.exists) return {};
  try {
    return JSON.parse(file.textSync()) as AccessIndex;
  } catch {
    return {};
  }
}

function writeAccessIndex(index: AccessIndex): void {
  const file = new File(imageDir(), ACCESS_INDEX_NAME);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(index));
}

function recordAccess(fileName: string): void {
  const index = readAccessIndex();
  index[fileName] = Date.now();
  writeAccessIndex(index);
}

export function getImageCacheSizeBytes(): number {
  const dir = imageDir();
  if (!dir.exists) return 0;
  let total = 0;
  for (const entry of dir.list()) {
    if (entry instanceof File && entry.name !== ACCESS_INDEX_NAME) {
      total += entry.size ?? 0;
    }
  }
  return total;
}

export function clearImageCache(): void {
  const dir = imageDir();
  if (dir.exists) dir.delete();
}

function enforceCacheCap(): void {
  const dir = imageDir();
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
