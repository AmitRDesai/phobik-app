import { NebulaBg } from '@/components/onboarding/NebulaBg';
import { SteppingStones } from '@/components/onboarding/SteppingStones';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen3() {
  return (
    <View className="flex-1 bg-background-dark">
      {/* Light rays background */}
      <View className="absolute inset-0">
        <NebulaBg intensity={0.8} centerY={0.2} />
        {/* Ethereal top glow */}
        <LinearGradient
          colors={[
            `${colors.primary['pink-light']}30`,
            `${colors.accent['yellow-light']}10`,
            'transparent',
          ]}
          locations={[0, 0.4, 0.7]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '60%',
          }}
        />
      </View>

      <SafeAreaView className="relative z-10 flex-1" edges={['top', 'bottom']}>
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

            <ProgressDots total={4} current={3} />

            {/* Empty view for spacing */}
            <View className="w-10" />
          </View>

          {/* Main Content */}
          <View className="flex-1 items-center justify-center px-8">
            <SteppingStones />
          </View>

          {/* Bottom Content */}
          <View className="z-10 px-8 pb-6 pt-4">
            <View className="w-full max-w-sm gap-6 mx-auto">
              <View className="mb-6 items-center gap-4 text-center">
                <View className="items-center gap-1">
                  <Text className="text-center text-4xl font-extrabold leading-tight tracking-tight text-white">
                    Build Courage
                  </Text>
                  <MaskedView
                    maskElement={
                      <Text className="text-4xl font-extrabold">Daily</Text>
                    }
                  >
                    <LinearGradient
                      colors={[
                        colors.primary['pink-light'],
                        colors.accent['yellow-light'],
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text className="text-4xl font-extrabold opacity-0">
                        Daily
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </View>

                <Text className="mx-auto max-w-[280px] text-center text-lg font-medium leading-relaxed text-white/60">
                  Small steps, big transformation. Each mindfulness session
                  strengthens your resilience.
                </Text>
              </View>

              <GradientButton
                onPress={() => router.push('/onboarding/fourth')}
                icon={
                  <Ionicons name="chevron-forward" size={24} color="white" />
                }
              >
                Next
              </GradientButton>

              <View className="items-center">
                <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                  Step 3 of 4
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
