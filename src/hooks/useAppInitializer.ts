import { useSession } from '@/hooks/auth/useAuth';
import { connectPowerSync, disconnectPowerSync } from '@/lib/powersync';
import { useBiometricAvailability } from '@/hooks/auth/useBiometric';
import { useProfileStatus } from '@/hooks/auth/useProfile';
import { updateRequiredAtom } from '@/modules/app-update/store/app-update';
import {
  identifyUser,
  initRevenueCat,
  logOutRevenueCat,
} from '@/modules/purchases/lib/revenue-cat';
import { biometricPromptShownAtom, isSignedOutAtom } from '@/store/auth';
import { isReturningUserAtom } from '@/store/user';
import { dialog } from '@/utils/dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useAppVersionCheck } from './useAppVersionCheck';
import { useOtaUpdate } from './useOtaUpdate';
import { useProfileAutoRecovery } from './useProfileAutoRecovery';
import '../../global.css';

type ActiveStack =
  | 'auth'
  | 'email-verification'
  | 'profile-setup'
  | 'onboarding'
  | 'biometric-setup'
  | 'home'
  | 'update-required';

const SOFT_DISMISS_STORAGE_KEY = 'app-update:soft-dismissed';

const useAppInitializer = () => {
  const { data: session, isPending: isSessionLoading } = useSession();
  const isSignedOut = useAtomValue(isSignedOutAtom);
  const isReturningUser = useAtomValue(isReturningUserAtom);
  const setIsReturningUser = useSetAtom(isReturningUserAtom);
  const biometricPromptShown = useAtomValue(biometricPromptShownAtom);
  const { isAvailable: biometricAvailable } = useBiometricAvailability();
  const [isReady, setIsReady] = useState(false);

  const hasSession = !!session?.session;
  const isAuthenticated = hasSession && !isSignedOut;
  const emailVerified = session?.user?.emailVerified ?? true;

  // Once authenticated, mark as returning user permanently
  useEffect(() => {
    if (isAuthenticated && !isReturningUser) setIsReturningUser(true);
  }, [isAuthenticated, isReturningUser, setIsReturningUser]);

  // Initialize RevenueCat SDK on mount
  useEffect(() => {
    initRevenueCat().catch(console.error);
  }, []);

  // Initialize Health Connect once at startup (Android only). HealthKit on
  // iOS does not require an explicit init step.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    import('react-native-health-connect')
      .then(({ initialize }) => initialize())
      .catch(() => {
        // Health Connect may be unavailable on this device; silently ignore.
      });
  }, []);

  // Register the periodic background biometrics sync task. The task itself is
  // defined at module-scope inside the imported file (TaskManager.defineTask),
  // so importing it is enough to wire the handler.
  useEffect(() => {
    import('@/lib/biometrics-background').then(
      ({ registerBiometricsBackgroundTask }) => {
        registerBiometricsBackgroundTask();
      },
    );
  }, []);

  // Connect/disconnect PowerSync + RevenueCat based on auth state
  useEffect(() => {
    if (isAuthenticated) {
      connectPowerSync().catch(console.error);
      if (session?.user?.id) {
        identifyUser(session.user.id).catch(console.error);
      }
    } else if (!isSessionLoading) {
      disconnectPowerSync().catch(console.error);
      logOutRevenueCat().catch(console.error);
    }
  }, [isAuthenticated, isSessionLoading, session?.user?.id]);

  // Profile status from PowerSync local SQLite
  const { data: profileStatus, isPending: isProfileChecking } =
    useProfileStatus(isAuthenticated);
  const hasProfile = profileStatus?.hasProfile ?? false;
  const onboardingCompleted = profileStatus?.onboardingCompleted ?? false;

  // Auto-save questionnaire data after signup (separate hook for clarity)
  const { isPending: isAutoRecoveryPending } = useProfileAutoRecovery({
    isAuthenticated,
    hasProfile,
  });

  // OTA + binary-version gates run in the background — splash does NOT wait
  // on them. When they resolve they fire dialogs / switch activeStack on top
  // of the already-rendered app. Holding the splash on a remote round-trip
  // would block every cold-start on network latency for no good reason.
  const ota = useOtaUpdate();
  const versionCheck = useAppVersionCheck();
  const setUpdateRequired = useSetAtom(updateRequiredAtom);
  const otaDialogShownRef = useRef(false);
  const softDialogShownRef = useRef(false);

  const dataResolved =
    !isSessionLoading &&
    (!isAuthenticated || !isProfileChecking) &&
    !isAutoRecoveryPending;

  useEffect(() => {
    if (dataResolved) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [dataResolved]);

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

  // OTA-ready prompt (non-dismissable) — shown FIRST so a downloaded OTA wins
  // over a force-update push to the App Store.
  useEffect(() => {
    if (!isReady || !ota.isUpdateReady || otaDialogShownRef.current) return;
    otaDialogShownRef.current = true;
    (async () => {
      await dialog.info({
        title: 'Restart to apply update',
        message: 'A new version is ready. Restart to keep going.',
        buttons: [{ label: 'Restart', value: 'restart', variant: 'primary' }],
      });
      await ota.applyUpdate();
    })();
  }, [isReady, ota]);

  // Soft-update prompt — dismissable, once per `latestVersion`.
  useEffect(() => {
    if (!isReady) return;
    if (versionCheck.result.action !== 'soft-update') return;
    if (softDialogShownRef.current) return;
    softDialogShownRef.current = true;
    const { storeUrl, latestVersion } = versionCheck.result;
    (async () => {
      const dismissedFor = await AsyncStorage.getItem(SOFT_DISMISS_STORAGE_KEY);
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
        Linking.openURL(storeUrl).catch(() => {});
      } else {
        await AsyncStorage.setItem(SOFT_DISMISS_STORAGE_KEY, latestVersion);
      }
    })();
  }, [isReady, versionCheck.result]);

  const rawActiveStack = ((): ActiveStack => {
    if (versionCheck.result.action === 'force-update') return 'update-required';
    if (!isAuthenticated) return 'auth';
    if (!hasProfile) return 'profile-setup';
    if (!emailVerified) return 'email-verification';
    if (!onboardingCompleted) return 'onboarding';
    if (!biometricPromptShown && biometricAvailable) return 'biometric-setup';
    return 'home';
  })();

  // Only emit activeStack once data resolves — holds the initial value until ready
  const activeStackRef = useRef(rawActiveStack);
  if (dataResolved) {
    activeStackRef.current = rawActiveStack;
  }
  const activeStack = activeStackRef.current;

  return {
    activeStack,
    isReady,
    isReturningUser,
  };
};

export type { ActiveStack };
export default useAppInitializer;
