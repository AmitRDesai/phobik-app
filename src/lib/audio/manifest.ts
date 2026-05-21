import { useQuery } from '@tanstack/react-query';
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
  return useQuery({
    // Versioned key — bump when the manifest response shape changes so the
    // persisted React Query cache from older builds doesn't shadow the new
    // payload (e.g. v2 added imageSha256/imageSize/imageContentType).
    queryKey: ['audio-manifest', 'v2'],
    queryFn: fetchManifest,
    staleTime: 24 * 60 * 60 * 1000, // 24h
    gcTime: Infinity,
    // Retry once on transient failures, but don't loop forever — the
    // useAudioSource error path surfaces a "Try again" UI.
    retry: 1,
  });
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
