import { useUserId } from '@/lib/powersync/useUserId';
import { hasConnectedHealthAtom } from '@/modules/home/store/health-connection';
import {
  persistReadings,
  type BiometricSample,
} from '@/modules/home/utils/biometrics-storage';
import { readHealthSamplesInWindow } from '@/modules/home/utils/health-reader';
import { readSleepSessionsInWindow } from '@/modules/home/utils/sleep-reader';
import { persistSleepSessions } from '@/modules/home/utils/sleep-storage';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import {
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  openHealthConnectSettings,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

import type { LatestBiometrics } from './useLatestBiometrics';

const READ_PERMISSIONS = [
  { accessType: 'read' as const, recordType: 'HeartRate' as const },
  {
    accessType: 'read' as const,
    recordType: 'HeartRateVariabilityRmssd' as const,
  },
  { accessType: 'read' as const, recordType: 'RestingHeartRate' as const },
  { accessType: 'read' as const, recordType: 'RespiratoryRate' as const },
  { accessType: 'read' as const, recordType: 'SleepSession' as const },
];

const BACKFILL_DAYS = 30;
const RECENT_WINDOW_HOURS = 24;
const SLEEP_RECENT_WINDOW_DAYS = 7;
const POLL_INTERVAL_MS = 90_000;
type ReadResult = {
  heartRate: number | null;
  hrv: number | null;
  heartRateAt: Date | null;
  hrvAt: Date | null;
  hasReadAccess: boolean;
  sdkAvailable: boolean;
};

function pickLatest(samples: BiometricSample[]): BiometricSample | undefined {
  return samples.reduce<BiometricSample | undefined>((best, s) => {
    if (!best || s.recordedAt > best.recordedAt) return s;
    return best;
  }, undefined);
}

export function useLatestBiometrics(): LatestBiometrics {
  const [hasConnectedHealth, setHasConnectedHealth] = useAtom(
    hasConnectedHealthAtom,
  );
  const userId = useUserId();

  const query = useQuery<ReadResult>({
    queryKey: ['health-connect', 'latest-biometrics', userId],
    queryFn: async () => {
      const status = await getSdkStatus();
      if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
        return {
          heartRate: null,
          hrv: null,
          heartRateAt: null,
          hrvAt: null,
          hasReadAccess: false,
          sdkAvailable: false,
        };
      }
      const end = new Date();
      const start = new Date(
        end.getTime() - RECENT_WINDOW_HOURS * 60 * 60 * 1000,
      );
      const sleepStart = new Date(
        end.getTime() - SLEEP_RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000,
      );
      const [{ hrSamples, hrvSamples, extraSamples }, sleepSessions] =
        await Promise.all([
          readHealthSamplesInWindow(start, end),
          readSleepSessionsInWindow(sleepStart, end),
        ]);
      if (userId) {
        await Promise.all([
          persistReadings(userId, [
            ...hrSamples,
            ...hrvSamples,
            ...extraSamples,
          ]),
          persistSleepSessions(userId, sleepSessions),
        ]);
      }
      const latestHr = pickLatest(hrSamples);
      const latestHrv = pickLatest(hrvSamples);
      const hasReadAccess = hrSamples.length > 0 || hrvSamples.length > 0;
      return {
        heartRate: latestHr?.value != null ? Math.round(latestHr.value) : null,
        hrv: latestHrv?.value ?? null,
        heartRateAt: latestHr?.recordedAt ?? null,
        hrvAt: latestHrv?.recordedAt ?? null,
        // We can't distinguish "no permission" from "no data" purely from the
        // window read — so re-check granted permissions explicitly.
        hasReadAccess: await getGrantedPermissions()
          .then((p) =>
            p.some(
              (x) =>
                x.accessType === 'read' &&
                (x.recordType === 'HeartRate' ||
                  x.recordType === 'HeartRateVariabilityRmssd'),
            ),
          )
          .catch(() => hasReadAccess),
        sdkAvailable: true,
      };
    },
    staleTime: 60_000,
    enabled: hasConnectedHealth && !!userId,
    initialData: {
      heartRate: null,
      hrv: null,
      heartRateAt: null,
      hrvAt: null,
      hasReadAccess: false,
      sdkAvailable: true,
    },
  });

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') query.refetch();
    });
    return () => sub.remove();
  }, [query]);

  // Health Connect has no native subscription API — poll every 90s while
  // the app is foregrounded so the dashboard stays near-realtime.
  useEffect(() => {
    if (!hasConnectedHealth) return;
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') query.refetch();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [hasConnectedHealth, query]);

  // Revoke detection — see iOS hook header for context. On Android we can
  // detect this reliably because getGrantedPermissions returns the truth.
  useEffect(() => {
    if (
      hasConnectedHealth &&
      query.isFetched &&
      query.data?.sdkAvailable === true &&
      query.data?.hasReadAccess === false
    ) {
      setHasConnectedHealth(false);
    }
  }, [
    hasConnectedHealth,
    query.isFetched,
    query.data?.sdkAvailable,
    query.data?.hasReadAccess,
    setHasConnectedHealth,
  ]);

  const requestAccess = useCallback(async () => {
    try {
      const status = await getSdkStatus();
      if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) return false;

      await initialize();
      const granted = await requestPermission(READ_PERMISSIONS);
      const ok = granted.some(
        (p) =>
          p.accessType === 'read' &&
          (p.recordType === 'HeartRate' ||
            p.recordType === 'HeartRateVariabilityRmssd'),
      );
      if (ok) {
        setHasConnectedHealth(true);
        if (userId) {
          const end = new Date();
          const start = new Date(
            end.getTime() - BACKFILL_DAYS * 24 * 60 * 60 * 1000,
          );
          const [{ hrSamples, hrvSamples, extraSamples }, sleepSessions] =
            await Promise.all([
              readHealthSamplesInWindow(start, end),
              readSleepSessionsInWindow(start, end),
            ]);
          await Promise.all([
            persistReadings(userId, [
              ...hrSamples,
              ...hrvSamples,
              ...extraSamples,
            ]),
            persistSleepSessions(userId, sleepSessions),
          ]);
        }
        await query.refetch();
      }
      return ok;
    } catch {
      return false;
    }
  }, [setHasConnectedHealth, query, userId]);

  const disconnect = useCallback(async () => {
    setHasConnectedHealth(false);
    try {
      openHealthConnectSettings();
    } catch {
      // best effort
    }
  }, [setHasConnectedHealth]);

  return {
    heartRate: query.data?.heartRate ?? null,
    hrv: query.data?.hrv ?? null,
    heartRateAt: query.data?.heartRateAt ?? null,
    hrvAt: query.data?.hrvAt ?? null,
    hasAccess: hasConnectedHealth || query.data?.hasReadAccess === true,
    isLoading: query.isPending,
    sdkAvailable: query.data?.sdkAvailable ?? null,
    requestAccess,
    refresh: () => {
      query.refetch();
    },
    disconnect,
  };
}
