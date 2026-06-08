import '@azure/core-asynciterator-polyfill';
import '@/lib/fetch-blob-fix';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DialogContainer } from '@/components/ui/DialogContainer';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { colors } from '@/constants/colors';
import useAppInitializer from '@/hooks/useAppInitializer';
import { useTheme } from '@/hooks/useTheme';
import { useNotificationScheduler } from '@/modules/notifications/hooks/useNotificationScheduler';
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
            <ThemeProvider>
              <RootNavigator />
              <DialogContainer />
              <ToastContainer />
              <ThemedSystemBars />
            </ThemeProvider>
          </PersistQueryClientProvider>
        </PowerSyncContext.Provider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function ThemedSystemBars() {
  const { scheme } = useTheme();
  return <SystemBars style={scheme === 'dark' ? 'light' : 'dark'} />;
}

function RootNavigator() {
  const { activeStack, isReady, isReturningUser } = useAppInitializer();
  const { scheme } = useTheme();

  // Schedule/cancel daily affirmation reminder based on user's notification setting
  useNotificationScheduler();
  usePushTokenRegistration();

  if (!isReady) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor:
            scheme === 'dark' ? colors.background.dark : '#FAFAFA',
        },
      }}
    >
      {/* Force-update gate — wins over every other stack when the binary is below minimum version */}
      <Stack.Protected guard={activeStack === 'update-required'}>
        <Stack.Screen name="update-required" />
      </Stack.Protected>

      {/* OTA-restart gate — full-screen lockout when a downloaded JS bundle is ready to apply */}
      <Stack.Protected guard={activeStack === 'ota-restart'}>
        <Stack.Screen name="ota-restart" />
      </Stack.Protected>

      {/* Unified onboarding — dual-mode. Shown pre-signup for new users
          (nested under !isReturningUser within the unauthenticated state; its
          final step is Create Account) and post-auth until onboarding is
          complete (social logins / interrupted email flow). Declared before
          `auth` so a brand-new user lands on Welcome while Sign In stays
          reachable. "Sign Up" on Sign In sets isReturningUser=false. */}
      <Stack.Protected
        guard={
          activeStack === 'onboarding' ||
          (activeStack === 'auth' && !isReturningUser)
        }
      >
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      {/* Auth screens — covers all unauthenticated states. Returning /
          signed-out users land here (Sign In, with Google/Apple). */}
      <Stack.Protected guard={activeStack === 'auth'}>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      {/* Email verification - after signup, before onboarding/biometric/home */}
      <Stack.Protected guard={activeStack === 'email-verification'}>
        <Stack.Screen name="email-verification" />
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
        <Stack.Screen name="daily-flow" />
      </Stack.Protected>
    </Stack>
  );
}
