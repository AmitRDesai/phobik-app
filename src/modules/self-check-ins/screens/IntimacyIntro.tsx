import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import {
  useInProgressAssessment,
  useStartAssessment,
} from '../hooks/useSelfCheckIn';
import {
  intimacyAnswersAtom,
  intimacyCurrentQuestionAtom,
} from '../store/self-check-ins';

const INSTRUCTIONS = [
  {
    number: '1',
    text: 'Focus on your actions and interactions over the past month.',
    bgColor: withAlpha(colors.primary.pink, 0.1),
    textColor: colors.primary.pink,
  },
  {
    number: '2',
    text: 'Rate each statement from 0 (Not true) to 4 (Almost always).',
    bgColor: withAlpha(colors.accent.yellow, 0.1),
    textColor: colors.accent.yellow,
  },
  {
    number: '3',
    text: 'Be honest with yourself for the most accurate resonance results.',
    bgColor: 'rgba(255,255,255,0.1)',
    textColor: 'rgba(255,255,255,0.6)',
  },
];

export default function IntimacyIntro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAnswers = useSetAtom(intimacyAnswersAtom);
  const setCurrentQuestion = useSetAtom(intimacyCurrentQuestionAtom);
  const startAssessment = useStartAssessment();
  const inProgress = useInProgressAssessment('intimacy');

  const handleBeginQuiz = async () => {
    const result = await startAssessment.mutateAsync({ type: 'intimacy' });

    // Restore state from API response
    const answers: Record<number, number> = {};
    if (result.answers) {
      for (const [key, value] of Object.entries(
        result.answers as Record<string, number>,
      )) {
        answers[Number(key)] = value;
      }
    }
    setAnswers(answers);
    setCurrentQuestion(result.currentQuestion);

    router.replace('/practices/self-check-ins/intimacy-question');
  };

  const isResume = !!inProgress;

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
        <BackButton />
        <Text className="text-lg font-bold tracking-tight text-white">
          Assessment
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        contentContainerClassName="pb-40"
        showsVerticalScrollIndicator={false}
      >
        {/* Mandala Visual */}
        <View className="items-center justify-center pb-12 pt-8">
          <Svg
            width={360}
            height={360}
            viewBox="0 0 360 360"
            style={{ position: 'absolute' }}
            pointerEvents="none"
          >
            <Defs>
              <RadialGradient id="mandalaGlow" cx="50%" cy="50%" r="50%">
                <Stop
                  offset="0%"
                  stopColor={colors.primary.pink}
                  stopOpacity={0.5}
                />
                <Stop
                  offset="40%"
                  stopColor={colors.primary.pink}
                  stopOpacity={0.2}
                />
                <Stop
                  offset="70%"
                  stopColor={colors.primary.pink}
                  stopOpacity={0.05}
                />
                <Stop
                  offset="100%"
                  stopColor={colors.primary.pink}
                  stopOpacity={0}
                />
              </RadialGradient>
            </Defs>
            <Ellipse
              cx="180"
              cy="180"
              rx="180"
              ry="180"
              fill="url(#mandalaGlow)"
            />
          </Svg>

          <View className="relative h-56 w-56 items-center justify-center">
            <View
              className="absolute inset-0 rounded-full"
              style={{
                borderWidth: 2,
                borderColor: withAlpha(colors.primary.pink, 0.2),
              }}
            />
            <View
              className="items-center justify-center rounded-full p-8"
              style={{
                backgroundColor: colors.background.charcoal,
                borderWidth: 1,
                borderColor: withAlpha(colors.primary.pink, 0.3),
              }}
            >
              <View className="absolute items-center justify-center">
                <MaterialIcons
                  name="filter-vintage"
                  size={96}
                  color={withAlpha(colors.accent.yellow, 0.2)}
                />
              </View>
              <MaterialIcons
                name="favorite"
                size={72}
                color={withAlpha(colors.primary.pink, 0.85)}
              />
            </View>
          </View>
        </View>

        {/* Title */}
        <View className="px-8 pb-10 text-center">
          <Text className="pb-3 text-center text-3xl font-bold leading-tight tracking-tight text-white">
            Balanced Communication Quiz
          </Text>
          <Text className="text-center text-base leading-relaxed text-zinc-400">
            A self-reflection tool for mindful listening and clear expression.
          </Text>
        </View>

        {/* Instructions */}
        <View className="gap-6 px-8">
          {INSTRUCTIONS.map((item) => (
            <View key={item.number} className="flex-row items-start gap-4">
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: item.bgColor }}
              >
                <Text className="font-bold" style={{ color: item.textColor }}>
                  {item.number}
                </Text>
              </View>
              <Text className="flex-1 pt-1 text-sm leading-snug text-zinc-300">
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <GradientButton
          onPress={handleBeginQuiz}
          loading={startAssessment.isPending}
        >
          {isResume ? 'Resume Quiz' : 'Begin Quiz'}
        </GradientButton>
      </View>
    </View>
  );
}
