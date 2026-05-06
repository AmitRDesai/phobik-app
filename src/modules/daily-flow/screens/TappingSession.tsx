import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { TappingAnimation } from '../components/TappingAnimation';
import { getFeeling } from '../data/feelings';
import { TAPPING_POINTS } from '../data/tappingPoints';
import { getTappingSession, TAPPING_SESSIONS } from '../data/tappingSessions';
import type { FeelingId, TappingFeelingId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

function resolveTappingId(raw: string | undefined): TappingFeelingId {
  if (!raw) return 'drained';
  if (raw in TAPPING_SESSIONS) return raw as TappingFeelingId;
  const mapped = getFeeling(raw as FeelingId)?.tappingFeelingId;
  return mapped ?? 'drained';
}

export default function TappingSession() {
  const router = useRouter();
  const scheme = useScheme();
  const params = useLocalSearchParams<{ feelingId?: string }>();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [pointIndex, setPointIndex] = useState(0);

  if (isLoading || !session) return <LoadingScreen />;

  const tappingId = resolveTappingId(
    params.feelingId ?? session.feeling ?? undefined,
  );
  const content = getTappingSession(tappingId);
  const accentColor =
    content.accent === 'yellow'
      ? accentFor(scheme, 'yellow')
      : colors.primary.pink;
  const isLastPoint = pointIndex === TAPPING_POINTS.length - 1;

  const handleNext = async () => {
    if (!isLastPoint) {
      setPointIndex((i) => i + 1);
      return;
    }
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'reflection',
    });
    router.push('/daily-flow/reflection');
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<DailyFlowHeader title="EFT Tapping Session" />}
      sticky={
        <View>
          <GradientButton
            onPress={handleNext}
            loading={updateSession.isPending}
          >
            {isLastPoint ? 'Finish Tapping' : 'Next Tap Point'}
          </GradientButton>
          <Text className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/40">
            Point {pointIndex + 1} of {TAPPING_POINTS.length}
          </Text>
        </View>
      }
      className="px-6"
    >
      <View className="mt-2 items-center">
        <Text
          className="text-center text-4xl font-black leading-tight tracking-tight text-foreground"
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {content.title}
        </Text>
      </View>

      <View className="mt-6">
        <TappingAnimation
          image={content.image}
          accent={content.accent}
          pointIndex={pointIndex}
        />
      </View>

      <View className="mt-6 items-center">
        <Text className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/50">
          Setup Phrase
        </Text>
        <Text className="mt-2 px-2 text-center text-lg font-medium italic leading-7 text-foreground/75">
          &ldquo;{content.setupPhrase}&rdquo;
        </Text>
      </View>

      <View className="mt-6 items-center">
        <Text
          className="text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{ color: accentColor }}
        >
          Tapping Prompt
        </Text>
        <Text className="mt-3 px-2 text-center text-2xl font-black leading-8 text-foreground">
          &ldquo;{content.prompt}&rdquo;
        </Text>
      </View>
    </Screen>
  );
}
