import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useRef, useState } from 'react';
import {
  getCachedAudioPath,
  prepareAudio,
  type DownloadProgress,
} from './cache';
import {
  findManifestEntry,
  useAudioManifest,
  type AudioManifestEntry,
} from './manifest';
import { describeError } from './useAudioSource';
import { useAudioStatusDialog } from './useAudioStatusDialog';

export type UseAudioPrefetchResult = {
  /** `true` once every requested key is cached on disk and ready to play. */
  ready: boolean;
  isDownloading: boolean;
  /** 0-1 aggregate download progress across all requested keys. */
  progress: number;
  /** `true` when files are missing and the device is offline. */
  isOffline: boolean;
  /** A short, user-friendly message when a transport / server error occurs. */
  errorMessage: string | null;
  /** Underlying error object, in case the caller wants the raw type/status. */
  error: Error | null;
  /** Trigger a fresh download attempt (useful for "Tap to retry"). */
  retry: () => void;
};

/** How many files to download at once. Caps memory (each download buffers the
 *  whole file before write) and gets the earliest clips cached fastest. */
const CONCURRENCY = 4;

/**
 * Batch sibling of {@link useAudioSource}: resolves a *set* of audio keys,
 * downloads any that aren't already cached (bounded concurrency), and reports a
 * single `ready` flag once every key is on disk. Use this to pre-cache all of a
 * guided session's clips *before* the session timer starts, so per-step
 * playback never stalls mid-session waiting on a download.
 *
 * Mirrors `useAudioSource`'s offline / error / retry behavior and surfaces the
 * shared status dialog, so it can be the single dialog owner for a screen
 * (per-step `useStreamedAudioPlayer`s should pass `suppressDialog: true`).
 */
export function useAudioPrefetch(
  keys: readonly string[] | null,
): UseAudioPrefetchResult {
  const {
    data: manifest,
    error: manifestError,
    isFetching: manifestIsFetching,
    refetch: refetchManifest,
  } = useAudioManifest();
  const { isConnected } = useNetInfo();
  // `isConnected` is `null` while NetInfo is initializing — treat as online so
  // we don't flash an "offline" state on launch when the device is in fact up.
  const isOnline = isConnected !== false;

  const [ready, setReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Dedupe + stabilize by content so inline-array callers don't re-trigger
  // downloads every render. Insertion order is preserved (download priority).
  const keysSig = keys ? Array.from(new Set(keys)).join('|') : '';

  const retry = () => {
    void refetchManifest();
    setRetryCount((c) => c + 1);
  };

  useEffect(() => {
    abortRef.current?.abort();
    setError(null);
    setIsOffline(false);

    const uniqueKeys = keysSig ? keysSig.split('|') : [];

    // Nothing to prefetch — trivially ready.
    if (uniqueKeys.length === 0) {
      setReady(true);
      setIsDownloading(false);
      setProgress(1);
      return;
    }

    // Manifest fetch failed — surface as offline or error.
    if (manifestError) {
      setReady(false);
      setIsDownloading(false);
      setProgress(0);
      if (!isOnline) setIsOffline(true);
      else setError(manifestError as Error);
      return;
    }

    // Manifest still loading on first launch — wait quietly.
    if (!manifest) {
      setReady(false);
      setIsDownloading(manifestIsFetching);
      setProgress(0);
      return;
    }

    // Resolve every key to a manifest entry. A missing key is a hard config
    // error — surfaced so the "Preparing…" gate never hangs silently.
    const entries: AudioManifestEntry[] = [];
    for (const k of uniqueKeys) {
      const entry = findManifestEntry(manifest, k);
      if (!entry) {
        setReady(false);
        setIsDownloading(false);
        setProgress(0);
        setError(new Error(`Audio "${k}" is not available.`));
        return;
      }
      entries.push(entry);
    }

    const total = entries.length;
    const pending = entries.filter((e) => !getCachedAudioPath(e));
    const alreadyCached = total - pending.length;

    // Everything already on disk.
    if (pending.length === 0) {
      setReady(true);
      setIsDownloading(false);
      setProgress(1);
      return;
    }

    // Missing files but offline — wait; the effect re-runs (isOnline dep) and
    // resumes from the cache when connectivity returns.
    if (!isOnline) {
      setReady(false);
      setIsDownloading(false);
      setIsOffline(true);
      setProgress(total > 0 ? alreadyCached / total : 0);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setReady(false);
    setIsDownloading(true);

    // Aggregate progress: cached files + in-flight ratios, throttled to commit
    // only when the rounded percent changes (10 parallel streams otherwise
    // flood the screen with re-renders).
    const ratios = new Map<string, number>();
    let doneCount = alreadyCached;
    let lastPct = -1;
    let stopped = false;
    const commitProgress = () => {
      if (stopped || controller.signal.aborted) return;
      let sum = 0;
      for (const r of ratios.values()) sum += r;
      const value = Math.min(1, (doneCount + sum) / total);
      const pct = Math.round(value * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        setProgress(value);
      }
    };
    commitProgress();

    // Bounded-concurrency pool over `pending`, in session order.
    let cursor = 0;
    const runNext = async (): Promise<void> => {
      if (stopped) return;
      const index = cursor;
      cursor = cursor + 1;
      if (index >= pending.length) return;
      const entry = pending[index];
      const onProgress = (p: DownloadProgress) => {
        if (controller.signal.aborted) return;
        ratios.set(entry.sha256, p.ratio);
        commitProgress();
      };
      try {
        await prepareAudio(entry, onProgress, controller.signal);
      } catch (err) {
        if (controller.signal.aborted) return;
        stopped = true;
        throw err;
      }
      ratios.set(entry.sha256, 1);
      doneCount += 1;
      commitProgress();
      await runNext();
    };

    const workers = Array.from(
      { length: Math.min(CONCURRENCY, pending.length) },
      () => runNext(),
    );
    Promise.all(workers)
      .then(() => {
        if (controller.signal.aborted) return;
        setReady(true);
        setIsDownloading(false);
        setProgress(1);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsDownloading(false);
      });

    return () => {
      controller.abort();
    };
  }, [
    keysSig,
    manifest,
    manifestError,
    manifestIsFetching,
    isOnline,
    retryCount,
  ]);

  const errorMessage = error ? describeError(error) : null;

  // Surface offline / network-error state via the shared dialog. Closes
  // automatically once everything is ready.
  useAudioStatusDialog({
    isReady: ready,
    isOffline,
    errorMessage,
    onRetry: retry,
  });

  return {
    ready,
    isDownloading,
    progress,
    isOffline,
    error,
    errorMessage,
    retry,
  };
}
