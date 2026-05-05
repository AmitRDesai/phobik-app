import { useSession } from '@/hooks/auth/useAuth';
import { connectPowerSync, disconnectPowerSync } from '@/lib/powersync';
import { useBiometricAvailability } from '@/hooks/auth/useBiometric';
import { useProfileStatus } from '@/hooks/auth/useProfile';
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
  | 'profile-setup'
  | 'onboarding'
  | 'biometric-setup'
  | 'home';

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

  const rawActiveStack = ((): ActiveStack => {
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
