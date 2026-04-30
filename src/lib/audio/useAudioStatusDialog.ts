import { dialog } from '@/utils/dialog';
import { useEffect, useRef } from 'react';

type Args = {
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
    if (isReady) {
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
  }, [isReady, isOffline, errorMessage]);

  // Defensive: close on unmount so a backgrounded screen doesn't leave its
  // dialog floating over the next screen.
  useEffect(() => {
    return () => {
      if (shownRef.current) {
        dialog.close();
        shownRef.current = null;
      }
    };
  }, []);
}
