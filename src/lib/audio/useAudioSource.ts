import { useCallback, useEffect, useRef, useState } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  AudioFetchError,
  findManifestEntry,
  useAudioManifest,
} from './manifest';
import {
  getCachedAudioPath,
  prepareAudio,
  type DownloadProgress,
} from './cache';

export type UseAudioSourceResult = {
  /** Local `file://` URI ready to feed into `useAudioPlayer`, or `null` if not ready. */
  source: string | null;
  isDownloading: boolean;
  /** 0-1 download progress while downloading; `null` otherwise. */
  progress: number | null;
  /**
   * `true` when the asset is not on disk and the device is currently offline.
   * Screens can use this to show an "offline — will download when reconnected"
   * message. The download starts automatically when `useNetInfo` reports the
   * device is back online.
   */
  isOffline: boolean;
  /** A short, user-friendly message when a transport / server error occurs. */
  errorMessage: string | null;
  /** Underlying error object, in case the caller wants the raw type/status. */
  error: Error | null;
  /** Trigger a fresh download attempt (useful for "Tap to retry"). */
  retry: () => void;
};

function describeError(err: unknown): string {
  if (err instanceof AudioFetchError) {
    if (err.kind === 'timeout') {
      return "Server didn't respond. Check your connection and try again.";
    }
    if (err.kind === 'network') {
      return "Couldn't reach the server. Check your connection and try again.";
    }
    if (err.status === 401) return 'Your session expired. Sign in again.';
    if (err.status === 404) return 'This audio is no longer available.';
    if (err.status && err.status >= 500) {
      return 'Our server hit a snag. Try again in a moment.';
    }
    return err.message;
  }
  return "Couldn't load audio. Try again.";
}

/**
 * Resolves an audio asset key (e.g. "sleep-meditation-1") to a local file URI,
 * downloading from the backend on first access. Subsequent calls hit the
 * on-device cache. The returned `source` is `null` until the file is ready,
 * which screens compose with `expo-audio`'s `useAudioPlayer(source ?? null)`.
 *
 * Offline behavior: if the file is already cached, it is served immediately
 * regardless of network state. If the file is missing and the device is
 * offline, the hook does not attempt the download and surfaces `isOffline`
 * so the screen can show a helpful message; the download starts automatically
 * once connectivity returns.
 *
 * Error behavior: transport / server errors set `errorMessage` to a friendly
 * string. Call `retry()` (e.g., from a "Tap to retry" button) to attempt
 * the download again.
 */
export function useAudioSource(key: string | null): UseAudioSourceResult {
  const { data: manifest } = useAudioManifest();
  const { isConnected } = useNetInfo();
  const [source, setSource] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const entry = key ? findManifestEntry(manifest, key) : undefined;
  const sha256 = entry?.sha256 ?? null;
  // `isConnected` is `null` while NetInfo is initializing — treat as online so
  // we don't flash an "offline" state on launch when the device is in fact up.
  const isOnline = isConnected !== false;

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    abortRef.current?.abort();
    setSource(null);
    setError(null);
    setProgress(null);
    setIsOffline(false);

    if (!entry) {
      setIsDownloading(false);
      return;
    }

    const cachedPath = getCachedAudioPath(entry);
    if (cachedPath) {
      setSource(cachedPath);
      setIsDownloading(false);
      return;
    }

    if (!isOnline) {
      setIsDownloading(false);
      setIsOffline(true);
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
    // sha256 — re-run when the asset is re-recorded.
    // isOnline — auto-retry when connectivity returns.
    // retryCount — manual retry trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.key, sha256, isOnline, retryCount]);

  return {
    source,
    isDownloading,
    progress,
    isOffline,
    error,
    errorMessage: error ? describeError(error) : null,
    retry,
  };
}
