import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { TappingAnimation } from '../components/TappingAnimation';
import { TAPPING_POINTS } from '../data/tappingPoints';
import { getTappingSession, TAPPING_SESSIONS } from '../data/tappingSessions';
import type { TappingFeelingId } from '../data/types';

function resolveTappingId(raw: string | undefined): TappingFeelingId {
  if (raw && raw in TAPPING_SESSIONS) return raw as TappingFeelingId;
  return 'drained';
}

/**
 * Restored EFT-tapping POC (removed in commit ae33c9d, "new daily flow").
 * Standalone version: feeling comes from the `feelingId` param (default
 * `drained`); finishing pops back instead of advancing the daily flow.
 */
export default function TappingSession() {
  const router = useRouter();
  const scheme = useScheme();
  const params = useLocalSearchParams<{ feelingId?: string }>();
  const [pointIndex, setPointIndex] = useState(0);

  const tappingId = resolveTappingId(params.feelingId);
  const content = getTappingSession(tappingId);
  const accentColor =
    content.accent === 'yellow'
      ? accentFor(scheme, 'yellow')
      : colors.primary.pink;
  const isLastPoint = pointIndex === TAPPING_POINTS.length - 1;

  const handleNext = () => {
    if (!isLastPoint) {
      setPointIndex((i) => i + 1);
      return;
    }
    router.back();
  };

  return (
    <Screen
      scroll
      transparent
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button onPress={handleNext} fullWidth>
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
