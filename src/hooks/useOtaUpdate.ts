import * as Updates from 'expo-updates';
import { useCallback, useEffect, useState } from 'react';
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
 * Boot-time + foreground OTA check. Pulls EAS Updates bundles automatically and
 * exposes a flag the splash gate can hold on until the download finishes.
 *
 * Skipped entirely in __DEV__ and when Updates.isEnabled is false (Expo Go).
 */
export function useOtaUpdate(): OtaState {
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [isCheckComplete, setIsCheckComplete] = useState(false);

  const runCheck = useCallback(async () => {
    if (__DEV__ || !Updates.isEnabled) {
      setIsCheckComplete(true);
      return;
    }
    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        const fetched = await Updates.fetchUpdateAsync();
        if (fetched.isNew) setIsUpdateReady(true);
      }
    } catch {
      // Fail silently — OTA availability is best-effort; the binary-version
      // gate handles forced upgrades when this fails.
    } finally {
      setIsCheckComplete(true);
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
    await Updates.reloadAsync();
  }, []);

  return { isUpdateReady, isCheckComplete, applyUpdate };
}
