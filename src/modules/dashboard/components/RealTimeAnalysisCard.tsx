import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { Card } from '@/components/ui/Card';
import { useAnyHealthConnected } from '@/modules/home/hooks/useHealthConnections';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { useLatestSyncedVitals } from '@/modules/home/hooks/useLatestSyncedVitals';
import { useRhythmScore } from '@/modules/rhythm/hooks/useRhythmScore';
import { Ionicons } from '@expo/vector-icons';
import { accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

import { ScoreRing } from './ScoreRing';

interface RealTimeAnalysisCardProps {
  date: string;
}

function StatRow({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  tone: 'pink' | 'yellow';
}) {
  return (
    <View className="gap-0.5">
      <Text size="xs" treatment="caption" tone="secondary">
        {label}
      </Text>
      <View className="flex-row items-baseline gap-1">
        <Text size="h3" weight="black" allowFontScaling={false}>
          {value}
        </Text>
        <Text
          size="xs"
          treatment="caption"
          tone={tone === 'pink' ? 'accent' : 'secondary'}
        >
          {unit}
        </Text>
      </View>
    </View>
  );
}

export function RealTimeAnalysisCard({ date }: RealTimeAnalysisCardProps) {
  const router = useRouter();
  const scheme = useScheme();
  const { score, level } = useRhythmScore(date);
  // Live HealthKit/Health Connect stream takes priority; fall back to the latest
  // synced reading so cloud vendors (WHOOP daily HR/HRV) still surface here.
  const live = useLatestBiometrics();
  const synced = useLatestSyncedVitals();
  const anyConnected = useAnyHealthConnected();
  const heartRate = live.heartRate ?? synced.heartRate;
  const hrv = live.hrv ?? synced.hrv;

  return (
    <Card
      variant="raised"
      size="md"
      onPress={() => router.push('/rhythm')}
      accessibilityLabel="My Rhythm details"
      className="gap-4"
      shadow={{ color: accentFor(scheme, 'pink'), opacity: 0.12 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="size-2 rounded-full bg-primary-pink" />
          <Text size="xs" treatment="caption" weight="bold" tone="accent">
            Real-Time Analysis
          </Text>
        </View>
        {!anyConnected ? (
          <AccentPill
            label="Connect"
            variant="tinted"
            tone="pink"
            size="sm"
            onPress={() => router.push('/connect-wearable')}
            icon={(color) => (
              <Ionicons name="watch-outline" size={14} color={color} />
            )}
          />
        ) : null}
      </View>

      <View className="flex-row items-center justify-between">
        <ScoreRing
          value={score}
          gradient="pink-yellow"
          size={132}
          strokeWidth={11}
          caption={level.label.toUpperCase()}
          valueClassName="text-4xl"
        />
        <View className="gap-5 pr-2">
          <StatRow
            label="Heart Rate"
            value={heartRate != null ? heartRate.toFixed(0) : '—'}
            unit="BPM"
            tone="pink"
          />
          <StatRow
            label="HRV Balance"
            value={hrv != null ? hrv.toFixed(0) : '—'}
            unit="MS"
            tone="yellow"
          />
        </View>
      </View>
    </Card>
  );
}
