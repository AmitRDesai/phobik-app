import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NebulaBg } from '../components/NebulaBg';
import { SelectionCard } from '../components/SelectionCard';
import { type AgeRange, selectedAgeAtom } from '../store/onboarding';

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-54', label: '45–54' },
  { value: '55+', label: '55+' },
];

export default function AgeSelectionScreen() {
  const [selectedAge, setSelectedAge] = useAtom(selectedAgeAtom);

  return (
    <View className="flex-1 bg-background-charcoal">
      <NebulaBg intensity={0.6} centerY={0.3} />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-8 pb-4 pt-6">
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
            <ProgressDots total={4} current={1} />
            <View className="w-10" />
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1 px-8"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-8 mt-4">
              <Text className="text-3xl font-black tracking-tight text-white">
                What age range do you fall into?
              </Text>
              <Text className="mt-3 text-base leading-relaxed text-white/60">
                Select your age range to personalize your journey.
              </Text>
            </View>

            <View className="gap-3">
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

          {/* Footer */}
          <View className="px-8 pb-10 pt-4">
            <GradientButton
              onPress={() => router.push('/onboarding/gender-identity')}
              disabled={selectedAge === null}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Continue
            </GradientButton>
            <View className="mt-6 items-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                Step 1 of 6
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
