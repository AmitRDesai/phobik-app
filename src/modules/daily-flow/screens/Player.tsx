import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

import { buildAnalysisResult } from '../data/flowRecommendations';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const QUOTE = 'Find the stillness within the flow.';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.max(0, Math.floor(seconds % 60));
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Player() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [playing, setPlaying] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepElapsed, setStepElapsed] = useState(0);

  const analysis =
    session?.analysisResult ??
    buildAnalysisResult(session?.timeOption ?? 'balanced_flow');
  const flow = analysis.flow;
  const currentStep = flow[stepIndex] ?? flow[0];
  const remaining = Math.max(0, currentStep.durationSeconds - stepElapsed);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStepElapsed((elapsed) => {
        const nextElapsed = elapsed + 1;
        // Advance to the next step when the current step duration elapses.
        if (
          nextElapsed >= currentStep.durationSeconds &&
          stepIndex < flow.length - 1
        ) {
          setStepIndex((i) => i + 1);
          return 0;
        }
        return nextElapsed;
      });
    }, 1000);
    return () => clearInterval(id);
    // currentStep.durationSeconds and stepIndex are read inside the callback via
    // closure; the interval is recreated whenever playing/stepIndex/flow changes.
  }, [playing, stepIndex, flow.length, currentStep.durationSeconds]);

  const showLoading = isLoading || !session;

  const handleNext = async () => {
    if (stepIndex < flow.length - 1) {
      setStepIndex((i) => i + 1);
      setStepElapsed(0);
      return;
    }
    if (!session) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'reflection',
    });
    router.replace('/daily-flow/reflection');
  };

  return (
    <Screen loading={showLoading} transparent insetTop={false} noPadding>
      <View className="flex-1 items-center justify-center gap-8 px-6">
        <View className="w-full items-center justify-center rounded-3xl border border-foreground/10 p-6">
          <View className="relative size-56 items-center justify-center">
            <Svg
              viewBox="0 0 100 100"
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            >
              <Defs>
                <SvgLinearGradient id="timerRing" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={colors.primary.pink} />
                  <Stop offset="0.5" stopColor={colors.accent.orange} />
                  <Stop offset="1" stopColor={colors.accent.yellow} />
                </SvgLinearGradient>
              </Defs>
              <Circle
                cx="50"
                cy="50"
                r="49"
                stroke="url(#timerRing)"
                strokeWidth="1"
                fill="none"
              />
            </Svg>
            <Text
              weight="bold"
              align="center"
              className="text-[36px] leading-[42px] tracking-tight"
            >
              {formatTime(remaining)}
            </Text>
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              tone="secondary"
              className="mt-1 tracking-[0.3em]"
            >
              Remain
            </Text>
          </View>
        </View>

        <Text size="md" tone="secondary" italic align="center">
          “{QUOTE}”
        </Text>

        <View className="w-full gap-3">
          <View className="flex-row gap-1">
            {flow.map((step, i) => (
              <ProgressBar
                key={step.id}
                progress={
                  i < stepIndex
                    ? 1
                    : i === stepIndex
                      ? stepElapsed / currentStep.durationSeconds
                      : 0
                }
                gradient={i === stepIndex}
                size="sm"
                className="flex-1"
              />
            ))}
          </View>
          <View className="flex-row gap-1">
            {flow.map((step, i) => {
              const [stepPhase] = (step.label ?? '').split(' · ');
              return (
                <Text
                  key={step.id}
                  size="xs"
                  treatment="caption"
                  weight="bold"
                  tone={i === stepIndex ? 'accent' : 'tertiary'}
                  align="center"
                  className="flex-1"
                >
                  {stepPhase}
                </Text>
              );
            })}
          </View>
        </View>
      </View>

      <View className="px-6 pb-10 pt-6">
        <PlaybackControls
          isPaused={!playing}
          onPauseToggle={() => setPlaying((p) => !p)}
          onRestart={handleNext}
          sessionReady={false}
          size="md"
          className="justify-center gap-8"
        />
      </View>
    </Screen>
  );
}
