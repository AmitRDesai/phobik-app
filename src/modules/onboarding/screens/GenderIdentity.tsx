import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '../components/ProgressBar';
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
    <View className="flex-1 bg-background-charcoal">
      {/* Decorative blur circles */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.background.dark },
        ]}
      >
        <View
          style={{
            position: 'absolute',
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: colors.primary.pink,
            opacity: 0.08,
            top: -60,
            right: -60,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.accent.yellow,
            opacity: 0.05,
            bottom: 100,
            left: -60,
          }}
        />
      </View>

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="px-8 pb-2 pt-6">
            <View className="mb-4 flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="mr-4 h-10 w-10 items-start justify-center"
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color="rgba(255,255,255,0.5)"
                />
              </Pressable>
            </View>
            <ProgressBar current={2} total={6} label="Onboarding Step" />
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1 px-8"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-8 mt-6">
              <Text className="text-3xl font-black tracking-tight text-white">
                How do you identify?
              </Text>
              <Text className="mt-3 text-base leading-relaxed text-white/60">
                This data helps us personalize your mental health journey with
                supportive, tailored care.
              </Text>
            </View>

            <View className="gap-3">
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

          {/* Footer */}
          <View className="px-8 pb-10 pt-4">
            <GradientButton
              onPress={() => router.push('/onboarding/goal-selection')}
              disabled={selectedGender === null}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Continue
            </GradientButton>
            <Text className="mt-4 text-center text-xs leading-relaxed text-white/30">
              Your data is encrypted and never shared with third parties.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
