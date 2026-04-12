import '@azure/core-asynciterator-polyfill';
import { DialogContainer } from '@/components/ui/DialogContainer';
import { colors } from '@/constants/colors';
import useAppInitializer from '@/hooks/useAppInitializer';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import { usePushTokenRegistration } from '@/hooks/usePushTokenRegistration';
import { setupNotificationHandler } from '@/lib/notifications';
import { powersync } from '@/lib/powersync';
import '@/utils/ease-nativewind';
import { asyncStoragePersister, queryClient } from '@/utils/query-client';
import { PowerSyncContext } from '@powersync/react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SystemBars } from 'react-native-edge-to-edge';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import '../../global.css';

SplashScreen.preventAutoHideAsync();
setupNotificationHandler();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <PowerSyncContext.Provider value={powersync}>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
          >
            <RootNavigator />
            <DialogContainer />
            <SystemBars style="light" />
          </PersistQueryClientProvider>
        </PowerSyncContext.Provider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { activeStack, isReady, isReturningUser } = useAppInitializer();

  // Schedule/cancel daily affirmation reminder based on user's notification setting
  useNotificationScheduler();
  usePushTokenRegistration();

  if (!isReady) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.dark },
      }}
    >
      {/* Auth screens — outer guard covers all unauthenticated states.
          Inner nested guard (!isReturningUser) makes account-creation the
          initial screen for new users. When returning, account-creation is
          removed and auth (Sign In) becomes the fallback. "Sign Up" on
          Sign In sets isReturningUserAtom=false to re-enable account-creation. */}
      <Stack.Protected guard={activeStack === 'auth'}>
        <Stack.Protected guard={!isReturningUser}>
          <Stack.Screen name="account-creation" />
        </Stack.Protected>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      {/* Email verification - after signup, before profile/biometric/home */}
      <Stack.Protected guard={activeStack === 'email-verification'}>
        <Stack.Screen name="email-verification" />
      </Stack.Protected>

      {/* Profile setup - social auth users without profile */}
      <Stack.Protected guard={activeStack === 'profile-setup'}>
        <Stack.Screen name="profile-setup" />
      </Stack.Protected>

      {/* Onboarding - after profile setup, before biometric */}
      <Stack.Protected guard={activeStack === 'onboarding'}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      {/* Biometric setup - one-time after first auth */}
      <Stack.Protected guard={activeStack === 'biometric-setup'}>
        <Stack.Screen name="biometric-setup" />
      </Stack.Protected>

      {/* Main app */}
      <Stack.Protected guard={activeStack === 'home'}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="journal" />
        <Stack.Screen name="affirmation" />
        <Stack.Screen name="community/create" />
        <Stack.Screen name="notifications" />
      </Stack.Protected>
    </Stack>
  );
}
