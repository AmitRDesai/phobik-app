import { useUserId } from '@/lib/powersync/useUserId';
import { hasConnectedHealthAtom } from '@/modules/home/store/health-connection';
import {
  persistReadings,
  type BiometricSample,
} from '@/modules/home/utils/biometrics-storage';
import { readHealthSamplesInWindow } from '@/modules/home/utils/health-reader';
import { readSleepSessionsInWindow } from '@/modules/home/utils/sleep-reader';
import { persistSleepSessions } from '@/modules/home/utils/sleep-storage';
import {
  enableBackgroundDelivery,
  isHealthDataAvailable,
  requestAuthorization,
  subscribeToChanges,
  UpdateFrequency,
} from '@kingstinct/react-native-healthkit';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { AppState, Linking } from 'react-native';

import type { LatestBiometrics } from './useLatestBiometrics';

const READ_TYPES = [
  'HKQuantityTypeIdentifierHeartRate',
  'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
  'HKQuantityTypeIdentifierRestingHeartRate',
  'HKQuantityTypeIdentifierRespiratoryRate',
  'HKCategoryTypeIdentifierSleepAnalysis',
] as const;

const BACKFILL_DAYS = 30;
const RECENT_WINDOW_HOURS = 24;
const SLEEP_RECENT_WINDOW_DAYS = 7;

function pickLatest(samples: BiometricSample[]): BiometricSample | undefined {
  // Samples come back in descending order from HealthKit, but be defensive.
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

  const query = useQuery({
    queryKey: ['healthkit', 'latest-biometrics', userId],
    queryFn: async () => {
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
      return {
        heartRate: latestHr?.value != null ? Math.round(latestHr.value) : null,
        hrv: latestHrv?.value ?? null,
        heartRateAt: latestHr?.recordedAt ?? null,
        hrvAt: latestHrv?.recordedAt ?? null,
      };
    },
    staleTime: 60_000,
    enabled: hasConnectedHealth && !!userId,
    initialData: {
      heartRate: null,
      hrv: null,
      heartRateAt: null,
      hrvAt: null,
    },
  });

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') query.refetch();
    });
    return () => sub.remove();
  }, [query]);

  // Reactive: HealthKit fires `subscribeToChanges` when the watch syncs new
  // samples, giving us "near-realtime" without needing periodic polling.
  useEffect(() => {
    if (!hasConnectedHealth) return;
    const subs = READ_TYPES.map((id) =>
      subscribeToChanges(id, () => {
        query.refetch();
      }),
    );
    return () => {
      for (const s of subs) s.remove();
    };
  }, [hasConnectedHealth, query]);

  // Enable HealthKit background delivery once we have a connection. This
  // tells iOS to wake the app (briefly) when a new HR/HRV sample arrives, so
  // subscribeToChanges fires even when we are not foregrounded. Idempotent —
  // safe to call on every render.
  useEffect(() => {
    if (!hasConnectedHealth) return;
    for (const id of READ_TYPES) {
      enableBackgroundDelivery(id, UpdateFrequency.immediate).catch(() => {});
    }
  }, [hasConnectedHealth]);

  const requestAccess = useCallback(async () => {
    try {
      const completed = await requestAuthorization({ toRead: READ_TYPES });
      if (completed) {
        setHasConnectedHealth(true);
        // Backfill 30 days so the Insights charts have history immediately.
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
      return completed;
    } catch {
      return false;
    }
  }, [setHasConnectedHealth, query, userId]);

  const disconnect = useCallback(async () => {
    setHasConnectedHealth(false);
    Linking.openURL('x-apple-health://').catch(() => {});
  }, [setHasConnectedHealth]);

  return {
    heartRate: query.data?.heartRate ?? null,
    hrv: query.data?.hrv ?? null,
    heartRateAt: query.data?.heartRateAt ?? null,
    hrvAt: query.data?.hrvAt ?? null,
    hasAccess: hasConnectedHealth,
    isLoading: query.isPending,
    sdkAvailable: isHealthDataAvailable(),
    requestAccess,
    refresh: () => {
      query.refetch();
    },
    disconnect,
  };
}
