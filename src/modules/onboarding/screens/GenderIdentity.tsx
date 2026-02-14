import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg } from '../components/GlowBg';
import { SelectionCard } from '../components/SelectionCard';
import { type GenderIdentity, selectedGenderAtom } from '../store/onboarding';

const GENDER_OPTIONS: {
  value: GenderIdentity;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: 'female', label: 'Female', icon: 'female' },
  { value: 'male', label: 'Male', icon: 'male' },
  { value: 'non-binary', label: 'Non-binary', icon: 'transgender' },
  {
    value: 'prefer-not-to-say',
    label: 'Prefer not to say',
    icon: 'eye-off-outline',
  },
];

export default function GenderIdentityScreen() {
  const [selectedGender, setSelectedGender] = useAtom(selectedGenderAtom);

  return (
    <View className="flex-1">
      <GlowBg centerX={0.85} centerY={0.0} intensity={0.75} radius={0.35} />
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
            <ProgressDots total={7} current={4} />
            <View className="w-10" />
          </View>

          {/* Title + Subtitle */}
          <View className="px-8">
            <Text className="text-center text-3xl font-extrabold tracking-tight text-white">
              How do you identify?
            </Text>
            <Text className="mt-3 text-center text-sm text-white/60">
              This data helps us personalize your mental health journey with
              supportive, tailored care.
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
                {GENDER_OPTIONS.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    selected={selectedGender === option.value}
                    onPress={() => setSelectedGender(option.value)}
                    variant="radio"
                    icon={
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={colors.primary.pink}
                      />
                    }
                  />
                ))}
              </View>
            </ScrollView>
          </ScrollFade>

          {/* Footer */}
          <View className="z-10 px-8 pb-8">
            <GradientButton
              onPress={() => router.push('/onboarding/goal-selection')}
              disabled={selectedGender === null}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Continue
            </GradientButton>
            <View className="mt-3 items-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                Step 4 of 7
              </Text>
            </View>
            <Text className="mt-3 text-center text-xs text-white/30">
              PHOBIK values your privacy. Your data is encrypted and used only
              to enhance your experience.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
