import { MandalaIcon } from '@/components/icons/MandalaIcon';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg } from '@/components/ui/GlowBg';

export default function WelcomeScreen() {
  return (
    <View className="flex-1">
      <GlowBg centerY={0.38} />
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

              <Text className="text-center text-lg font-semibold text-white">
                Train your mind. Strengthen your nervous system.
              </Text>

              <Text className="text-center text-lg font-semibold text-white">
                Build the courage to live bigger than your fears.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="w-full max-w-sm gap-6">
            <View className="items-center">
              <ProgressDots total={7} current={1} />
            </View>
            <GradientButton
              onPress={() => router.push('/account-creation/second')}
              icon={<Ionicons name="chevron-forward" size={24} color="white" />}
            >
              Next
            </GradientButton>

            <Link href="/auth/sign-in" replace className="mt-6 py-2">
              <Text className="text-center text-sm text-white/50">
                Already have an account?{' '}
                <Text className="font-bold text-accent-purple">Sign In</Text>
              </Text>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
