import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/auth';
import { env } from '@/utils/env';

export type AudioManifestEntry = {
  key: string;
  sha256: string;
  size: number;
  durationMs: number;
  contentType: string;
};

const API_URL = env.get('API_URL');

export async function audioFetch(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  // @ts-expect-error getCookie is added by the Expo plugin at runtime
  const cookies = authClient.getCookie() as string | undefined;
  const { fetch: expoFetch } = await import('expo/fetch');

  return expoFetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(cookies ? { Cookie: cookies } : {}),
      ...options?.headers,
    },
  }) as unknown as Promise<Response>;
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
    queryKey: ['audio-manifest'],
    queryFn: fetchManifest,
    staleTime: 24 * 60 * 60 * 1000, // 24h
    gcTime: Infinity,
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
