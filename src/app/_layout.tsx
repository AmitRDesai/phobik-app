import { colors } from '@/constants/colors';
import { useSession } from '@/lib/auth';
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

  const isAuthenticated = !!session?.session;

  // Show loading state while checking session
  if (isSessionLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background.dark,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
      {/* Onboarding flow - shown first if not completed */}
      <Stack.Protected guard={!onboardingCompleted}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      {/* Auth screens - shown if not authenticated */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      {/* Main app - shown only when onboarding completed AND authenticated */}
      <Stack.Protected guard={onboardingCompleted && isAuthenticated}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
