import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

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
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.2}
        intensity={0.35}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <DailyFlowHeader wordmark />

      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <View className="flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-pink">
                Step 03
              </Text>
              <Text className="mt-2 text-3xl font-black leading-tight tracking-tight text-white">
                Choose your sound
              </Text>
            </View>
            <Text className="pb-1 text-xs text-white/55">75% Complete</Text>
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
          <Text className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
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
      </ScrollView>

      <View className="items-center px-6 pb-8">
        <GradientButton
          onPress={handleContinue}
          loading={updateSession.isPending}
        >
          Start My Shift
        </GradientButton>
        <Text className="mt-4 px-4 text-center text-xs italic text-white/50">
          Prepare for a sensory transition. Please use headphones.
        </Text>
      </View>
    </View>
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
      className="flex-row items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2"
    >
      <MaterialIcons name={icon} size={14} color="white" />
      <Text className="text-[10px] font-bold uppercase tracking-wider text-white/85">
        {label}
      </Text>
    </Pressable>
  );
}
