import * as Updates from 'expo-updates';
import { useCallback, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

type OtaState = {
  /** True once an OTA bundle has been downloaded and is ready to apply via reloadAsync. */
  isUpdateReady: boolean;
  /** True after the initial Updates.checkForUpdateAsync has finished (success or failure). */
  isCheckComplete: boolean;
  /** Trigger Updates.reloadAsync — call from the UI's "Restart" button. */
  applyUpdate: () => Promise<void>;
};

/**
 * Boot-time + foreground OTA check.
 *
 * Combines the imperative `checkForUpdateAsync` + `fetchUpdateAsync` flow
 * (to *kick off* a check on mount + on foreground) with the reactive
 * `Updates.useUpdates()` hook (the source of truth for `isUpdatePending`).
 *
 * Why both: a previous session may have already downloaded an update without
 * applying it. In that case `isUpdatePending` is `true` at boot but a fresh
 * imperative `checkForUpdateAsync` returns `isAvailable: false` (the server's
 * latest matches the on-device pending bundle). Relying on local state alone
 * would miss the pending update entirely.
 *
 * Skipped in __DEV__ and when Updates.isEnabled is false (Expo Go).
 */
export function useOtaUpdate(): OtaState {
  const { isUpdatePending, isChecking, isDownloading } = Updates.useUpdates();

  const runCheck = useCallback(async () => {
    if (__DEV__ || !Updates.isEnabled) return;
    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        await Updates.fetchUpdateAsync();
      }
    } catch {
      // Best-effort — the binary-version gate handles forced upgrades when
      // OTA check / fetch fails.
    }
  }, []);

  useEffect(() => {
    runCheck();
  }, [runCheck]);

  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === 'active') runCheck();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [runCheck]);

  const applyUpdate = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      // Best-effort — if reload fails the next cold start will pick up the
      // downloaded bundle.
    }
  }, []);

  const isCheckComplete = !isChecking && !isDownloading;

  return {
    isUpdateReady: isUpdatePending,
    isCheckComplete,
    applyUpdate,
  };
}
