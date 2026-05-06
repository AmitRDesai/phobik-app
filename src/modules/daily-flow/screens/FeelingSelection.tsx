import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
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

function GradientHeadline({ text }: { text: string }) {
  return (
    <MaskedView
      maskElement={
        <Text className="text-[42px] font-black leading-[1.05] tracking-tight">
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-[42px] font-black leading-[1.05] tracking-tight opacity-0">
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

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
        <GradientHeadline text="feeling right now?" />
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
