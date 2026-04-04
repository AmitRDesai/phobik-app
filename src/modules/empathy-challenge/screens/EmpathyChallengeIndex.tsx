import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';

import { useActiveChallenge } from '../hooks/useEmpathyChallenge';

export default function EmpathyChallengeIndex() {
  const { data: challenge, isLoading, isError, refetch } = useActiveChallenge();
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-charcoal">
        <ActivityIndicator size="large" color={colors.primary.pink} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background-charcoal px-6">
        <Text className="text-center text-lg font-semibold text-white">
          Something went wrong
        </Text>
        <Text className="text-center text-sm text-slate-400">
          Could not load challenge status. Please try again.
        </Text>
        <GradientButton compact onPress={() => refetch()}>
          Retry
        </GradientButton>
        <GradientButton compact onPress={() => router.back()}>
          Go Back
        </GradientButton>
      </View>
    );
  }

  if (challenge) {
    return <Redirect href="/practices/empathy-challenge/calendar" />;
  }

  return <Redirect href="/practices/empathy-challenge/intro" />;
}
