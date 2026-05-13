import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

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

  const showLoading = isLoading || !session;

  const tappingId = resolveTappingId(
    params.feelingId ?? session?.feeling ?? undefined,
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
    if (!session) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'reflection',
    });
    router.push('/daily-flow/reflection');
  };

  return (
    <Screen
      loading={showLoading}
      scroll
      transparent
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button
            onPress={handleNext}
            loading={updateSession.isPending}
            fullWidth
          >
            {isLastPoint ? 'Finish Tapping' : 'Next Tap Point'}
          </Button>
          <Text
            size="xs"
            treatment="caption"
            align="center"
            weight="bold"
            className="mt-3 tracking-[0.25em] text-foreground/40"
            style={{ paddingLeft: 2.75, paddingRight: 2.75 }}
          >
            Point {pointIndex + 1} of {TAPPING_POINTS.length}
          </Text>
        </View>
      }
      className="px-6"
    >
      <View className="mt-2 items-center">
        <Text
          size="display"
          align="center"
          weight="black"
          className="leading-tight"
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
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          className="tracking-[0.25em] text-foreground/50"
          style={{ paddingLeft: 2.5, paddingRight: 2.5 }}
        >
          Setup Phrase
        </Text>
        <Text
          size="lg"
          align="center"
          weight="medium"
          className="mt-2 px-2 leading-7 text-foreground/75"
        >
          &ldquo;{content.setupPhrase}&rdquo;
        </Text>
      </View>

      <View className="mt-6 items-center">
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          className="tracking-[0.25em]"
          style={{
            color: accentColor,
            paddingLeft: 2.5,
            paddingRight: 2.5,
          }}
        >
          Tapping Prompt
        </Text>
        <Text
          size="h2"
          align="center"
          weight="black"
          className="mt-3 px-2 leading-8"
        >
          &ldquo;{content.prompt}&rdquo;
        </Text>
      </View>
    </Screen>
  );
}
