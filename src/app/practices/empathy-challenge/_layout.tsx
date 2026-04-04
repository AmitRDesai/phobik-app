import { Stack } from 'expo-router';

import { colors } from '@/constants/colors';

export default function EmpathyChallengeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.charcoal },
      }}
    />
  );
}
