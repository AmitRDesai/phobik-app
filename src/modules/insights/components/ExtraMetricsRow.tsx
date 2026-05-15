import { View } from '@/components/themed/View';
import { BiometricStatCard } from '@/components/ui/BiometricStatCard';
import { useBiometricHistory } from '@/modules/insights/hooks/useBiometricHistory';
import { timeRangeAtom } from '@/modules/insights/store/insights';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtomValue } from 'jotai';

export function ExtraMetricsRow() {
  const range = useAtomValue(timeRangeAtom);
  const restingHr = useBiometricHistory('resting_hr', range);
  const respRate = useBiometricHistory('respiratory_rate', range);

  const restingValue =
    restingHr.avg != null
      ? Math.round(range === 'Day' ? restingHr.latest!.value : restingHr.avg)
      : null;
  const respValue =
    respRate.avg != null
      ? (range === 'Day' ? respRate.latest!.value : respRate.avg).toFixed(0)
      : null;

  return (
    <View className="flex-row gap-3">
      <BiometricStatCard
        className="flex-1"
        size="md"
        label={range === 'Day' ? 'Latest Resting HR' : 'Avg Resting HR'}
        value={restingValue != null ? String(restingValue) : '—'}
        unit="BPM"
        tone="cyan"
        isStale={restingValue == null}
        icon={(color) => (
          <MaterialIcons name="bedtime" size={14} color={color} />
        )}
      />
      <BiometricStatCard
        className="flex-1"
        size="md"
        label={range === 'Day' ? 'Latest Respiration' : 'Avg Respiration'}
        value={respValue ?? '—'}
        unit="BR/MIN"
        tone="purple"
        isStale={respValue == null}
        icon={(color) => <MaterialIcons name="air" size={14} color={color} />}
      />
    </View>
  );
}
