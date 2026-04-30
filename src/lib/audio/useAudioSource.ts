import { useEffect, useRef, useState } from 'react';
import { findManifestEntry, useAudioManifest } from './manifest';
import { prepareAudio, type DownloadProgress } from './cache';

export type UseAudioSourceResult = {
  /** Local `file://` URI ready to feed into `useAudioPlayer`, or `null` if not ready. */
  source: string | null;
  isDownloading: boolean;
  /** 0-1 download progress while downloading; `null` otherwise. */
  progress: number | null;
  error: Error | null;
};

/**
 * Resolves an audio asset key (e.g. "sleep-meditation-1") to a local file URI,
 * downloading from the backend on first access. Subsequent calls hit the
 * on-device cache. The returned `source` is `null` until the file is ready,
 * which screens compose with `expo-audio`'s `useAudioPlayer(source ?? null)`.
 */
export function useAudioSource(key: string | null): UseAudioSourceResult {
  const { data: manifest } = useAudioManifest();
  const [source, setSource] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const entry = key ? findManifestEntry(manifest, key) : undefined;
  const sha256 = entry?.sha256 ?? null;

  useEffect(() => {
    abortRef.current?.abort();
    setSource(null);
    setError(null);
    setProgress(null);

    if (!entry) {
      setIsDownloading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsDownloading(true);

    const handleProgress = (p: DownloadProgress) => {
      if (controller.signal.aborted) return;
      setProgress(p.ratio);
    };

    prepareAudio(entry, handleProgress, controller.signal)
      .then((uri) => {
        if (controller.signal.aborted) return;
        setSource(uri);
        setIsDownloading(false);
        setProgress(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsDownloading(false);
        setProgress(null);
      });

    return () => {
      controller.abort();
    };
    // sha256 is the freshness key — re-run when the asset is re-recorded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.key, sha256]);

  return { source, isDownloading, progress, error };
}
