import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { alpha, colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingProgressBar } from '../components/OnboardingProgressBar';
import { useCompleteOnboarding } from '../hooks/useCompleteOnboarding';
import { useSaveOnboardingAnswers } from '../hooks/useSaveOnboardingAnswers';
import { onboardingDataAtom, resetOnboardingAtom } from '../store/onboarding';

export default function Completion() {
  const completeOnboarding = useCompleteOnboarding();
  const saveOnboardingAnswers = useSaveOnboardingAnswers();
  const onboardingData = useAtomValue(onboardingDataAtom);
  const resetOnboarding = useSetAtom(resetOnboardingAtom);

  const { skipped } = useLocalSearchParams();
  const isSkipped = skipped === 'true';

  const isPending =
    saveOnboardingAnswers.isPending || completeOnboarding.isPending;

  const handleGoToToday = async () => {
    try {
      await saveOnboardingAnswers.mutateAsync(onboardingData);
      await completeOnboarding.mutateAsync({});
      resetOnboarding();
    } catch {
      dialog.error({
        title: 'Something went wrong',
        message: 'We couldn\u2019t save your answers. Please try again.',
      });
    }
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-onboarding"
        centerY={0.4}
        intensity={2}
        radius={0.4}
        startColor={colors.gradient['bright-orange']}
        endColor={colors.gradient['hot-pink']}
      />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {!isSkipped && (
            <>
              {/* Header: Progress bar at 100% */}
              <View className="px-10 pt-4">
                <OnboardingProgressBar step={8} />
              </View>

              {/* Step indicator */}
              <View className="mt-3 flex-row items-center justify-center gap-2">
                <Text className="text-sm font-medium text-white/40">
                  Onboarding Complete
                </Text>
                <Text className="text-sm font-bold text-[#FF8C37]">100%</Text>
              </View>
            </>
          )}

          {/* Center content */}
          <View className="flex-1 items-center justify-center px-8">
            {/* Victory circle */}
            <View className="mb-10 items-center justify-center">
              {/* Outer decorative circle */}
              <View className="absolute h-64 w-64 rounded-full border border-[#FF8C37]/20" />
              {/* Middle decorative circle */}
              <View className="absolute h-52 w-52 rounded-full border border-primary-pink/10" />

              {/* Main orb - solid gradient */}
              <LinearGradient
                colors={[
                  colors.gradient['hot-pink'],
                  colors.gradient['bright-orange'],
                  colors.gradient['light-gold'],
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 192,
                  height: 192,
                  borderRadius: 9999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: colors.gradient['bright-orange'],
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 60,
                }}
              >
                {/* Inner ring */}
                <View className="h-40 w-40 items-center justify-center rounded-full border-2 border-white/30 bg-white/5">
                  {/* Innermost ring */}
                  <View className="h-32 w-32 items-center justify-center rounded-full border border-white/20">
                    <MaterialIcons
                      name="check-circle"
                      size={64}
                      color="white"
                    />
                  </View>
                </View>
              </LinearGradient>

              {/* Floating dots */}
              <View
                className="absolute -right-2 top-8 h-4 w-4 rounded-full"
                style={{ backgroundColor: `${colors.accent.yellow}66` }}
              />
              <View
                className="absolute -left-1 bottom-12 h-6 w-6 rounded-full"
                style={{ backgroundColor: `${colors.primary.pink}4D` }}
              />
              <View
                className="absolute left-6 top-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: alpha.white40 }}
              />
            </View>

            {/* Title */}
            <Text className="text-center text-4xl font-extrabold tracking-tight text-white">
              You&apos;re set.
            </Text>
            <Text className="mt-4 max-w-[280px] text-center text-lg font-medium text-white/40">
              Phobik will meet you where you are and adapt as you go.
            </Text>
          </View>

          {/* Footer */}
          <View className="items-center px-8 pb-8">
            <GradientButton
              onPress={handleGoToToday}
              loading={isPending}
              icon={
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              }
            >
              Go to Today
            </GradientButton>

            <Text className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
              Your journey starts now
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
