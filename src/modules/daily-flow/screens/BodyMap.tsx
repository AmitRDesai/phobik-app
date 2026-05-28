import bodyMapSilhouette from '@/assets/images/daily-flow/body-map-silhouette.png';
import { Pressable } from '@/components/themed/Pressable';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

import { BODY_REGIONS } from '../data/bodyRegions';
import type { BodyRegionId } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

// Position each region as a chip overlay on the body silhouette container —
// approximate anatomy via flex layout.
const LAYOUT_ROWS: { regions: BodyRegionId[]; align?: 'left' | 'right' }[] = [
  { regions: ['head_mind'] },
  { regions: ['shoulders_neck'] },
  { regions: ['chest_breath'] },
  { regions: ['heart_space', 'back'], align: 'left' },
  { regions: ['stomach_gut'] },
  { regions: ['hands_arms'], align: 'left' },
  { regions: ['legs_feet'] },
  { regions: ['whole_body'] },
];

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
    await updateSession.mutateAsync({
      id: session.id,
      bodyRegions: next,
    });
  };

  const handleContinue = async () => {
    if (!session || selected.length === 0) return;
    await updateSession.mutateAsync({
      id: session.id,
      currentStep: 'body_sensations',
    });
    router.push('/daily-flow/body-sensations');
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
      <View className="items-center gap-2">
        <GradientText className="text-[28px] font-extrabold leading-[34px]">
          Where are you noticing this most?
        </GradientText>
        <Text size="sm" tone="secondary" align="center">
          Focus on your physical sensations and select the areas where you feel
          the most resonance right now.
        </Text>
      </View>

      <View className="relative items-center justify-center">
        <View
          pointerEvents="none"
          className="absolute h-[520px] w-[260px] opacity-70"
        >
          <Image
            source={bodyMapSilhouette}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            accessibilityLabel="Glowing body silhouette"
            className="h-full w-full"
          />
        </View>
        <View className="w-full gap-3 py-6">
          {LAYOUT_ROWS.map((row, i) => (
            <View
              key={i}
              className={clsx(
                'flex-row gap-2',
                row.align === 'left'
                  ? 'justify-between'
                  : row.align === 'right'
                    ? 'justify-end'
                    : 'justify-center',
              )}
            >
              {row.regions.map((id) => {
                const region = BODY_REGIONS.find((r) => r.id === id);
                if (!region) return null;
                const isSelected = selected.includes(id);
                return (
                  <Pressable
                    key={id}
                    onPress={() => toggle(id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={region.label}
                    className="active:opacity-80"
                  >
                    <View
                      className={clsx(
                        'rounded-full border px-4 py-2',
                        isSelected
                          ? 'border-primary-pink bg-primary-pink/80'
                          : 'border-foreground/10 bg-surface-elevated/90',
                      )}
                    >
                      <Text
                        size="sm"
                        weight={isSelected ? 'bold' : 'medium'}
                        tone={isSelected ? 'inverse' : 'primary'}
                      >
                        {region.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
