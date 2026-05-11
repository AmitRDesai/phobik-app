import { colors } from '@/constants/colors';
import { type ErrorBoundaryProps } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text } from './themed/Text';
import { Button } from './ui/Button';
import { Screen } from './ui/Screen';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Screen className="flex-1 items-center justify-center px-screen-x">
      <SymbolView
        name="exclamationmark.triangle"
        size={44}
        tintColor={colors.red[500]}
        resizeMode="scaleAspectFill"
      />
      <Text size="lg" tone="tertiary" align="center" className="mt-4">
        Something broke, please reload the app!
      </Text>
      <Text size="md" tone="secondary" className="mt-2 mb-4">
        {error.message}
      </Text>
      <Button onPress={retry}>Try again</Button>
    </Screen>
  );
}
