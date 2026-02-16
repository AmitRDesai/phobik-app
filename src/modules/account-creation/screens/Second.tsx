import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChakraFigure } from '../components/ChakraFigure';
import { GlowBg } from '../components/GlowBg';

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
    <View className="flex-1">
      <GlowBg intensity={0} />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="z-20 flex-row items-center justify-between px-6 pb-4 pt-8">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-start justify-center"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color="rgba(255,255,255,0.5)"
              />
            </Pressable>

            <ProgressDots total={7} current={2} />

            {/* Empty view for spacing */}
            <View className="w-10" />
          </View>

          {/* Title + Subtitle */}
          <View className="px-8">
            <Text className="text-center text-4xl font-extrabold tracking-tight text-white">
              Phobik Philosophy
            </Text>
            <Text className="mt-3 text-center text-lg font-medium text-white/70">
              Phobik blends three major principles
            </Text>
          </View>

          {/* Chakra Figure */}
          <View className="flex-1 items-center justify-center px-8">
            <ChakraFigure />
          </View>

          {/* Principles */}
          <View className="px-8 pb-4">
            {principles.map((p) => (
              <View key={p.number} className="mb-3 flex-row">
                <Text className="mr-3 text-lg font-bold text-primary-pink">
                  {p.number}
                </Text>
                <Text className="flex-1 text-[15px] text-white/90">
                  <Text className="font-bold text-white">{p.title}</Text>
                  {' – '}
                  {p.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View className="z-10 px-8 pb-8">
            <GradientButton
              onPress={() => router.push('/account-creation/age-selection')}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Next
            </GradientButton>

            <View className="mt-3 items-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                Step 2 of 7
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
