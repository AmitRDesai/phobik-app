import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { STRESSORS } from '../data/stressors';
import type { StressorId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function StressorSelection() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const selected = session?.stressor ?? null;
  const showLoading = isLoading || !session;

  const select = async (id: StressorId) => {
    if (!session) return;
    await updateSession.mutateAsync({ id: session.id, stressor: id });
  };

  const handleContinue = async () => {
    if (!session || !selected) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'check_in',
    });
    router.push('/daily-flow/check-in');
  };

  return (
    <Screen
      loading={showLoading}
      scroll
      transparent
      insetTop={false}
      sticky={
        <Button
          onPress={handleContinue}
          disabled={!selected}
          loading={updateSession.isPending}
          fullWidth
        >
          Continue
        </Button>
      }
      contentClassName="gap-6 pb-4"
    >
      <View className="gap-2">
        <GradientText className="text-[28px] font-extrabold leading-[34px]">
          What is your top stressor today?
        </GradientText>
        <Text size="sm" tone="secondary">
          Identify the energy flow currently affecting your balance. We&rsquo;ll
          tailor your practices accordingly.
        </Text>
      </View>

      <View className="gap-3">
        {STRESSORS.map((stressor) => (
          <SelectionCard
            key={stressor.id}
            variant="radio"
            label={stressor.label}
            tone={stressor.tone}
            icon={(color) => (
              <Ionicons name={stressor.icon} size={20} color={color} />
            )}
            selected={selected === stressor.id}
            onPress={() => select(stressor.id)}
          />
        ))}
      </View>
    </Screen>
  );
}
