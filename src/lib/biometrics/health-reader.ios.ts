import { queryQuantitySamples } from '@kingstinct/react-native-healthkit';

import { isWhoopBundle, type BiometricSample } from './biometrics-storage';
import type { WindowReadResult } from './health-reader';

const MAX_SAMPLES_PER_QUERY = 5000;

export async function readHealthSamplesInWindow(
  startDate: Date,
  endDate: Date,
  dropWhoopMirror = false,
): Promise<WindowReadResult> {
  const filter = { date: { startDate, endDate } };
  // Drop samples WHOOP wrote into Apple Health when a direct WHOOP connection
  // is active — the cloud copy is canonical (see biometrics-storage).
  const keep = (s: {
    sourceRevision?: { source: { bundleIdentifier: string } };
  }) =>
    !dropWhoopMirror ||
    !isWhoopBundle(s.sourceRevision?.source.bundleIdentifier);
  const [hr, hrv, restingHr, respRate] = await Promise.all([
    queryQuantitySamples('HKQuantityTypeIdentifierHeartRate', {
      unit: 'count/min',
      filter,
      limit: MAX_SAMPLES_PER_QUERY,
      ascending: false,
    }).catch(() => []),
    queryQuantitySamples('HKQuantityTypeIdentifierHeartRateVariabilitySDNN', {
      filter,
      limit: MAX_SAMPLES_PER_QUERY,
      ascending: false,
    }).catch(() => []),
    queryQuantitySamples('HKQuantityTypeIdentifierRestingHeartRate', {
      unit: 'count/min',
      filter,
      limit: MAX_SAMPLES_PER_QUERY,
      ascending: false,
    }).catch(() => []),
    queryQuantitySamples('HKQuantityTypeIdentifierRespiratoryRate', {
      unit: 'count/min',
      filter,
      limit: MAX_SAMPLES_PER_QUERY,
      ascending: false,
    }).catch(() => []),
  ]);

  const hrSamples: BiometricSample[] = hr.filter(keep).map((s) => ({
    metric: 'heart_rate',
    value: s.quantity,
    unit: 'bpm',
    source: 'apple_health',
    recordedAt: new Date(s.endDate),
  }));
  const hrvSamples: BiometricSample[] = hrv.filter(keep).map((s) => ({
    metric: 'hrv_sdnn',
    value: s.quantity,
    unit: 'ms',
    source: 'apple_health',
    recordedAt: new Date(s.endDate),
  }));
  const extraSamples: BiometricSample[] = [
    ...restingHr.filter(keep).map(
      (s): BiometricSample => ({
        metric: 'resting_hr',
        value: s.quantity,
        unit: 'bpm',
        source: 'apple_health',
        recordedAt: new Date(s.endDate),
      }),
    ),
    ...respRate.filter(keep).map(
      (s): BiometricSample => ({
        metric: 'respiratory_rate',
        value: s.quantity,
        unit: 'breaths_per_min',
        source: 'apple_health',
        recordedAt: new Date(s.endDate),
      }),
    ),
  ];

  return { hrSamples, hrvSamples, extraSamples };
}
