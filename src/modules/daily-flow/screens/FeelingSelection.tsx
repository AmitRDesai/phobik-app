import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';

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
    <Screen scroll header={<DailyFlowHeader wordmark />} className="px-6">
      <View className="mb-8 mt-2">
        <Text weight="black" className="text-[42px] leading-[1.05]">
          How are you
        </Text>
        <GradientText className="text-[42px] font-black leading-[1.05]">
          feeling right now?
        </GradientText>
        <Text size="lg" tone="secondary" className="mt-4 leading-7">
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
