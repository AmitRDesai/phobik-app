import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useSetAtom } from 'jotai';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import {
  useInProgressAssessment,
  useStartAssessment,
} from '../hooks/useSelfCheckIn';
import { intimacyAnswersAtom } from '../store/self-check-ins';

type Instruction = {
  number: string;
  text: string;
  tone: 'pink' | 'yellow' | 'neutral';
};

const INSTRUCTIONS: Instruction[] = [
  {
    number: '1',
    text: 'Focus on your actions and interactions over the past month.',
    tone: 'pink',
  },
  {
    number: '2',
    text: 'Rate each statement from 0 (Not true) to 4 (Almost always).',
    tone: 'yellow',
  },
  {
    number: '3',
    text: 'Be honest with yourself for the most accurate resonance results.',
    tone: 'neutral',
  },
];

export default function IntimacyIntro() {
  const navigation = useNavigation();
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const setAnswers = useSetAtom(intimacyAnswersAtom);
  const startAssessment = useStartAssessment();
  const inProgress = useInProgressAssessment('intimacy');

  const toneColors = (tone: Instruction['tone']) => {
    if (tone === 'pink')
      return {
        bg: withAlpha(colors.primary.pink, 0.1),
        text: colors.primary.pink,
      };
    if (tone === 'yellow') return { bg: withAlpha(yellow, 0.1), text: yellow };
    return {
      bg: foregroundFor(scheme, 0.1),
      text: foregroundFor(scheme, 0.6),
    };
  };

  const handleBeginQuiz = async () => {
    const result = await startAssessment.mutateAsync({ type: 'intimacy' });

    // Restore answers from API response
    const answers: Record<number, number> = {};
    if (result.answers) {
      for (const [key, value] of Object.entries(
        result.answers as Record<string, number>,
      )) {
        answers[Number(key)] = value;
      }
    }
    setAnswers(answers);

    // Build the back-stack [Q0, …, QcurrentIndex] (no hub — intimacy is
    // launched from Relationship-Based Regulation, not the assessment
    // hub, so back from Q0 pops out of this nested stack back to the
    // pillar screen).
    const currentIdx = Number(result.currentQuestion) || 0;
    navigation.dispatch(
      CommonActions.reset({
        index: currentIdx,
        routes: Array.from({ length: currentIdx + 1 }, (_, i) => ({
          name: 'intimacy-question',
          params: { index: String(i) },
        })),
      }),
    );
  };

  const isResume = !!inProgress;

  return (
    <Screen
      scroll
      insetTop={false}
      header={
        <Header
          left={<BackButton />}
          center={
            <Text size="lg" weight="bold">
              Assessment
            </Text>
          }
        />
      }
      sticky={
        <Button onPress={handleBeginQuiz} loading={startAssessment.isPending}>
          {isResume ? 'Resume Quiz' : 'Begin Quiz'}
        </Button>
      }
      className="px-0"
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
            className="items-center justify-center rounded-full bg-surface p-8"
            style={{
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
      <View className="px-8 pb-10">
        <Text size="h1" align="center" className="pb-3 leading-tight">
          Balanced Communication Quiz
        </Text>
        <Text
          size="lg"
          tone="secondary"
          align="center"
          className="leading-relaxed"
        >
          A self-reflection tool for mindful listening and clear expression.
        </Text>
      </View>

      {/* Instructions */}
      <View className="gap-6 px-8">
        {INSTRUCTIONS.map((item) => {
          const tone = toneColors(item.tone);
          return (
            <View key={item.number} className="flex-row items-start gap-4">
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: tone.bg }}
              >
                <Text size="sm" weight="bold" style={{ color: tone.text }}>
                  {item.number}
                </Text>
              </View>
              <Text
                size="sm"
                className="flex-1 pt-1 leading-snug text-foreground/70"
              >
                {item.text}
              </Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
