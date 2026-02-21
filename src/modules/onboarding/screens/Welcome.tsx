import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingProgressBar } from '../components/OnboardingProgressBar';

export default function Welcome() {
  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-onboarding"
        centerY={0.32}
        intensity={2}
        radius={0.3}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4">
            <OnboardingProgressBar step={1} />
          </View>

          {/* Content */}
          <View className="flex-1 items-center justify-center px-8">
            {/* Circle illustration with glow behind */}
            <View className="mb-10 h-[200px] w-[200px] items-center justify-center">
              {/* Warm glow behind */}
              <View
                className="absolute h-[160px] w-[160px] rounded-full"
                style={{
                  shadowColor: '#FF8D5C',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.25,
                  shadowRadius: 50,
                }}
              />

              {/* Single amber ring with blur */}
              <View
                className="h-[128px] w-[128px] items-center justify-center overflow-hidden rounded-full"
                style={{
                  borderWidth: 1.5,
                  borderColor: 'rgba(200,160,100,0.3)',
                  backgroundColor: 'rgba(200,160,100,0.15)',
                }}
              >
                <BlurView
                  intensity={30}
                  tint="dark"
                  className="absolute inset-0"
                />
                <MaskedView
                  maskElement={
                    <MaterialIcons name="graphic-eq" size={60} color="black" />
                  }
                >
                  <LinearGradient
                    colors={[
                      colors.primary.pink,
                      '#FF8D5C',
                      colors.accent.yellow,
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={{ width: 60, height: 60 }}
                  />
                </MaskedView>
              </View>

              {/* Floating accent dots */}
              <View
                className="absolute items-center justify-center"
                style={{ right: 14, top: 16 }}
              >
                {/* Outer soft glow */}
                <View
                  className="absolute h-[32px] w-[32px] rounded-full"
                  style={{
                    backgroundColor: `${colors.accent.yellow}25`,
                  }}
                />
                {/* Mid glow */}
                <View
                  className="absolute h-[20px] w-[20px] rounded-full"
                  style={{
                    backgroundColor: `${colors.accent.yellow}50`,
                  }}
                />
                {/* Core */}
                <View
                  className="h-[10px] w-[10px] rounded-full"
                  style={{ backgroundColor: colors.accent.yellow }}
                />
              </View>
              <View
                className="absolute h-[8px] w-[8px] rounded-full"
                style={{
                  backgroundColor: colors.primary.pink,
                  left: 18,
                  bottom: 42,
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 6,
                }}
              />
            </View>

            {/* Title */}
            <Text className="text-center text-[34px] font-extrabold leading-tight tracking-tight text-white">
              Let&apos;s get to know{'\n'}your nervous system
            </Text>
            <Text className="mt-4 text-center text-[17px] leading-relaxed text-white/60">
              Phobik works best when it understands your unique stressors.
              We&apos;ll help you find your balance.
            </Text>
          </View>

          {/* Footer */}
          <View className="items-center px-8 pb-8">
            <GradientButton
              onPress={() => router.push('/onboarding/life-stressors')}
            >
              Start
            </GradientButton>

            <Pressable
              onPress={() => router.push('/onboarding/completion')}
              className="mt-4 py-3"
            >
              <Text className="text-center text-base font-medium text-white/40">
                Skip for now
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
