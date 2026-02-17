import { DialogContainer } from '@/components/ui/DialogContainer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/colors';
import useAppInitializer from '@/hooks/useAppInitializer';
import { asyncStoragePersister, queryClient } from '@/utils/query-client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
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
  const {
    isAuthenticated,
    needsBiometricSetup,
    needsProfileSetup,
    needsEmailVerification,
    isLoading,
    isReady,
  } = useAppInitializer();

  if (isLoading) return null;
  if (!isReady) return <LoadingScreen />;

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
