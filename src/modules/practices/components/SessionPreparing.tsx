import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { colors } from '@/constants/colors';
import { ActivityIndicator } from 'react-native';

/**
 * Centered "Preparing session…" loader shown while a guided session
 * pre-caches all of its audio clips (via `useAudioPrefetch`) before the timer
 * starts. Keeping every clip on disk up front is what prevents per-step audio
 * from being skipped mid-session.
 */
export function SessionPreparing({ progress }: { progress: number }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <ActivityIndicator size="large" color={colors.primary.pink} />
      <Text size="sm" tone="secondary" align="center">
        Preparing session…
      </Text>
      <Text
        size="xs"
        treatment="caption"
        tone="tertiary"
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}
