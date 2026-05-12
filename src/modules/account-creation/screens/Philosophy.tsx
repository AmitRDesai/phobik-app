import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ChakraFigure } from '../components/ChakraFigure';
import { StepCounter } from '@/components/ui/StepCounter';

const principles = [
  {
    number: '1)',
    title: 'Regulation before exposure',
    description: 'Calm the body then face your challenges.',
  },
  {
    number: '2)',
    title: 'Progress over perfection',
    description: 'Small wins rewire the brain.',
  },
  {
    number: '3)',
    title: 'Fear is energy that can be trained',
    description:
      "Fear isn't removed - it is redirected into courage and confidence.",
  },
];

export default function PhilosophyScreen() {
  return (
    <Screen
      variant="auth"
      scroll
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button
            onPress={() => router.push('/account-creation/age-selection')}
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            fullWidth
          >
            Next
          </Button>
          <StepCounter current={2} total={7} />
        </View>
      }
      className="px-screen-x pt-[68px]"
    >
      <Text size="display" align="center" className="tracking-tight">
        Phobik Philosophy
      </Text>
      <Text
        size="lg"
        tone="secondary"
        align="center"
        weight="medium"
        className="mt-3"
      >
        Phobik blends three major principles
      </Text>
      <View className="items-center justify-center py-6">
        <ChakraFigure />
      </View>
      <View>
        {principles.map((p) => (
          <View key={p.number} className="mb-3 flex-row">
            <Text size="h3" tone="accent" className="mr-3">
              {p.number}
            </Text>
            <Text size="md" className="flex-1 text-foreground/90">
              <Text size="md" weight="bold">
                {p.title}
              </Text>
              {' – '}
              {p.description}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
