import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '../components/ProgressBar';
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
    <View className="flex-1 bg-background-charcoal">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="px-8 pb-2 pt-6">
            <View className="mb-4 flex-row items-center justify-between">
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
              <View className="w-10" />
            </View>
            <ProgressBar current={3} total={6} label="Goal Selection" />
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1 px-8"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-6 mt-6">
              <Text className="text-3xl font-black tracking-tight text-white">
                What brings you here?
              </Text>
              <Text className="mt-3 text-base leading-relaxed text-white/60">
                Select the goals that matter most to you. We&apos;ll tailor your
                path accordingly.
              </Text>
            </View>

            <View className="gap-3">
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

          {/* Footer */}
          <View className="px-8 pb-10 pt-4">
            <GradientButton
              onPress={() => router.push('/onboarding/data-security-promise')}
              disabled={selectedGoals.length === 0}
              icon={<Ionicons name="arrow-forward" size={24} color="white" />}
            >
              Continue
            </GradientButton>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
