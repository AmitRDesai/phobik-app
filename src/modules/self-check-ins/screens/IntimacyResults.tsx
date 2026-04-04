import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  INTIMACY_QUESTIONS,
  INTIMACY_RATING_LABELS,
} from '../data/intimacy-questions';
import { intimacyAnswersAtom } from '../store/self-check-ins';

export default function IntimacyResults() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const answers = useAtomValue(intimacyAnswersAtom);

  // Calculate total score
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const maxScore = INTIMACY_QUESTIONS.length * 4;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const getLevel = () => {
    if (percentage >= 75)
      return { label: 'Strong Communicator', color: colors.accent.yellow };
    if (percentage >= 50)
      return { label: 'Growing Communicator', color: colors.primary.pink };
    return { label: 'Emerging Communicator', color: colors.accent.orange };
  };

  const level = getLevel();

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 pb-4"
        style={{
          paddingTop: insets.top + 8,
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}
      >
        <BackButton onPress={() => router.back()} />
        <Text className="text-lg font-bold tracking-tight text-white">
          Your Results
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="items-center pb-8 pt-6">
          <View
            className="mb-6 h-24 w-24 items-center justify-center rounded-full"
            style={{
              backgroundColor: withAlpha(colors.primary.pink, 0.15),
              borderWidth: 2,
              borderColor: withAlpha(colors.primary.pink, 0.3),
            }}
          >
            <MaterialIcons
              name="favorite"
              size={48}
              color={colors.primary.pink}
            />
          </View>
          <Text className="mb-2 text-center text-3xl font-bold tracking-tight text-white">
            {level.label}
          </Text>
          <Text className="text-center text-base text-zinc-400">
            You scored {totalScore} out of {maxScore} ({percentage}%)
          </Text>
        </View>

        {/* Score Breakdown */}
        <View className="gap-3">
          {INTIMACY_QUESTIONS.map((q) => {
            const answer = answers[q.id] ?? 0;
            return (
              <View
                key={q.id}
                className="flex-row items-center justify-between rounded-2xl border border-white/5 bg-neutral-900/50 p-4"
              >
                <Text
                  className="flex-1 text-sm text-zinc-300"
                  numberOfLines={2}
                >
                  Q{q.id}. {q.text}
                </Text>
                <View className="ml-3 rounded-full bg-white/10 px-3 py-1">
                  <Text className="text-xs font-bold text-white">
                    {answer}/{4} · {INTIMACY_RATING_LABELS[answer]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* CTA */}
        <View className="mt-8">
          <GradientButton onPress={() => router.back()}>
            Back to Assessments
          </GradientButton>
        </View>
      </ScrollView>
    </View>
  );
}
