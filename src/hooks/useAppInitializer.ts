import { useSession } from '@/lib/auth';
import { connectPowerSync, disconnectPowerSync } from '@/lib/powersync';
import { useBiometricAvailability } from '@/modules/auth/hooks/useBiometric';
import { useProfileStatus } from '@/modules/auth/hooks/useProfile';
import {
  biometricPromptShownAtom,
  isSignedOutAtom,
} from '@/modules/auth/store/biometric';
import { isReturningUserAtom } from '@/store/user';
import * as SplashScreen from 'expo-splash-screen';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
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

  // Connect/disconnect PowerSync based on auth state
  useEffect(() => {
    if (isAuthenticated) {
      connectPowerSync().catch(console.error);
    } else if (!isSessionLoading) {
      disconnectPowerSync().catch(console.error);
    }
  }, [isAuthenticated, isSessionLoading]);

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
