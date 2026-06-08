import { Pressable } from '@/components/themed/Pressable';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientText } from '@/components/ui/GradientText';
import { ImageScrim } from '@/components/ui/ImageScrim';
import { Screen } from '@/components/ui/Screen';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

import { CHECK_IN_OPTIONS } from '../data/checkInStates';
import type { CheckInState } from '../data/types';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

export default function CheckIn() {
  const router = useRouter();
  const scheme = useScheme();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();

  // Selecting a state records it and advances immediately — no Continue CTA.
  const handleSelect = async (id: CheckInState) => {
    if (!session) return;
    await updateSession.mutateAsync({
      id: session.id,
      checkInState: id,
      currentStep: 'feeling',
    });
    router.push('/daily-flow/feeling');
  };

  return (
    <Screen
      loading={isLoading || !session}
      scroll
      transparent
      insetTop={false}
      contentClassName="gap-6 pb-4"
    >
      <View className="gap-2">
        <View className="flex-row flex-wrap items-baseline">
          <Text size="display" weight="extrabold">
            {'I am '}
          </Text>
          <GradientText className="text-[36px] font-extrabold leading-tight">
            feeling…
          </GradientText>
        </View>
        <Text size="sm" tone="secondary">
          Check in with your energy to find the right practice.
        </Text>
      </View>

      <View className="gap-3">
        {CHECK_IN_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => handleSelect(option.id)}
            accessibilityRole="button"
            accessibilityLabel={`${option.label}. ${option.helper}`}
            className="w-full overflow-hidden rounded-3xl active:opacity-80"
            style={{ aspectRatio: 16 / 10 }}
          >
            <Image
              source={option.image}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              className="absolute inset-0 h-full w-full"
            />
            <ImageScrim strength={0.8} start={0.3} />
            <View className="flex-1 justify-end gap-1 p-6">
              <Text size="h2" weight="bold" className="text-white">
                {option.label}
              </Text>
              <Text
                size="sm"
                treatment="caption"
                style={{ color: accentFor(scheme, option.tone) }}
              >
                {option.helper}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
