import { Directory, File, Paths } from 'expo-file-system';
import {
  audioFetch,
  extForContentType,
  type AudioManifestEntry,
} from './manifest';

const CACHE_DIR_NAME = 'audio';
const MAX_CACHE_BYTES = 200 * 1024 * 1024; // 200 MB
const ACCESS_INDEX_NAME = '.access-index.json';

function audioDir(): Directory {
  return new Directory(Paths.document, CACHE_DIR_NAME);
}

function ensureDir(): Directory {
  const dir = audioDir();
  if (!dir.exists) dir.create();
  return dir;
}

function fileNameFor(entry: AudioManifestEntry): string {
  return `${entry.sha256}.${extForContentType(entry.contentType)}`;
}

function fileFor(entry: AudioManifestEntry): File {
  return new File(audioDir(), fileNameFor(entry));
}

export type DownloadProgress = {
  receivedBytes: number;
  totalBytes: number;
  ratio: number;
};

/**
 * Returns the local file URI for the audio asset, downloading it if not
 * already cached. Updates an access index on cache hit so LRU eviction
 * targets the least-recently-used entry first.
 */
export async function prepareAudio(
  entry: AudioManifestEntry,
  onProgress?: (progress: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<string> {
  ensureDir();
  const file = fileFor(entry);

  // Treat a wrong-size file (interrupted prior download) as a miss.
  if (file.exists && file.size === entry.size) {
    recordAccess(file.name);
    return file.uri;
  }
  if (file.exists) file.delete();

  await downloadToFile(entry, file, onProgress, signal);
  recordAccess(file.name);

  enforceCacheCap();

  return file.uri;
}

async function downloadToFile(
  entry: AudioManifestEntry,
  file: File,
  onProgress?: (progress: DownloadProgress) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await audioFetch(
    `/api/audio/file/${encodeURIComponent(entry.key)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      `Audio download failed: ${response.status} ${response.statusText}`,
    );
  }

  const total = entry.size;
  const reader = response.body?.getReader();

  let bytes: Uint8Array;
  if (!reader) {
    bytes = new Uint8Array(await response.arrayBuffer());
    onProgress?.({
      receivedBytes: bytes.byteLength,
      totalBytes: total,
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
          totalBytes: total,
          ratio: total > 0 ? received / total : 0,
        });
      }
    }
    bytes = concatChunks(chunks, received);
  }

  file.create();
  file.write(bytes);
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

type AccessIndex = Record<string, number>;

function readAccessIndex(): AccessIndex {
  const file = new File(audioDir(), ACCESS_INDEX_NAME);
  if (!file.exists) return {};
  try {
    return JSON.parse(file.textSync()) as AccessIndex;
  } catch {
    return {};
  }
}

function writeAccessIndex(index: AccessIndex): void {
  const file = new File(audioDir(), ACCESS_INDEX_NAME);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(index));
}

function recordAccess(fileName: string): void {
  const index = readAccessIndex();
  index[fileName] = Date.now();
  writeAccessIndex(index);
}

export function getCacheSizeBytes(): number {
  const dir = audioDir();
  if (!dir.exists) return 0;
  let total = 0;
  for (const entry of dir.list()) {
    if (entry instanceof File && entry.name !== ACCESS_INDEX_NAME) {
      total += entry.size ?? 0;
    }
  }
  return total;
}

export function clearAudioCache(): void {
  const dir = audioDir();
  if (dir.exists) dir.delete();
}

function enforceCacheCap(): void {
  const dir = audioDir();
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
