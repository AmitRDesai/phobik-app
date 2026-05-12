import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { DailyFlowHeader } from '../components/DailyFlowHeader';
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
          <Button onPress={handleContinue} loading={updateSession.isPending}>
            Start My Shift
          </Button>
          <Text
            size="sm"
            align="center"
            className="mt-4 px-4 text-foreground/50"
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
              size="xs"
              treatment="caption"
              tone="accent"
              weight="bold"
              className="tracking-[0.3em]"
              style={{ paddingRight: 3.3 }}
            >
              Step 03
            </Text>
            <Text size="h1" weight="black" className="mt-2 leading-tight">
              Choose your sound
            </Text>
          </View>
          <Text size="sm" tone="secondary" className="pb-1">
            75% Complete
          </Text>
        </View>
        <View className="mt-4">
          <ProgressBar progress={0.75} gradient />
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
          size="xs"
          treatment="caption"
          weight="bold"
          className="tracking-[0.3em] text-foreground/50"
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
      <Button
        size="xs"
        onPress={onToggle}
        prefixIcon={<MaterialIcons name={icon} size={14} color="white" />}
      >
        {label}
      </Button>
    );
  }
  return (
    <Button
      variant="secondary"
      size="xs"
      onPress={onToggle}
      prefixIcon={
        <MaterialIcons
          name={icon}
          size={14}
          color={foregroundFor(scheme, 0.85)}
        />
      }
    >
      {label}
    </Button>
  );
}
