import { ChakraFigure } from '@/components/onboarding/ChakraFigure';
import { NebulaBg } from '@/components/onboarding/NebulaBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen2() {
  return (
    <View className="flex-1">
      <NebulaBg intensity={0.6} centerY={0.5} />
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

            <ProgressDots total={4} current={2} />

            {/* Empty view for spacing */}
            <View className="w-10" />
          </View>

          {/* Main Content */}
          <View className="relative flex-1 items-center justify-center overflow-hidden px-8">
            <ChakraFigure />
          </View>

          {/* Bottom Content */}
          <View className="z-10 px-8 pb-12 pt-4">
            <View className="mb-10 text-center">
              <Text className="mb-4 text-center text-4xl font-extrabold tracking-tight text-white">
                Ground Yourself
              </Text>
              <Text className="mx-auto max-w-xs text-center text-lg font-medium leading-relaxed text-white/60">
                Break the cycle of anxious thoughts. Use the{' '}
                <Text className="font-semibold text-primary-pink">
                  5-4-3-2-1 technique
                </Text>{' '}
                to anchor yourself in the present moment.
              </Text>
            </View>

            <GradientButton
              onPress={() => router.push('/onboarding/third')}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Next
            </GradientButton>

            <View className="mt-6 items-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                Step 2 of 4
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
