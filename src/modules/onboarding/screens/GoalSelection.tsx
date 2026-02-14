import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg } from '../components/GlowBg';
import { SelectionCard } from '../components/SelectionCard';
import { type Goal, selectedGoalsAtom } from '../store/onboarding';

const GOAL_OPTIONS: {
  value: Goal;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'reduce-anxiety',
    label: 'Reduce Panic & Anxiety',
    description: 'Manage symptoms and find calm',
    icon: (
      <MaterialCommunityIcons name="head-cog-outline" size={20} color="white" />
    ),
  },
  {
    value: 'build-resilience',
    label: 'Build Resilience',
    description: 'Strengthen your mental fortitude',
    icon: (
      <MaterialCommunityIcons
        name="shield-check-outline"
        size={20}
        color="white"
      />
    ),
  },
  {
    value: 'improve-sleep',
    label: 'Improve Sleep Quality',
    description: 'Rest deeper and wake refreshed',
    icon: <Ionicons name="moon-outline" size={20} color="white" />,
  },
  {
    value: 'face-social-fears',
    label: 'Face Social Fears',
    description: 'Connect with confidence and ease',
    icon: <Ionicons name="people-outline" size={20} color="white" />,
  },
  {
    value: 'daily-mindfulness',
    label: 'Daily Mindfulness',
    description: 'Practice being present every day',
    icon: <MaterialCommunityIcons name="meditation" size={20} color="white" />,
  },
];

export default function GoalSelectionScreen() {
  const [selectedGoals, setSelectedGoals] = useAtom(selectedGoalsAtom);

  const toggleGoal = (goal: Goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  };

  return (
    <View className="flex-1">
      <GlowBg
        centerY={0.0}
        intensity={1.5}
        radius={0.5}
        startColor={colors.primary.pink}
        endColor={colors.chakra.orange}
      />
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

            <ProgressDots total={7} current={5} />

            <View className="w-10" />
          </View>

          {/* Title + Subtitle */}
          <View className="px-8">
            <Text className="text-center text-3xl font-extrabold tracking-tight text-white">
              What brings you here?
            </Text>
            <Text className="mt-3 text-center text-sm text-white/60">
              Select the goals that matter most to you. We&apos;ll tailor your
              path accordingly.
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
                {GOAL_OPTIONS.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    description={option.description}
                    icon={option.icon}
                    selected={selectedGoals.includes(option.value)}
                    onPress={() => toggleGoal(option.value)}
                    variant="checkbox"
                  />
                ))}
              </View>
            </ScrollView>
          </ScrollFade>

          {/* Footer */}
          <View className="z-10 px-8 pb-8">
            <GradientButton
              onPress={() => router.push('/onboarding/data-security-promise')}
              disabled={selectedGoals.length === 0}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Continue
            </GradientButton>

            <View className="mt-3 items-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                Step 5 of 7
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
