import { colors } from '@/constants/colors';
import { useSession } from '@/lib/auth';
import {
  biometricPromptShownAtom,
  isSignedOutAtom,
} from '@/modules/auth/store/biometric';
import { useBiometricAvailability } from '@/modules/auth/hooks/useBiometric';
import { onboardingCompletedAtom } from '@/modules/onboarding/store/onboarding';
import { asyncStoragePersister, queryClient } from '@/utils/query-client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { useAtomValue } from 'jotai';
import { ActivityIndicator, View } from 'react-native';
import '../../global.css';

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <RootNavigator />
    </PersistQueryClientProvider>
  );
}

function RootNavigator() {
  const onboardingCompleted = useAtomValue(onboardingCompletedAtom);
  const { data: session, isPending: isSessionLoading } = useSession();
  const biometricPromptShown = useAtomValue(biometricPromptShownAtom);
  const isSignedOut = useAtomValue(isSignedOutAtom);
  const { isAvailable: biometricAvailable } = useBiometricAvailability();

  const hasSession = !!session?.session;
  const isAuthenticated = hasSession && !isSignedOut;
  const needsBiometricSetup =
    isAuthenticated && !biometricPromptShown && biometricAvailable;

  // Show loading state while checking session
  if (isSessionLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-dark">
        <ActivityIndicator size="large" color={colors.primary.pink} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.dark },
      }}
    >
      {/* Onboarding flow - new unauthenticated users only */}
      <Stack.Protected guard={!hasSession && !onboardingCompleted}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      {/* Auth screens - unauthenticated or soft-signed-out */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      {/* Biometric setup - one-time after first auth */}
      <Stack.Protected guard={needsBiometricSetup}>
        <Stack.Screen name="biometric-setup" />
      </Stack.Protected>

      {/* Main app */}
      <Stack.Protected guard={isAuthenticated && !needsBiometricSetup}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
