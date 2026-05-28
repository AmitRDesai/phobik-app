import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { EMOTIONAL_FAMILIES } from '../data/emotionalFamilies';
import type { EmotionalFamilyId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

// TODO: replace with real Daily Quote data when the feature ships.
const DAILY_QUOTE = '"Feelings are just visitors, let them come and go."';

export default function FeelingSelection() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const selected = session?.emotionalFamilies ?? [];
  const showLoading = isLoading || !session;

  const toggle = async (id: EmotionalFamilyId) => {
    if (!session) return;
    const next = selected.includes(id)
      ? selected.filter((f) => f !== id)
      : [...selected, id];
    await updateSession.mutateAsync({
      id: session.id,
      emotionalFamilies: next,
    });
  };

  const handleContinue = async () => {
    if (!session || selected.length === 0) return;
    await updateSession.mutateAsync({
      id: session.id,
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
          Choose the emotional families that resonate with your current state.
          You can select multiple.
        </Text>
      </View>

      <View className="gap-3">
        {EMOTIONAL_FAMILIES.map((family) => (
          <SelectionCard
            key={family.id}
            variant="checkbox"
            label={family.label}
            description={family.subFeelings.join(', ')}
            tone={family.tone}
            icon={(color) => (
              <Ionicons name={family.icon} size={20} color={color} />
            )}
            selected={selected.includes(family.id)}
            onPress={() => toggle(family.id)}
          />
        ))}
      </View>

      <Card
        variant="raised"
        size="md"
        className="mt-2 flex-row items-center gap-3"
      >
        <View className="flex-1 gap-1">
          <Text size="xs" treatment="caption" weight="bold" tone="secondary">
            Daily Quote
          </Text>
          <Text size="sm" weight="semibold" italic>
            {DAILY_QUOTE}
          </Text>
        </View>
      </Card>
    </Screen>
  );
}
