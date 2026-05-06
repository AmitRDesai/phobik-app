import { colors } from '@/constants/colors';
import { type ErrorBoundaryProps } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './ui/Button';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-surface">
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
    </SafeAreaView>
  );
}
