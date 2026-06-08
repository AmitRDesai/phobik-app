import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { parseJSON } from '@/lib/powersync/utils';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { useBiometricHistory } from '@/modules/insights/hooks/useBiometricHistory';
import { useQuery } from '@powersync/tanstack-react-query';
import dayjs from 'dayjs';

import {
  biometricStress,
  hrvStressPoints,
  regulationScore,
  rhrStressPoints,
  selfReportStress,
  stressScore,
} from '../lib/scoring';

/** Emotional families that read as nervous-system activation (stress). */
const ACTIVATING = ['activated', 'heavy', 'mixed'];

export type RegulationScore = {
  /** Regulation 0–100 (higher = better regulated), or null if no inputs. */
  score: number | null;
  selfReportStress: number | null;
  biometricStress: number | null;
  /** Today's HRV (ms) and resting HR (bpm), or null. */
  hrv: number | null;
  restingHr: number | null;
  hasWearable: boolean;
  hasSelfReport: boolean;
  isLoading: boolean;
};

/** Self-report stress (10–100) from a day's per-family intensities. */
function selfReportFromIntensities(
  intensities: Record<string, number>,
): number | null {
  const entries = Object.entries(intensities);
  if (entries.length === 0) return null;
  const activating = entries.filter(([k]) => ACTIVATING.includes(k));
  const pool = activating.length > 0 ? activating : entries;
  const avg = pool.reduce((sum, [, v]) => sum + v, 0) / pool.length;
  return selfReportStress(avg);
}

function combineStress(self: number | null, bio: number | null): number | null {
  if (self != null && bio != null) return stressScore(self, bio);
  return self ?? bio ?? null;
}

export function useRegulationScore(
  date: string = dayjs().format('YYYY-MM-DD'),
): RegulationScore {
  const userId = useUserId();
  const { hrv } = useLatestBiometrics();
  // One 30-day query serves both today's reading (latest bucket) and the
  // rolling baseline (avg) — no need for a separate 'Day' query.
  const restingBaseline = useBiometricHistory('resting_hr', 'Month');
  const hrvBaseline = useBiometricHistory(['hrv_sdnn', 'hrv_rmssd'], 'Month');

  // Latest Daily-Flow self-report for the date.
  const { data, isLoading: flowLoading } = useQuery({
    queryKey: ['regulation-self-report', userId, date],
    query: db
      .selectFrom('daily_flow_session')
      .select(['feeling_intensities'])
      .where('user_id', '=', userId ?? '')
      .where('started_at', '>=', dayjs(date).startOf('day').toISOString())
      .where(
        'started_at',
        '<',
        dayjs(date).add(1, 'day').startOf('day').toISOString(),
      )
      .orderBy('started_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const intensities =
    parseJSON<Record<string, number>>(data?.[0]?.feeling_intensities) ?? {};
  const self = selfReportFromIntensities(intensities);

  const restingHr = restingBaseline.latest?.value ?? null;
  const baselineHrv = hrvBaseline.avg;
  const baselineRhr = restingBaseline.avg;

  const hasWearable =
    (hrv != null && baselineHrv != null) ||
    (restingHr != null && baselineRhr != null);

  let bio: number | null = null;
  if (hasWearable) {
    const hrvStress =
      hrv != null && baselineHrv != null
        ? hrvStressPoints(hrv, baselineHrv)
        : 0;
    const rhrStress =
      restingHr != null && baselineRhr != null
        ? rhrStressPoints(restingHr, baselineRhr)
        : 0;
    bio = biometricStress(hrvStress, rhrStress);
  }

  const combined = combineStress(self, bio);

  return {
    score: combined != null ? regulationScore(combined) : null,
    selfReportStress: self,
    biometricStress: bio,
    hrv,
    restingHr,
    hasWearable,
    hasSelfReport: self != null,
    isLoading:
      flowLoading || restingBaseline.isLoading || hrvBaseline.isLoading,
  };
}
