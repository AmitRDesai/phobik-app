import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { FloatingMapper } from '@/modules/micro-challenges/components/FloatingMapper';
import { EMOTIONS } from '@/modules/micro-challenges/data/emotions';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function DetailedFeeling() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [selectedEmotion, setSelectedEmotion] = useState<string>('happy');
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const showLoading = isLoading || !session;

  const handleConfirm = async () => {
    if (!session) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'support_options',
    });
    router.push('/daily-flow/support-options');
  };

  return (
    <Screen loading={showLoading} transparent insetTop={false} className="">
      <View className="px-6">
        <View className="flex-row items-end justify-between">
          <View className="flex-1">
            <Text
              size="xs"
              treatment="caption"
              tone="accent"
              weight="bold"
              className="tracking-[0.3em]"
              style={{ paddingRight: 3.3 }}
            >
              Step 02
            </Text>
            <Text size="h1" weight="black" className="mt-2 leading-tight">
              Choose how you
            </Text>
            <View className="flex-row flex-wrap items-baseline">
              <Text size="h1" weight="black" className="leading-tight">
                want to{' '}
              </Text>
              <GradientText className="text-3xl font-black leading-tight">
                feel
              </GradientText>
            </View>
          </View>
          <Text size="sm" tone="secondary" className="pb-1">
            25% Complete
          </Text>
        </View>

        <View className="mt-4">
          <ProgressBar progress={0.25} gradient />
        </View>
      </View>

      <FloatingMapper
        items={EMOTIONS.map((e) => ({
          id: e.id,
          label: e.label,
          gradient: e.gradient,
          shadowColor: e.shadowColor,
          subItems: e.subFeelings,
        }))}
        selectedId={selectedEmotion}
        selectedSubItem={selectedFeeling}
        onSelect={setSelectedEmotion}
        onSubItemSelect={setSelectedFeeling}
        onConfirm={handleConfirm}
        promptText="We will guide your body there."
        confirmLabel="Confirm Feeling"
      />
    </Screen>
  );
}
