import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { DailyFlowProgressBar } from '../components/DailyFlowProgressBar';
import { SupportOptionCard } from '../components/SupportOptionCard';
import { SUPPORT_OPTIONS } from '../data/supportOptions';
import type { SupportOptionId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function SupportOptions() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [selected, setSelected] = useState<SupportOptionId>(
    (session?.supportOption ?? 'neural_bloom') as SupportOptionId,
  );
  const [eft, setEft] = useState(session?.addOns?.eft ?? false);
  const [bilateral, setBilateral] = useState(
    session?.addOns?.bilateral ?? false,
  );

  if (isLoading || !session) return <LoadingScreen />;

  const handleContinue = async () => {
    await updateSession.mutateAsync({
      id: session.id,
      supportOption: selected,
      addOns: { eft, bilateral },
      currentStep: 'player',
    });
    router.push('/daily-flow/player');
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<DailyFlowHeader wordmark />}
      sticky={
        <View className="items-center">
          <GradientButton
            onPress={handleContinue}
            loading={updateSession.isPending}
          >
            Start My Shift
          </GradientButton>
          <Text
            variant="sm"
            className="mt-4 px-4 text-center text-foreground/50"
          >
            Prepare for a sensory transition. Please use headphones.
          </Text>
        </View>
      }
      className="px-6"
    >
      <View className="mb-8">
        <View className="flex-row items-end justify-between">
          <View className="flex-1">
            <Text
              variant="caption"
              className="font-bold tracking-[0.3em] text-primary-pink"
              style={{ paddingRight: 3.3 }}
            >
              Step 03
            </Text>
            <Text variant="h1" className="mt-2 font-black leading-tight">
              Choose your sound
            </Text>
          </View>
          <Text variant="sm" className="pb-1 text-foreground/55">
            75% Complete
          </Text>
        </View>
        <View className="mt-4">
          <DailyFlowProgressBar progress={0.75} />
        </View>
      </View>

      <View className="gap-5">
        {SUPPORT_OPTIONS.map((option) => (
          <SupportOptionCard
            key={option.id}
            option={option}
            selected={selected === option.id}
            onPress={() => setSelected(option.id)}
          />
        ))}
      </View>

      <View className="mt-10 items-center">
        <Text
          variant="caption"
          className="font-bold tracking-[0.3em] text-foreground/50"
          style={{ paddingRight: 3.3 }}
        >
          Enhance Your Session
        </Text>
        <View className="mt-5 flex-row flex-wrap justify-center gap-3">
          <AddOnPill
            icon="check-circle"
            label="Add EFT Tapping"
            on={eft}
            onToggle={() => setEft((v) => !v)}
          />
          <AddOnPill
            icon="vibration"
            label="Add Bi-Lateral Tapping"
            on={bilateral}
            onToggle={() => setBilateral((v) => !v)}
          />
        </View>
      </View>
    </Screen>
  );
}

function AddOnPill({
  icon,
  label,
  on,
  onToggle,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  const scheme = useScheme();
  if (on) {
    return (
      <GradientButton
        compact
        onPress={onToggle}
        prefixIcon={<MaterialIcons name={icon} size={14} color="white" />}
      >
        {label}
      </GradientButton>
    );
  }
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.04] px-5 py-2"
    >
      <MaterialIcons
        name={icon}
        size={14}
        color={foregroundFor(scheme, 0.85)}
      />
      <Text
        variant="caption"
        className="font-bold tracking-wider text-foreground/85"
        style={{ paddingRight: 1.1 }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
