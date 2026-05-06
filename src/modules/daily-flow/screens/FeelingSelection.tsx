import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { FeelingOptionCard } from '../components/FeelingOptionCard';
import { FEELINGS } from '../data/feelings';
import type { FeelingId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function FeelingSelection() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  if (isLoading || !session) return <LoadingScreen />;

  const handleSelect = async (feelingId: FeelingId) => {
    await updateSession.mutateAsync({
      id: session.id,
      feeling: feelingId,
      currentStep: 'feeling_detail',
    });
    router.push({
      pathname: '/daily-flow/feeling-detail',
      params: { feelingId },
    });
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<DailyFlowHeader wordmark />}
      className="px-6"
    >
      <View className="mb-8 mt-2">
        <Text className="text-[42px] font-black leading-[1.05] tracking-tight text-foreground">
          How are you
        </Text>
        <GradientText className="text-[42px] font-black leading-[1.05] tracking-tight">
          feeling right now?
        </GradientText>
        <Text className="mt-4 text-lg leading-7 text-foreground/60">
          Different states need different tools.
        </Text>
      </View>

      <View className="gap-5">
        {FEELINGS.map((feeling) => (
          <FeelingOptionCard
            key={feeling.id}
            feeling={feeling}
            onPress={() => handleSelect(feeling.id)}
          />
        ))}
      </View>
    </Screen>
  );
}
