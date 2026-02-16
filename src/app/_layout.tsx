import { DialogContainer } from '@/components/ui/DialogContainer';
import { colors } from '@/constants/colors';
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
import { asyncStoragePersister, queryClient } from '@/utils/query-client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect } from 'react';
import '../../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <RootNavigator />
      <DialogContainer />
    </PersistQueryClientProvider>
  );
}

function RootNavigator() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const isSignedOut = useAtomValue(isSignedOutAtom);
  const isReturningUser = useAtomValue(isReturningUserAtom);
  const setIsReturningUser = useSetAtom(isReturningUserAtom);
  const biometricPromptShown = useAtomValue(biometricPromptShownAtom);
  const { isAvailable: biometricAvailable } = useBiometricAvailability();

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
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;

  const needsEmailVerification = isAuthenticated && !emailVerified;
  const needsProfileSetup = isAuthenticated && !hasProfile;
  const needsBiometricSetup =
    isAuthenticated && !biometricPromptShown && biometricAvailable;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.dark },
      }}
    >
      {/* Auth screens - unauthenticated or soft-signed-out */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="account-creation" />
      </Stack.Protected>

      {/* Email verification - after signup, before profile/biometric/home */}
      <Stack.Protected guard={needsEmailVerification && !needsProfileSetup}>
        <Stack.Screen name="email-verification" />
      </Stack.Protected>

      {/* Profile setup - social auth users without profile */}
      <Stack.Protected guard={needsProfileSetup}>
        <Stack.Screen name="profile-setup" />
      </Stack.Protected>

      {/* Biometric setup - one-time after first auth */}
      <Stack.Protected
        guard={
          needsBiometricSetup && !needsProfileSetup && !needsEmailVerification
        }
      >
        <Stack.Screen name="biometric-setup" />
      </Stack.Protected>

      {/* Main app */}
      <Stack.Protected
        guard={
          isAuthenticated &&
          !needsBiometricSetup &&
          !needsProfileSetup &&
          !needsEmailVerification
        }
      >
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
