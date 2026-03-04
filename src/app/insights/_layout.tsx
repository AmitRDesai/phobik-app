import { colors } from '@/constants/colors';
import { Stack } from 'expo-router';

export default function InsightsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.dashboard },
      }}
    />
  );
}
