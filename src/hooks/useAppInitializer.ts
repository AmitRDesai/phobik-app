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
import { useEffect, useRef, useState } from 'react';
import '../../global.css';

type ActiveStack =
  | 'auth'
  | 'email-verification'
  | 'profile-setup'
  | 'onboarding'
  | 'biometric-setup'
  | 'home';

function computeActiveStack(
  isAuthenticated: boolean,
  hasProfile: boolean,
  emailVerified: boolean,
  onboardingCompleted: boolean,
  biometricPromptShown: boolean,
  biometricAvailable: boolean,
): ActiveStack {
  if (!isAuthenticated) return 'auth';
  if (!hasProfile) return 'profile-setup';
  if (!emailVerified) return 'email-verification';
  if (!onboardingCompleted) return 'onboarding';
  if (!biometricPromptShown && biometricAvailable) return 'biometric-setup';
  return 'home';
}

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

  // Backend profile state via oRPC + React Query
  const { data: profileStatus, isPending: isProfileChecking } =
    useProfileStatus(isAuthenticated);
  const hasProfile = profileStatus?.hasProfile ?? false;
  const onboardingCompleted = profileStatus?.onboardingCompleted ?? false;
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

  const dataResolved =
    !isSessionLoading && (!isAuthenticated || !isProfileChecking);

  useEffect(() => {
    if (dataResolved) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [dataResolved]);

  const rawActiveStack = computeActiveStack(
    isAuthenticated,
    hasProfile,
    emailVerified,
    onboardingCompleted,
    biometricPromptShown,
    biometricAvailable,
  );

  // Only emit activeStack once data resolves — holds the initial value until ready
  const activeStackRef = useRef(rawActiveStack);
  if (dataResolved) {
    activeStackRef.current = rawActiveStack;
  }
  const activeStack = activeStackRef.current;

  return {
    activeStack,
    isReady,
  };
};

export type { ActiveStack };
export default useAppInitializer;
