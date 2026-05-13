import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { type AccentHue, accentFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import {
  useLastNightRestingHr,
  useSleepHistory,
} from '@/modules/insights/hooks/useSleepHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtomValue } from 'jotai';

function formatDuration(minutes: number | null): string {
  if (minutes == null || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes - h * 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function formatDeepPct(
  deepMinutes: number | null,
  totalMinutes: number,
): string {
  if (deepMinutes == null || totalMinutes <= 0) return '—';
  return `${Math.round((deepMinutes / totalMinutes) * 100)}%`;
}

function MetricTile({
  icon,
  value,
  label,
  tone,
}: {
  icon: 'schedule' | 'nights-stay' | 'favorite';
  value: string;
  label: string;
  tone: AccentHue;
}) {
  const scheme = useScheme();
  const accent = accentFor(scheme, tone);
  return (
    <Card variant="toned" tone={tone} size="md" className="flex-1 items-center">
      <View className="items-center gap-2">
        <MaterialIcons name={icon} size={22} color={accent} />
        <Text size="h2" weight="bold" allowFontScaling={false}>
          {value}
        </Text>
        <Text size="xs" treatment="caption" tone="secondary">
          {label}
        </Text>
      </View>
    </Card>
  );
}

export function SleepMetricsGrid() {
  const range = useAtomValue(timeRangeAtom);
  const { lastNight } = useSleepHistory(range);
  const restingHr = useLastNightRestingHr(
    lastNight?.startTime ?? null,
    lastNight?.endTime ?? null,
  );

  return (
    <View className="flex-row gap-3">
      <MetricTile
        icon="schedule"
        value={formatDuration(lastNight?.totalMinutes ?? null)}
        label="Asleep"
        tone="cyan"
      />
      <MetricTile
        icon="nights-stay"
        value={formatDeepPct(
          lastNight?.deepMinutes ?? null,
          lastNight?.totalMinutes ?? 0,
        )}
        label="Deep"
        tone="purple"
      />
      <MetricTile
        icon="favorite"
        value={restingHr != null ? String(restingHr) : '—'}
        label="BPM"
        tone="pink"
      />
    </View>
  );
}
