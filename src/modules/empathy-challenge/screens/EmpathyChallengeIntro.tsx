import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { dialog } from '@/utils/dialog';

import { BenefitCard } from '../components/BenefitCard';
import { useStartChallenge } from '../hooks/useEmpathyChallenge';

export default function EmpathyChallengeIntro() {
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
    <Screen
      variant="default"
      scroll
      header={<Header variant="close" />}
      sticky={
        <Button onPress={handleJoin} loading={startChallenge.isPending}>
          Join Challenge
        </Button>
      }
      className=""
    >
      <View className="h-16" />

      <View className="-mt-6 items-center px-6">
        <Text
          size="display"
          align="center"
          weight="bold"
          className="pb-3 leading-tight"
        >
          7-Day Empathy Challenge
        </Text>
        <Text
          size="lg"
          align="center"
          tone="secondary"
          className="max-w-xs leading-relaxed"
        >
          A week to strengthen awareness, connection, and compassion. Empathy
          isn&apos;t one thing — it&apos;s a skill of the mind, heart and
          action. Each day, you&apos;ll explore one layer: Perspective
          (Cognitive), Feeling (Emotional), and Compassion (Action).
        </Text>
      </View>

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
    </Screen>
  );
}
