import { useSession } from '@/hooks/auth/useAuth';
import { connectPowerSync, disconnectPowerSync } from '@/lib/powersync';
import { useBiometricAvailability } from '@/hooks/auth/useBiometric';
import { useProfileStatus } from '@/hooks/auth/useProfile';
import { useAppUpdateGate } from '@/modules/app-update/hooks/useAppUpdateGate';
import {
  identifyUser,
  initRevenueCat,
  logOutRevenueCat,
} from '@/modules/purchases/lib/revenue-cat';
import { biometricPromptShownAtom, isSignedOutAtom } from '@/store/auth';
import { isReturningUserAtom } from '@/store/user';
import * as SplashScreen from 'expo-splash-screen';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useProfileAutoRecovery } from './useProfileAutoRecovery';
import '../../global.css';

type ActiveStack =
  | 'auth'
  | 'email-verification'
  | 'onboarding'
  | 'biometric-setup'
  | 'home'
  | 'update-required'
  | 'ota-restart';

const useAppInitializer = () => {
  const { data: session, isPending: isSessionLoading } = useSession();
  const isSignedOut = useAtomValue(isSignedOutAtom);
  const isReturningUser = useAtomValue(isReturningUserAtom);
  const setIsReturningUser = useSetAtom(isReturningUserAtom);
  const biometricPromptShown = useAtomValue(biometricPromptShownAtom);
  const { isAvailable: biometricAvailable, resolved: biometricResolved } =
    useBiometricAvailability();
  const [isReady, setIsReady] = useState(false);

  // Safety valve: never block the boot stack indefinitely on the biometric
  // availability check. It resolves quickly in practice, but if the native
  // module ever hangs we proceed after a short grace period.
  const [biometricGraceElapsed, setBiometricGraceElapsed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBiometricGraceElapsed(true), 2000);
    return () => clearTimeout(t);
  }, []);
  const biometricGate = biometricResolved || biometricGraceElapsed;

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

  // Hold splash until first sync settles so the guard sees a synced profile.
  const { isPending: isAutoRecoveryPending } = useProfileAutoRecovery({
    isAuthenticated,
    hasProfile,
  });

  // The biometric-setup decision (biometricPromptShown && biometricAvailable)
  // is only reachable once the user is authenticated, email-verified, and has
  // completed onboarding. Only then must we wait on the availability check —
  // otherwise we'd delay splash for users who can never reach that branch.
  const needsBiometricGate =
    isAuthenticated &&
    emailVerified &&
    onboardingCompleted &&
    !biometricPromptShown;

  const dataResolved =
    !isSessionLoading &&
    (!isAuthenticated || !isProfileChecking) &&
    !isAutoRecoveryPending &&
    (!needsBiometricGate || biometricGate);

  useEffect(() => {
    if (dataResolved) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [dataResolved]);

  // OTA + binary-version gates run in the background — splash does NOT wait
  // on them. The gate hook owns the dialogs, the atom publish, and the
  // soft-dismiss dedup; it just tells us when to take over the boot stack.
  // Precedence: force-update beats OTA-restart (an OTA bundle for an
  // incompatible runtime would be useless; push the user to the App Store).
  const { isForceUpdate, isOtaRestartNeeded } = useAppUpdateGate({ isReady });

  const rawActiveStack = ((): ActiveStack => {
    if (isForceUpdate) return 'update-required';
    if (isOtaRestartNeeded) return 'ota-restart';
    if (!isAuthenticated) return 'auth';
    if (!emailVerified) return 'email-verification';
    // Profile is created inside onboarding now (no separate profile-setup) —
    // a social login without a completed profile lands here too.
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
