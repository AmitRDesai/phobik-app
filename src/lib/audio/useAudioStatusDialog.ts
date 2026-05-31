import { dialog } from '@/utils/dialog';
import { useEffect, useRef } from 'react';

type Args = {
  /**
   * When `false`, this consumer is muted — no dialog is shown and any dialog it
   * owns is closed. Use when another hook (e.g. `useAudioPrefetch`) owns the
   * single global dialog for the screen. Defaults to `true`.
   */
  enabled?: boolean;
  /** When `true`, no dialog is shown — audio is ready to play. */
  isReady: boolean;
  /** No network — show "will download when online" message. */
  isOffline: boolean;
  /** Server / transport error message. Falsy when there's no error. */
  errorMessage: string | null;
  /** Re-trigger the download when the user picks "Try again". */
  onRetry: () => void;
};

type ShownState = 'offline' | 'error' | null;

/**
 * Surfaces audio download problems via the app's bottom-sheet dialog rather
 * than an inline banner — keeps the practice screen layout stable.
 *
 * Precedence: `isReady` → close any open dialog. Otherwise `isOffline` wins
 * over `errorMessage` since "you're offline" is a more actionable explanation
 * than the underlying fetch error. Auto-closes on unmount.
 */
export function useAudioStatusDialog({
  enabled = true,
  isReady,
  isOffline,
  errorMessage,
  onRetry,
}: Args) {
  // Track what's currently visible so we don't re-trigger the same dialog
  // when unrelated state updates re-run the effect.
  const shownRef = useRef<ShownState>(null);

  // Keep `onRetry` callable from the dialog's resolve without putting it in
  // the effect's deps (we only want state changes to drive opens/closes).
  const onRetryRef = useRef(onRetry);
  useEffect(() => {
    onRetryRef.current = onRetry;
  }, [onRetry]);

  useEffect(() => {
    if (!enabled || isReady) {
      if (shownRef.current) {
        dialog.close();
        shownRef.current = null;
      }
      return;
    }

    if (isOffline) {
      if (shownRef.current === 'offline') return;
      shownRef.current = 'offline';
      dialog.info({
        title: "You're offline",
        message:
          "Audio will start downloading automatically when you're back online.",
        buttons: [{ label: 'OK', value: 'ok', variant: 'primary' }],
      });
      return;
    }

    if (errorMessage) {
      if (shownRef.current === 'error') return;
      shownRef.current = 'error';
      dialog
        .error({
          title: "Couldn't load audio",
          message: errorMessage,
          buttons: [
            { label: 'Try again', value: 'retry', variant: 'primary' },
            { label: 'Cancel', value: 'cancel', variant: 'secondary' },
          ],
        })
        .then((result) => {
          // Dialog has closed (button tap or external dismiss). Reset so the
          // next error transition opens a fresh dialog.
          shownRef.current = null;
          if (result === 'retry') {
            onRetryRef.current();
          }
        });
      return;
    }

    // No active state — close any lingering dialog.
    if (shownRef.current) {
      dialog.close();
      shownRef.current = null;
    }
  }, [enabled, isReady, isOffline, errorMessage]);

  // Defensive: close on unmount so a backgrounded screen doesn't leave its
  // dialog floating over the next screen.
  useEffect(() => {
    return () => {
      // Copy ref.current to a local variable so the cleanup captures the value
      // at effect teardown time, not whenever the cleanup eventually runs.
      const shown = shownRef.current;
      if (shown) {
        dialog.close();
        shownRef.current = null;
      }
    };
  }, []);
}
