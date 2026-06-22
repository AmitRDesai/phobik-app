import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useDataSourcePreferences } from '@/modules/home/hooks/useDataSourcePreferences';
import { useQuery } from '@powersync/tanstack-react-query';

export type LatestSyncedVitals = {
  heartRate: number | null;
  heartRateAt: Date | null;
  hrv: number | null;
  hrvAt: Date | null;
};

/**
 * Latest HR + HRV from the synced `biometric_reading` table (PowerSync), so the
 * dashboard can surface cloud-vendor vitals (e.g. WHOOP's daily resting HR/HRV)
 * for users without a live HealthKit/Health Connect stream. Respects the
 * per-metric data-source preference, mirroring `useBiometricHistory` — when the
 * user has chosen an authoritative source we filter to it, otherwise we take the
 * most recent reading from any source.
 */
export function useLatestSyncedVitals(): LatestSyncedVitals {
  const userId = useUserId();
  const { prefs } = useDataSourcePreferences();
  const hrSource = prefs.heart_rate ?? null;
  const hrvSource = prefs.hrv ?? null;

  const { data: hrRows } = useQuery({
    queryKey: ['latest-vital', userId, 'heart_rate', hrSource ?? 'all'],
    query: db
      .selectFrom('biometric_reading')
      .select(['value', 'recorded_at'])
      .where('user_id', '=', userId ?? '')
      .where('metric', '=', 'heart_rate')
      .$if(hrSource != null, (qb) => qb.where('source', '=', hrSource!))
      .orderBy('recorded_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const { data: hrvRows } = useQuery({
    queryKey: ['latest-vital', userId, 'hrv', hrvSource ?? 'all'],
    query: db
      .selectFrom('biometric_reading')
      .select(['value', 'recorded_at'])
      .where('user_id', '=', userId ?? '')
      .where('metric', 'in', ['hrv_rmssd', 'hrv_sdnn'])
      .$if(hrvSource != null, (qb) => qb.where('source', '=', hrvSource!))
      .orderBy('recorded_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const hr = hrRows?.[0];
  const hrvRow = hrvRows?.[0];
  return {
    heartRate: hr?.value ?? null,
    heartRateAt: hr?.recorded_at ? new Date(hr.recorded_at) : null,
    hrv: hrvRow?.value ?? null,
    hrvAt: hrvRow?.recorded_at ? new Date(hrvRow.recorded_at) : null,
  };
}
