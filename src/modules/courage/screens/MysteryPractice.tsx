import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { dialog } from '@/utils/dialog';

import { MysteryPracticeCard } from '../components/MysteryPracticeCard';
import {
  getMysteryChallenge,
  type MysteryType,
} from '../data/mystery-challenges';

export default function MysteryPractice() {
  const { type } = useLocalSearchParams<{ type: MysteryType }>();
  const router = useRouter();
  const challenge = getMysteryChallenge(type as MysteryType);
  const hasStarted = useRef(false);

  const handleBack = async () => {
    if (!hasStarted.current) {
      router.back();
      return;
    }

    const result = await dialog.info({
      title: 'Quit Challenge?',
      message: 'Your progress will not be saved.',
      buttons: [
        { label: 'Quit', value: 'quit', variant: 'primary' },
        { label: 'Continue', value: 'continue', variant: 'secondary' },
      ],
    });

    if (result === 'quit') {
      router.back();
    }
  };

  return (
    <Screen
      scroll
      header={
        <View className="px-6 py-2">
          <BackButton onPress={handleBack} />
          <View className="pb-6 pt-4">
            <GradientText className="text-center text-5xl font-extrabold uppercase">
              {challenge.title}
            </GradientText>
          </View>
        </View>
      }
      noPadding
    >
      <View className="mb-8 px-6">
        <Text
          size="sm"
          italic
          align="center"
          tone="secondary"
          className="leading-relaxed"
        >
          {challenge.description}
        </Text>
      </View>

      <View className="px-6">
        <MysteryPracticeCard
          challenge={challenge}
          onStart={() => {
            hasStarted.current = true;
          }}
          onComplete={() => {
            // Drop the user back at the Practices tab. Skipping the wheel
            // screen on the way out — they just completed today's challenge,
            // so landing them at "spin again" would be awkward.
            router.replace('/(tabs)/practices');
          }}
        />
      </View>

      <View className="mt-8 items-center pb-10">
        <Text
          size="xs"
          treatment="caption"
          style={{ color: withAlpha(colors.primary.pink, 0.6) }}
        >
          Mindful Insight
        </Text>
        <Text size="xs" tone="secondary" className="mt-1">
          Consistency is the key to neural rewiring.
        </Text>
      </View>
    </Screen>
  );
}
