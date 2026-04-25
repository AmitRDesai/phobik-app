import { useBiometricHistory } from '@/modules/insights/hooks/useBiometricHistory';
import { useLatestBiometrics } from './useLatestBiometrics';

export type StressLabel = 'Calm' | 'Balanced' | 'Stressed';

export type StressScore = {
  /** 0–100 — higher means more stressed (HR ↑ + HRV ↓ vs. 30d baseline). */
  score: number | null;
  label: StressLabel | null;
  /** Whether we have enough baseline + current data to compute a score. */
  hasBaseline: boolean;
};

function labelFor(score: number | null): StressLabel | null {
  if (score == null) return null;
  if (score < 35) return 'Calm';
  if (score < 65) return 'Balanced';
  return 'Stressed';
}

export function useStressScore(): StressScore {
  const { heartRate, hrv } = useLatestBiometrics();
  const hrBaseline = useBiometricHistory('heart_rate', 'Month');
  const hrvBaseline = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], 'Month');

  const baselineHr = hrBaseline.avg;
  const baselineHrv = hrvBaseline.avg;
  const hasBaseline =
    baselineHr != null &&
    baselineHrv != null &&
    hrBaseline.points.length >= 3 &&
    hrvBaseline.points.length >= 3;

  if (
    heartRate == null ||
    hrv == null ||
    !hasBaseline ||
    baselineHr == null ||
    baselineHrv == null
  ) {
    return { score: null, label: null, hasBaseline };
  }

  // Each metric contributes ±50 to the score around a center of 50.
  // Elevated HR vs baseline raises stress; depressed HRV raises stress.
  const hrDelta = (heartRate - baselineHr) / Math.max(baselineHr, 1);
  const hrvDelta = (baselineHrv - hrv) / Math.max(baselineHrv, 1);
  const raw = 50 + 50 * (hrDelta + hrvDelta);
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  return { score, label: labelFor(score), hasBaseline: true };
}
