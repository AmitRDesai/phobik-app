import bodyMapSilhouette from '@/assets/images/daily-flow/body-map-silhouette.png';
import { Pressable } from '@/components/themed/Pressable';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { Image, type ViewStyle } from 'react-native';

import { BODY_REGIONS } from '../data/bodyRegions';
import type { BodyRegionId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

/**
 * Anatomical placement of each region chip as a percentage of the image
 * container (the chip's top-left corner). Tuned to the glowing silhouette;
 * adjust these once the final (larger, background-removed) figure lands —
 * everything else keys off this map. `whole_body` renders as a button below
 * the image, so it has no position here.
 */
type Percent = `${number}%`;

const REGION_POSITIONS: Record<
  Exclude<BodyRegionId, 'whole_body'>,
  { top: Percent; left: Percent }
> = {
  head_mind: { top: '7%', left: '32%' },
  shoulders_neck: { top: '19%', left: '28%' },
  chest_breath: { top: '31%', left: '33%' },
  heart_space: { top: '34%', left: '2%' },
  back: { top: '44%', left: '38%' },
  stomach_gut: { top: '51%', left: '33%' },
  hands_arms: { top: '56%', left: '1%' },
  legs_feet: { top: '76%', left: '34%' },
};

function RegionChip({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      className="active:opacity-80"
      style={style}
    >
      <View
        className={clsx(
          'rounded-full border px-4 py-2',
          selected
            ? 'border-primary-pink bg-primary-pink/70'
            : 'border-foreground/15 bg-surface-elevated/40',
        )}
      >
        <Text
          size="sm"
          weight={selected ? 'bold' : 'medium'}
          tone={selected ? 'inverse' : 'primary'}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export default function BodyMap() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  const selected = session?.bodyRegions ?? [];
  const showLoading = isLoading || !session;

  const toggle = async (id: BodyRegionId) => {
    if (!session) return;
    const next = selected.includes(id)
      ? selected.filter((r) => r !== id)
      : [...selected, id];
    await updateSession.mutateAsync({ id: session.id, bodyRegions: next });
  };

  const handleContinue = async () => {
    if (!session || selected.length === 0) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'body_sensations',
    });
    router.push('/daily-flow/body-sensations');
  };

  const labelFor = (id: BodyRegionId) =>
    BODY_REGIONS.find((r) => r.id === id)?.label;

  return (
    <Screen
      loading={showLoading}
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
    >
      <View className="flex-1 gap-4 pb-2">
        <View className="items-center gap-2">
          <GradientText className="text-[28px] font-extrabold leading-[34px]">
            Where are you noticing this most?
          </GradientText>
          <Text size="sm" tone="secondary" align="center">
            Focus on your physical sensations and select the areas where you
            feel the most resonance right now.
          </Text>
        </View>

        {/* Figure fills the available height; chips are positioned over it */}
        <View className="relative w-full flex-1">
          <Image
            source={bodyMapSilhouette}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            accessibilityLabel="Glowing body silhouette"
            className="absolute inset-0 h-full w-full opacity-80"
          />
          {(
            Object.keys(REGION_POSITIONS) as (keyof typeof REGION_POSITIONS)[]
          ).map((id) => {
            const label = labelFor(id);
            if (!label) return null;
            return (
              <RegionChip
                key={id}
                label={label}
                selected={selected.includes(id)}
                onPress={() => toggle(id)}
                style={{ position: 'absolute', ...REGION_POSITIONS[id] }}
              />
            );
          })}

          {/* Whole Body pinned to the bottom-center of the figure */}
          {labelFor('whole_body') ? (
            <View className="absolute inset-x-0 bottom-0 items-center">
              <RegionChip
                label={labelFor('whole_body')!}
                selected={selected.includes('whole_body')}
                onPress={() => toggle('whole_body')}
              />
            </View>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}
