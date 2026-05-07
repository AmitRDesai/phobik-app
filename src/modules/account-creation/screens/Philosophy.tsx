import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ChakraFigure } from '../components/ChakraFigure';

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
      header={<Header center={<ProgressDots total={7} current={2} />} />}
      sticky={
        <View className="items-center">
          <GradientButton
            onPress={() => router.push('/account-creation/age-selection')}
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
          >
            Next
          </GradientButton>
          <Text
            variant="caption"
            muted
            className="mt-3 tracking-[0.2em]"
            style={{ paddingRight: 2.2 }}
          >
            Step 2 of 7
          </Text>
        </View>
      }
      className="px-8 pt-2"
    >
      <Text variant="display" className="text-center tracking-tight">
        Phobik Philosophy
      </Text>
      <Text variant="lg" muted className="mt-3 text-center font-medium">
        Phobik blends three major principles
      </Text>
      <View className="items-center justify-center py-6">
        <ChakraFigure />
      </View>
      <View>
        {principles.map((p) => (
          <View key={p.number} className="mb-3 flex-row">
            <Text variant="h3" className="mr-3 text-primary-pink">
              {p.number}
            </Text>
            <Text variant="md" className="flex-1 text-foreground/90">
              <Text variant="md" className="font-bold">
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
