import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';

import { BenefitCard } from '../components/BenefitCard';
import { useStartChallenge } from '../hooks/useEmpathyChallenge';

export default function EmpathyChallengeIntro() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const startChallenge = useStartChallenge();

  const handleJoin = async () => {
    try {
      await startChallenge.mutateAsync(undefined);
      router.replace('/practices/empathy-challenge/calendar');
    } catch {
      await dialog.error({
        title: 'Something went wrong',
        message: 'Could not start the challenge. Please try again.',
      });
    }
  };

  return (
    <View className="flex-1 bg-background-charcoal">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.15}
        radius={0.35}
        intensity={0.8}
        bgClassName="bg-background-charcoal"
      />

      {/* Header — fixed above scroll */}
      <View className="z-10 px-4 py-4" style={{ paddingTop: insets.top + 8 }}>
        <BackButton icon="close" />
      </View>

      <ScrollView
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Spacer for aura glow area */}
        <View className="h-16" />

        {/* Title Section */}
        <View className="-mt-6 items-center px-6">
          <Text className="pb-3 text-center text-4xl font-bold leading-tight text-white">
            7-Day Empathy Challenge
          </Text>
          <Text className="max-w-xs text-center text-lg font-normal leading-relaxed text-slate-400">
            A week to strengthen awareness, connection, and compassion. Empathy
            isn&apos;t one thing — it&apos;s a skill of the mind, heart and
            action. Each day, you&apos;ll explore one layer: Perspective
            (Cognitive), Feeling (Emotional), and Compassion (Action).
          </Text>
        </View>

        {/* Benefit Cards */}
        <View className="mx-auto mt-12 w-full max-w-md gap-4 px-6">
          <BenefitCard
            icon="visibility"
            title="Understand Others"
            description="Gain insight into different perspectives"
          />
          <BenefitCard
            icon="favorite"
            title="Deepen Bonds"
            description="Build stronger emotional bridges"
          />
          <BenefitCard
            icon="self-improvement"
            title="Self-Compassion"
            description="Learning to be kind to yourself"
          />
        </View>

        {/* CTA Button */}
        <View className="mt-12 px-6">
          <GradientButton
            onPress={handleJoin}
            loading={startChallenge.isPending}
          >
            Join Challenge
          </GradientButton>
        </View>
      </ScrollView>
    </View>
  );
}
