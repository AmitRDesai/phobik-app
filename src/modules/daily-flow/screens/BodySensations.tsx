import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChipSelect, type ChipOption } from '@/components/ui/ChipSelect';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SENSATION_CATEGORIES } from '../data/sensations';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

// TODO: replace with real Somatic Awareness card content when assets land.
const SOMATIC_TAG = 'Somatic Awareness';
const SOMATIC_TAGLINE = 'Your body is your guide';

const OPTIONS_BY_CATEGORY = SENSATION_CATEGORIES.map((cat) => ({
  category: cat,
  options: cat.chips.map<ChipOption<string>>((chip) => ({
    label: chip,
    value: `${cat.id}:${chip}`,
    tone: cat.tone,
  })),
}));

export default function BodySensations() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const selected = session?.sensations ?? [];
  const showLoading = isLoading || !session;

  const optionsByCategory = OPTIONS_BY_CATEGORY;

  const handleChange = async (next: string[]) => {
    if (!session) return;
    await updateSession.mutateAsync({
      id: session.id,
      sensations: next,
    });
  };

  const handleContinue = async () => {
    if (!session || selected.length === 0) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'body_insight',
    });
    router.push('/daily-flow/body-insight');
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
      contentClassName="gap-6 pb-4"
    >
      <View className="gap-2">
        <GradientText className="text-[28px] font-extrabold leading-[34px]">
          What does your body feel?
        </GradientText>
        <Text size="sm" tone="secondary">
          Tune into your physical state. Select as many as resonate with you
          right now.
        </Text>
      </View>

      <View className="gap-5">
        {optionsByCategory.map(({ category, options }) => (
          <View key={category.id} className="gap-3">
            <View className="flex-row items-center gap-2">
              <IconChip size="sm" shape="rounded" tone={category.tone}>
                {(color) => (
                  <Ionicons name={category.icon} size={14} color={color} />
                )}
              </IconChip>
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                tone="secondary"
              >
                {category.label}
              </Text>
            </View>
            <ChipSelect
              options={options}
              value={selected.filter((s) => options.some((o) => o.value === s))}
              onChange={(next) => {
                // Merge category-scoped change back into the global selection.
                const otherCategorySelections = selected.filter(
                  (s) => !options.some((o) => o.value === s),
                );
                handleChange([...otherCategorySelections, ...next]);
              }}
              multi
              variant="tinted"
              tone={category.tone}
              layout="wrap"
            />
          </View>
        ))}
      </View>

      <Card
        variant="raised"
        size="lg"
        className="mt-2 flex-row items-center gap-3"
      >
        <View className="flex-1 gap-1">
          <Text size="xs" treatment="caption" weight="bold" tone="accent">
            {SOMATIC_TAG}
          </Text>
          <Text size="md" weight="bold">
            {SOMATIC_TAGLINE}
          </Text>
        </View>
      </Card>
    </Screen>
  );
}
