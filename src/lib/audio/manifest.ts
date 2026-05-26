import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { migrateLegacyCacheDirs, pruneOrphans } from '@/lib/media/cache';
import { authClient } from '@/lib/auth';
import { env } from '@/utils/env';

export type AudioManifestEntry = {
  key: string;
  sha256: string;
  size: number;
  durationMs: number;
  contentType: string;
  /**
   * Optional paired artwork. Present when the backend has an image for the
   * asset; absent when the audio has no per-track image (UI falls back to a
   * bundled mood-level image).
   */
  imageSha256?: string | null;
  imageSize?: number | null;
  imageContentType?: string | null;
};

const API_URL = env.get('API_URL');

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Friendly subclass so screens can surface a stable message regardless of
 * which underlying transport / status code triggered the failure.
 */
export class AudioFetchError extends Error {
  readonly kind: 'timeout' | 'http' | 'network';
  readonly status?: number;
  constructor(
    kind: 'timeout' | 'http' | 'network',
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = 'AudioFetchError';
    this.kind = kind;
    this.status = status;
  }
}

type AudioFetchOptions = RequestInit & { timeoutMs?: number };

export async function audioFetch(
  path: string,
  options?: AudioFetchOptions,
): Promise<Response> {
  // @ts-expect-error getCookie is added by the Expo plugin at runtime
  const cookies = authClient.getCookie() as string | undefined;
  const { fetch: expoFetch } = await import('expo/fetch');

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

  // If the caller passed a signal, abort our timeout when they abort.
  options?.signal?.addEventListener('abort', () => timeoutController.abort(), {
    once: true,
  });

  try {
    const response = (await expoFetch(`${API_URL}${path}`, {
      ...options,
      signal: timeoutController.signal,
      headers: {
        ...(cookies ? { Cookie: cookies } : {}),
        ...options?.headers,
      },
    })) as unknown as Response;

    if (!response.ok) {
      throw new AudioFetchError(
        'http',
        `Server returned ${response.status} ${response.statusText}`,
        response.status,
      );
    }
    return response;
  } catch (err) {
    if (err instanceof AudioFetchError) throw err;
    // Was this a timeout (we aborted) vs a caller cancel?
    if (timeoutController.signal.aborted && !options?.signal?.aborted) {
      throw new AudioFetchError(
        'timeout',
        `Server didn't respond within ${timeoutMs / 1000}s`,
      );
    }
    // Re-throw caller-cancelled aborts so useEffect cleanup is honored.
    if (options?.signal?.aborted) throw err;
    throw new AudioFetchError(
      'network',
      err instanceof Error ? err.message : 'Network request failed',
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchManifest(): Promise<AudioManifestEntry[]> {
  const res = await audioFetch('/api/audio/manifest');
  if (!res.ok) {
    throw new Error(`Audio manifest fetch failed: ${res.status}`);
  }
  const json = (await res.json()) as { assets: AudioManifestEntry[] };
  return json.assets;
}

export function useAudioManifest() {
  const query = useQuery({
    // Versioned key — bump when the manifest response shape changes so the
    // persisted React Query cache from older builds doesn't shadow the new
    // payload. v3 unifies audio + image cache directories.
    queryKey: ['audio-manifest', 'v3'],
    queryFn: fetchManifest,
    // 5 min stale — content updates (replaced track artwork, new audio
    // sha256) propagate within minutes instead of next-day. The underlying
    // sha256-keyed media cache handles the actual file-level reuse so
    // refetches are cheap (manifest payload, not the audio bytes).
    staleTime: 5 * 60 * 1000,
    gcTime: Infinity,
    retry: 1,
  });

  // Auto-prune any cached file whose sha256 isn't referenced by the current
  // manifest (content was replaced server-side, or removed). One-shot legacy
  // dir cleanup runs the first time the hook fires after upgrade.
  const sha256Sig = useMemo(() => {
    if (!query.data) return '';
    const set = new Set<string>();
    for (const e of query.data) {
      set.add(e.sha256);
      if (e.imageSha256) set.add(e.imageSha256);
    }
    return Array.from(set).sort().join('|');
  }, [query.data]);

  useEffect(() => {
    if (!sha256Sig) return;
    migrateLegacyCacheDirs();
    pruneOrphans(sha256Sig.split('|'));
  }, [sha256Sig]);

  return query;
}

export function findManifestEntry(
  manifest: AudioManifestEntry[] | undefined,
  key: string,
): AudioManifestEntry | undefined {
  return manifest?.find((entry) => entry.key === key);
}

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/ogg': 'ogg',
};

export function extForContentType(contentType: string): string {
  return EXT_BY_CONTENT_TYPE[contentType] ?? 'bin';
}

const IMAGE_EXT_BY_CONTENT_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function extForImageContentType(contentType: string): string {
  return IMAGE_EXT_BY_CONTENT_TYPE[contentType] ?? 'bin';
}
