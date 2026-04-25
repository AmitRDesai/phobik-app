import { colors } from '@/constants/colors';
import {
  useLastNightRestingHr,
  useSleepHistory,
} from '@/modules/insights/hooks/useSleepHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtomValue } from 'jotai';
import { Text, View } from 'react-native';

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
}: {
  icon: 'schedule' | 'nights-stay' | 'favorite';
  value: string;
  label: string;
}) {
  return (
    <View className="flex-1 items-center gap-2 rounded-xl border border-primary-pink/20 bg-primary-pink/5 p-4">
      <MaterialIcons name={icon} size={20} color={colors.primary.pink} />
      <Text className="text-base font-bold text-white">{value}</Text>
      <Text className="text-[10px] font-medium uppercase tracking-wider text-white/40">
        {label}
      </Text>
    </View>
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
    <View className="flex-row gap-3 px-4">
      <MetricTile
        icon="schedule"
        value={formatDuration(lastNight?.totalMinutes ?? null)}
        label="Asleep"
      />
      <MetricTile
        icon="nights-stay"
        value={formatDeepPct(
          lastNight?.deepMinutes ?? null,
          lastNight?.totalMinutes ?? 0,
        )}
        label="Deep"
      />
      <MetricTile
        icon="favorite"
        value={restingHr != null ? String(restingHr) : '—'}
        label="BPM"
      />
    </View>
  );
}
