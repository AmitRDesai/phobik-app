import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { colors, withAlpha } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MysteryPracticeCard } from '../components/MysteryPracticeCard';
import {
  getMysteryChallenge,
  type MysteryType,
} from '../data/mystery-challenges';

export default function MysteryPractice() {
  const { type } = useLocalSearchParams<{ type: MysteryType }>();
  const insets = useSafeAreaInsets();
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
    <View className="flex-1">
      <GlowBg
        centerX={0.9}
        centerY={0.1}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        intensity={0.6}
      />

      {/* Fixed header */}
      <View style={{ paddingTop: insets.top + 8 }}>
        <View className="px-6">
          <BackButton onPress={handleBack} />
        </View>

        <View className="px-6 pb-6 pt-4">
          <MaskedView
            maskElement={
              <Text className="text-center text-5xl font-extrabold uppercase tracking-tight">
                {challenge.title}
              </Text>
            }
          >
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text className="text-center text-5xl font-extrabold uppercase tracking-tight opacity-0">
                {challenge.title}
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerClassName="flex-grow"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View className="mb-8 px-6">
          <Text className="text-center text-sm italic leading-relaxed text-slate-400">
            {challenge.description}
          </Text>
        </View>

        {/* Practice card */}
        <View className="px-6">
          <MysteryPracticeCard
            challenge={challenge}
            onStart={() => {
              hasStarted.current = true;
            }}
            onComplete={() => {
              // Drop the user back at the Practices tab. Skipping the wheel
              // screen on the way out — they just completed today's challenge,
              // so landing them at "spin again" would be awkward. Matches the
              // pattern used by Empathy Challenge completion.
              router.replace('/(tabs)/practices');
            }}
          />
        </View>

        {/* Mindful insight */}
        <View className="mt-8 items-center">
          <Text
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: withAlpha(colors.primary.pink, 0.6) }}
          >
            Mindful Insight
          </Text>
          <Text className="mt-1 text-xs text-slate-500">
            Consistency is the key to neural rewiring.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
