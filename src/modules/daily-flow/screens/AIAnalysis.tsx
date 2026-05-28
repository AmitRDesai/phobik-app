import aiAnalysisOrganism from '@/assets/images/daily-flow/ai-analysis-organism.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';

import { buildAnalysisResult } from '../data/flowRecommendations';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const STATUSES = [
  'Calibrating Biometrics',
  'Synchronizing Cognitive Resonance',
  'Mapping Neural Flow',
  'Harmonizing Frequencies',
  'Decoding Sonic Signatures',
  'Cognitive Alignment Ready',
];

const TOTAL_DURATION_MS = 6500;
const TICK_MS = 100;

export default function AIAnalysis() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [progress, setProgress] = useState(0);
  const advanced = useRef(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const next = Math.min(1, elapsed / TOTAL_DURATION_MS);
      setProgress(next);
      if (next >= 1) clearInterval(interval);
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 1 || !session || advanced.current) return;
    advanced.current = true;
    (async () => {
      const timeOption = session.timeOption ?? 'balanced_flow';
      const analysis = buildAnalysisResult(timeOption);
      await updateSession.mutateAsync({
        id: session.id,
        currentStep: 'body_insight',
        analysisResult: analysis,
      });
      router.replace('/daily-flow/body-insight');
    })();
  }, [progress, session, router, updateSession]);

  const statusIndex = Math.min(
    STATUSES.length - 1,
    Math.floor(progress * STATUSES.length),
  );

  return (
    <Screen loading={isLoading || !session} transparent insetTop={false}>
      <View className="flex-1 items-center justify-center gap-12 px-screen-x">
        <GradientText className="text-[32px] font-bold leading-[38px]">
          Listening to your body…
        </GradientText>

        <View
          className="aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl"
          style={{
            boxShadow: `0 0 60px ${withAlpha(colors.primary.pink, 0.35)}`,
          }}
        >
          <Image
            source={aiAnalysisOrganism}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            accessibilityLabel="Metaphysical AI analysis"
            className="h-full w-full"
          />
        </View>

        <View className="w-full max-w-sm gap-4">
          <ProgressBar progress={progress} gradient size="sm" animated />
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            tone="secondary"
            align="center"
          >
            {STATUSES[statusIndex]}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
