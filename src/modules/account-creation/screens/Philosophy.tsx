import { Header } from '@/components/ui/Header';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Screen } from '@/components/ui/Screen';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/themed/Text';
import { View } from 'react-native';
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
      header={<Header center={<ProgressDots total={7} current={2} />} />}
      sticky={
        <View className="items-center">
          <GradientButton
            onPress={() => router.push('/account-creation/age-selection')}
            icon={<Ionicons name="arrow-forward" size={24} color="white" />}
          >
            Next
          </GradientButton>
          <Text className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/55">
            Step 2 of 7
          </Text>
        </View>
      }
      className="px-8 pt-2"
    >
      <Text className="text-center text-4xl font-extrabold tracking-tight text-foreground">
        Phobik Philosophy
      </Text>
      <Text className="mt-3 text-center text-lg font-medium text-foreground/70">
        Phobik blends three major principles
      </Text>
      <View className="flex-1 items-center justify-center py-6">
        <ChakraFigure />
      </View>
      <View>
        {principles.map((p) => (
          <View key={p.number} className="mb-3 flex-row">
            <Text className="mr-3 text-lg font-bold text-primary-pink">
              {p.number}
            </Text>
            <Text className="flex-1 text-[15px] text-foreground/90">
              <Text className="font-bold text-foreground">{p.title}</Text>
              {' – '}
              {p.description}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
