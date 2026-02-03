import { colors } from '@/constants/colors';
import { onboardingCompletedAtom } from '@/store/onboarding';
import { asyncStoragePersister, queryClient } from '@/utils/query-client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { useAtomValue } from 'jotai';
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

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.dark },
      }}
    >
      <Stack.Protected guard={onboardingCompleted}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="index" />
      </Stack.Protected>

      <Stack.Protected guard={!onboardingCompleted}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
    </Stack>
  );
}
