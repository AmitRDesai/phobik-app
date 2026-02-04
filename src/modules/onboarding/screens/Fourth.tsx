import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrophyIcon } from '@/components/icons/TrophyIcon';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { colors } from '@/constants/colors';
import { NebulaBg } from '../components/NebulaBg';

export default function OnboardingScreen4() {
  const handleGetStarted = () => {
    router.push('/onboarding/age-selection');
  };

  return (
    <View className="flex-1 bg-background-charcoal">
      <NebulaBg intensity={1} centerY={0.5} />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="z-50 flex-row items-center justify-between px-8 pb-6 pt-6">
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

            <View className="flex-row items-center gap-2">
              <View
                className="h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary.pink }}
              >
                <Ionicons name="bulb" size={14} color="white" />
              </View>
              <Text className="text-lg font-extrabold tracking-tighter text-white">
                PHOBIK
              </Text>
            </View>

            {/* Empty view for spacing */}
            <View className="w-10" />
          </View>

          {/* Main Content */}
          <View className="relative flex-1 items-center justify-center px-8">
            <View className="mb-12">
              <TrophyIcon />
            </View>

            <View className="z-10 mx-auto max-w-sm gap-4 text-center">
              <Text className="text-center text-4xl font-black tracking-tight text-white">
                Celebrate Victories
              </Text>
              <Text className="text-center text-lg font-medium leading-relaxed text-white/70">
                Every step forward matters. Unlock achievements as you build
                your fearless mindset.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="z-50 w-full gap-8 px-8 pb-12 pt-6">
            <View className="items-center justify-center">
              <ProgressDots total={4} current={4} />
            </View>

            <GradientButton
              onPress={handleGetStarted}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Get Started
            </GradientButton>

            <View className="items-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                Step 4 of 4
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
