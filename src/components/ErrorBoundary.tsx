import { colors } from '@/constants/colors';
import { type ErrorBoundaryProps } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { Button } from './ui/Button';
import { Screen } from './ui/Screen';
import { Text } from '@/components/themed/Text';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Screen className="flex-1 items-center justify-center px-screen-x">
      <SymbolView
        name="exclamationmark.triangle"
        size={44}
        tintColor={colors.red[500]}
        resizeMode="scaleAspectFill"
      />
      <Text className="text-center text-lg mt-4 text-foreground/30">
        Something broke, please reload the app!
      </Text>
      <Text className="mt-2 mb-4 text-foreground/55">{error.message}</Text>
      <Button onPress={retry}>
        <Text className="text-white">Try again</Text>
      </Button>
    </Screen>
  );
}
