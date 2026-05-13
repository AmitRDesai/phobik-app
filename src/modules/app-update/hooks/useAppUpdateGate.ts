import { useAppVersionCheck } from '@/hooks/useAppVersionCheck';
import { useOtaUpdate } from '@/hooks/useOtaUpdate';
import { dialog } from '@/utils/dialog';
import { toast } from '@/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { updateRequiredAtom } from '../store/app-update';

const SOFT_DISMISS_STORAGE_KEY = 'app-update:soft-dismissed';

/**
 * Orchestrates the EAS OTA + binary version-check flows on top of the
 * already-rendered app:
 *   - publishes the force-update payload to `updateRequiredAtom` so the
 *     `/update-required` screen can read it,
 *   - fires the dismissable soft-update dialog when the binary is between
 *     `minimumVersion` and `latestVersion` (deduped per `latestVersion`),
 *   - reports whether a downloaded OTA bundle is ready so the boot router
 *     can route to `/ota-restart` (full-screen, non-dismissable).
 *
 * Caller passes `isReady` so dialogs don't try to render before the app's
 * splash gate releases. All side-effects are wrapped — a failure anywhere
 * inside is silently swallowed so the user never sees an error.
 *
 * Precedence (resolved by the caller): force-update wins over OTA-restart.
 * If the binary is below `minimumVersion`, the OTA bundle is likely
 * incompatible (runtime version policy is `appVersion`), so we push the
 * user to the App Store instead of restarting onto a stale-runtime bundle.
 */
export function useAppUpdateGate({ isReady }: { isReady: boolean }): {
  isForceUpdate: boolean;
  isOtaRestartNeeded: boolean;
} {
  const ota = useOtaUpdate();
  const versionCheck = useAppVersionCheck();
  const setUpdateRequired = useSetAtom(updateRequiredAtom);
  const softDialogShownRef = useRef(false);

  // Publish the force-update payload into the atom that the
  // /update-required screen consumes.
  useEffect(() => {
    if (versionCheck.result.action === 'force-update') {
      setUpdateRequired({
        storeUrl: versionCheck.result.storeUrl,
        minimumVersion: versionCheck.result.minimumVersion,
      });
    } else {
      setUpdateRequired(null);
    }
  }, [versionCheck.result, setUpdateRequired]);

  // Soft-update prompt — dismissable, once per `latestVersion`. AsyncStorage
  // and dialog calls are wrapped so a corrupted storage row or dialog error
  // never bubbles up to the user.
  useEffect(() => {
    if (!isReady) return;
    if (versionCheck.result.action !== 'soft-update') return;
    if (softDialogShownRef.current) return;
    softDialogShownRef.current = true;
    const { storeUrl, latestVersion } = versionCheck.result;
    (async () => {
      try {
        const dismissedFor = await AsyncStorage.getItem(
          SOFT_DISMISS_STORAGE_KEY,
        ).catch(() => null);
        if (dismissedFor === latestVersion) return;
        const choice = await dialog.info({
          title: 'Update available',
          message: 'A newer version of Phobik is ready in the App Store.',
          buttons: [
            { label: 'Later', value: 'later', variant: 'secondary' },
            { label: 'Update Now', value: 'update', variant: 'primary' },
          ],
        });
        if (choice === 'update') {
          Linking.openURL(storeUrl).catch(() => {
            toast.error("Couldn't open the App Store. Please try again.");
          });
        } else {
          await AsyncStorage.setItem(
            SOFT_DISMISS_STORAGE_KEY,
            latestVersion,
          ).catch(() => {});
        }
      } catch {
        // Best-effort UX nudge — never block the user.
      }
    })();
  }, [isReady, versionCheck.result]);

  return {
    isForceUpdate: versionCheck.result.action === 'force-update',
    isOtaRestartNeeded: ota.isUpdateReady,
  };
}
