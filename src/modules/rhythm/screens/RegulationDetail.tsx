import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useBiometricHistory } from '@/modules/insights/hooks/useBiometricHistory';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { PillarDetailScaffold } from '../components/PillarDetailScaffold';
import { PillarMetricCard } from '../components/PillarMetricCard';
import { PILLARS, PILLAR_STATUS_LINES } from '../data/pillars';
import { trendDeltaLabel } from '../lib/scoring';
import { useRegulationScore } from '../hooks/useRegulationScore';

function stressLabel(stress: number | null): string {
  if (stress == null) return '—';
  if (stress < 34) return 'Low';
  if (stress < 67) return 'Moderate';
  return 'High';
}

export default function RegulationDetail() {
  const router = useRouter();
  const scheme = useScheme();
  const pillar = PILLARS.regulation;
  const { score, hrv, restingHr, selfReportStress, hasWearable } =
    useRegulationScore();
  const hrvHistory = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], 'Week');
  const values = hrvHistory.points.map((p) => p.value);

  return (
    <PillarDetailScaffold
      pillar={pillar}
      score={score}
      statusLine={PILLAR_STATUS_LINES.regulation(score)}
      trendValues={values}
      trendTitle="7-Day HRV Trend"
      trendDelta={trendDeltaLabel(values)}
      trendEmptyLabel="Connect a wearable to see your HRV trend"
    >
      <View className="gap-3">
        <PillarMetricCard
          icon="pulse"
          tone="pink"
          label="HRV"
          value={hrv != null ? hrv.toFixed(0) : '—'}
          unit="ms"
          status={hasWearable ? undefined : 'Connect'}
        />
        <PillarMetricCard
          icon="heart"
          tone="orange"
          label="Resting HR"
          value={restingHr != null ? restingHr.toFixed(0) : '—'}
          unit="bpm"
          status={restingHr != null ? 'Stable' : undefined}
        />
        <PillarMetricCard
          icon="happy"
          tone="purple"
          label="Stress Check"
          value={stressLabel(selfReportStress)}
          status="User reported"
        />
      </View>

      {!hasWearable ? (
        <Button
          variant="secondary"
          prefixIcon={
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={foregroundFor(scheme, 1)}
            />
          }
          onPress={() => router.push('/connect-wearable')}
          fullWidth
        >
          Connect a wearable for HRV
        </Button>
      ) : null}
    </PillarDetailScaffold>
  );
}
