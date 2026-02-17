import { useSession } from '@/lib/auth';
import { questionnaireAtom } from '@/modules/account-creation/store/account-creation';
import { useBiometricAvailability } from '@/modules/auth/hooks/useBiometric';
import {
  useProfileStatus,
  useSaveProfile,
} from '@/modules/auth/hooks/useProfile';
import {
  biometricPromptShownAtom,
  isSignedOutAtom,
} from '@/modules/auth/store/biometric';
import { isReturningUserAtom } from '@/store/user';
import * as SplashScreen from 'expo-splash-screen';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect, useState } from 'react';
import '../../global.css';

const useAppInitializer = () => {
  const { data: session, isPending: isSessionLoading } = useSession();
  const isSignedOut = useAtomValue(isSignedOutAtom);
  const isReturningUser = useAtomValue(isReturningUserAtom);
  const setIsReturningUser = useSetAtom(isReturningUserAtom);
  const biometricPromptShown = useAtomValue(biometricPromptShownAtom);
  const { isAvailable: biometricAvailable } = useBiometricAvailability();
  const [isLoading, setIsLoading] = useState(true);

  const hasSession = !!session?.session;
  const isAuthenticated = hasSession && !isSignedOut;
  const emailVerified = session?.user?.emailVerified ?? true;

  // Once authenticated, mark as returning user permanently
  useEffect(() => {
    if (isAuthenticated && !isReturningUser) setIsReturningUser(true);
  }, [isAuthenticated, isReturningUser, setIsReturningUser]);

  // Backend profile state via oRPC + React Query
  const { data: profileStatus, isPending: isProfileChecking } =
    useProfileStatus(isAuthenticated);
  const hasProfile = profileStatus?.hasProfile ?? false;
  const saveProfile = useSaveProfile();
  const store = useStore();

  // Auto-recovery: if backend has no profile but local questionnaire data exists, re-save
  useEffect(() => {
    if (!isAuthenticated || isProfileChecking || hasProfile) return;

    (async () => {
      const questionnaire = await store.get(questionnaireAtom);
      if (questionnaire.age && questionnaire.termsAcceptedAt) {
        saveProfile.mutate(
          {
            ageRange: questionnaire.age,
            genderIdentity: questionnaire.gender,
            goals: questionnaire.goals,
            termsAcceptedAt: questionnaire.termsAcceptedAt,
            privacyAcceptedAt: questionnaire.privacyAcceptedAt,
          },
          {
            onSuccess: () => store.set(questionnaireAtom, RESET),
          },
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isProfileChecking, hasProfile]);

  const isReady = !isSessionLoading && (!isAuthenticated || !isProfileChecking);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
      setIsLoading(false);
    }
  }, [isReady]);

  const needsEmailVerification = isAuthenticated && !emailVerified;
  const needsProfileSetup = isAuthenticated && !hasProfile;
  const needsBiometricSetup =
    isAuthenticated && !biometricPromptShown && biometricAvailable;

  return {
    isAuthenticated,
    needsBiometricSetup,
    needsProfileSetup,
    needsEmailVerification,
    isReady,
    isLoading,
  };
};

export default useAppInitializer;
