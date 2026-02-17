import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg } from '@/components/ui/GlowBg';
import { SelectionCard } from '../components/SelectionCard';
import { type AgeRange, questionnaireAgeAtom } from '../store/account-creation';

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-54', label: '45–54' },
  { value: '55+', label: '55+' },
];

export default function AgeSelectionScreen() {
  const [selectedAge, setSelectedAge] = useAtom(questionnaireAgeAtom);
  const pathname = usePathname();
  const isProfileSetup = pathname.startsWith('/profile-setup');

  const totalSteps = isProfileSetup ? 5 : 7;
  const currentStep = isProfileSetup ? 1 : 3;
  const nextRoute = isProfileSetup
    ? '/profile-setup/gender-identity'
    : '/account-creation/gender-identity';

  return (
    <View className="flex-1">
      <GlowBg centerY={0.05} intensity={0.75} radius={0.35} />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="z-20 flex-row items-center justify-between px-6 pb-4 pt-8">
            {isProfileSetup ? (
              <View className="w-10" />
            ) : (
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
            )}
            <ProgressDots total={totalSteps} current={currentStep} />
            <View className="w-10" />
          </View>

          {/* Title + Subtitle */}
          <View className="px-8">
            <Text className="text-center text-3xl font-extrabold tracking-tight text-white">
              What age range do you fall into?
            </Text>
            <Text className="mt-3 text-center text-sm text-white/60">
              Select your age range to personalize your journey.
            </Text>
          </View>

          {/* Content */}
          <ScrollFade>
            <ScrollView
              className="flex-1 px-8"
              contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
              showsVerticalScrollIndicator={false}
            >
              <View className="mt-8 gap-4">
                {AGE_OPTIONS.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    selected={selectedAge === option.value}
                    onPress={() => setSelectedAge(option.value)}
                    variant="radio"
                  />
                ))}
              </View>
            </ScrollView>
          </ScrollFade>

          {/* Footer */}
          <View className="z-10 px-8 pb-8">
            <GradientButton
              onPress={() => router.push(nextRoute)}
              disabled={selectedAge === null}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Next
            </GradientButton>
            <View className="mt-3 items-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                Step {currentStep} of {totalSteps}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
