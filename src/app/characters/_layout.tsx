import { Stack } from 'expo-router';

export default function CharactersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Transparent so each screen's own bg-surface (theme-aware) shows
        // through. Legacy layouts hardcoded colors.background.dashboard which
        // breaks light mode.
        contentStyle: { backgroundColor: 'transparent' },
      }}
    />
  );
}
