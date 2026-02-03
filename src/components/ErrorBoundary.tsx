import { colors } from '@/constants/colors';
import { type ErrorBoundaryProps } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Text } from 'react-native';
import Button from './ui/Button';
import Container from './ui/Container';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Container className="justify-center items-center">
      <SymbolView
        name="exclamationmark.triangle"
        size={44}
        tintColor={colors.red[500]}
        resizeMode="scaleAspectFill"
      />
      <Text className="text-center text-lg mt-4 text-neutral-700">
        Something broke, please reload the app!
      </Text>
      <Text className="mt-2 mb-4 text-neutral-500">{error.message}</Text>
      <Button onPress={retry}>
        <Text className="text-white">Try again</Text>
      </Button>
    </Container>
  );
}
