import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/constants/colors';
import { FloatingMapper } from '@/modules/micro-challenges/components/FloatingMapper';
import { EMOTIONS } from '@/modules/micro-challenges/data/emotions';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { DailyFlowProgressBar } from '../components/DailyFlowProgressBar';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

function GradientWord({ text }: { text: string }) {
  return (
    <MaskedView
      maskElement={
        <Text className="text-3xl font-black leading-tight tracking-tight">
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-3xl font-black leading-tight tracking-tight opacity-0">
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function DetailedFeeling() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [selectedEmotion, setSelectedEmotion] = useState<string>('happy');
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  if (isLoading || !session) return <LoadingScreen />;

  const handleConfirm = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'support_options',
    });
    router.push('/daily-flow/support-options');
  };

  return (
    <Screen
      variant="default"
      header={<DailyFlowHeader wordmark />}
      className=""
    >
      <View className="px-6">
        <View className="flex-row items-end justify-between">
          <View className="flex-1">
            <Text className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-pink">
              Step 02
            </Text>
            <Text className="mt-2 text-3xl font-black leading-tight tracking-tight text-foreground">
              Choose how you
            </Text>
            <View className="flex-row flex-wrap items-baseline">
              <Text className="text-3xl font-black leading-tight tracking-tight text-foreground">
                want to{' '}
              </Text>
              <GradientWord text="feel" />
            </View>
          </View>
          <Text className="pb-1 text-xs text-foreground/55">25% Complete</Text>
        </View>

        <View className="mt-4">
          <DailyFlowProgressBar progress={0.25} />
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
