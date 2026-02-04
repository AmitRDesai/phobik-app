import { MandalaIcon } from '@/components/icons/MandalaIcon';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NebulaBg } from '../components/NebulaBg';

export default function OnboardingScreen1() {
  return (
    <View className="flex-1">
      <NebulaBg intensity={0.5} centerY={0.4} />
      <SafeAreaView className="flex-1 px-8" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-between py-6">
          {/* Content */}
          <View className="flex-1 items-center justify-center">
            {/* Mandala Icon */}
            <View className="mb-12">
              <MandalaIcon size={288} animated />
            </View>

            {/* Text Content */}
            <View className="items-center gap-4">
              <View className="flex-row flex-wrap items-center justify-center">
                <Text className="text-center text-4xl font-extrabold tracking-tight text-white">
                  Welcome to{' '}
                </Text>
                <MaskedView
                  maskElement={
                    <Text className="text-4xl font-extrabold">PHOBIK</Text>
                  }
                >
                  <LinearGradient
                    colors={[colors.primary.pink, colors.accent.yellow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text className="text-4xl font-extrabold opacity-0">
                      PHOBIK
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </View>

              <Text className="text-center text-lg font-medium leading-relaxed text-white/70">
                Overcome fears through mindfulness.
              </Text>

              <Text className="mx-auto max-w-[280px] text-center text-sm leading-relaxed text-white/40">
                Transform anxiety and fear into calm confidence.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="w-full max-w-sm gap-10">
            <View className="items-center">
              <ProgressDots total={4} current={1} />
            </View>
            <GradientButton
              onPress={() => router.push('/onboarding/second')}
              icon={<Ionicons name="chevron-forward" size={24} color="white" />}
            >
              Next
            </GradientButton>

            <View className="items-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                Step 1 of 4
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
