import { isReturningUserAtom } from '@/store/user';
import { Stack } from 'expo-router';
import { useAtomValue } from 'jotai';

export default function AuthLayout() {
  const returningUser = useAtomValue(isReturningUserAtom);

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={returningUser ? 'sign-in' : 'create-account'}
    >
      <Stack.Screen name="create-account" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen
        name="terms-of-service"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </Stack>
  );
}
