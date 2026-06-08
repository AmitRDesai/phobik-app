import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { FamilyIntensityCard } from '../components/FamilyIntensityCard';
import { EMOTIONAL_FAMILIES } from '../data/emotionalFamilies';
import type { EmotionalFamilyId, FeelingIntensities } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const DEFAULT_INTENSITY = 5;

export default function FeelingSelection() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const selected = session?.emotionalFamilies ?? [];
  const showLoading = isLoading || !session;

  // Mirror intensities locally so slider drags don't hit the DB on every tick;
  // we persist on toggle + on continue. Seed from the session the first time it
  // loads (and whenever a different session loads) by adjusting state during
  // render — the React-recommended alternative to a sync effect.
  const [intensities, setIntensities] = useState<FeelingIntensities>({});
  const [seededSessionId, setSeededSessionId] = useState<string | null>(null);
  if (session && session.id !== seededSessionId) {
    setSeededSessionId(session.id);
    setIntensities(session.feelingIntensities ?? {});
  }

  const toggle = async (id: EmotionalFamilyId) => {
    if (!session) return;
    const isSelected = selected.includes(id);
    const nextFamilies = isSelected
      ? selected.filter((f) => f !== id)
      : [...selected, id];
    const nextIntensities = { ...intensities };
    if (isSelected) delete nextIntensities[id];
    else nextIntensities[id] = nextIntensities[id] ?? DEFAULT_INTENSITY;
    setIntensities(nextIntensities);
    await updateSession.mutateAsync({
      id: session.id,
      emotionalFamilies: nextFamilies,
      feelingIntensities: nextIntensities,
    });
  };

  const handleIntensityChange = (id: EmotionalFamilyId, value: number) => {
    setIntensities((prev) => ({ ...prev, [id]: value }));
  };

  const handleContinue = async () => {
    if (!session || selected.length === 0) return;
    await updateSession.mutateAsync({
      id: session.id,
      feelingIntensities: intensities,
      currentStep: 'body_map',
    });
    router.push('/daily-flow/body-map');
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
          disabled={selected.length === 0}
          loading={updateSession.isPending}
          fullWidth
        >
          Continue
        </Button>
      }
      contentClassName="gap-4 pb-4"
    >
      <View className="gap-2">
        <GradientText className="text-[32px] font-extrabold leading-[36px]">
          What feels strongest right now?
        </GradientText>
        <Text size="sm" tone="secondary">
          Choose the emotional families that resonate with your current state,
          then rate how strong each one feels. You can select multiple.
        </Text>
      </View>

      <View className="gap-3">
        {EMOTIONAL_FAMILIES.map((family) => (
          <FamilyIntensityCard
            key={family.id}
            family={family}
            selected={selected.includes(family.id)}
            intensity={intensities[family.id] ?? DEFAULT_INTENSITY}
            onToggle={() => toggle(family.id)}
            onIntensityChange={(value) =>
              handleIntensityChange(family.id, value)
            }
          />
        ))}
      </View>
    </Screen>
  );
}
