import { queryQuantitySamples } from '@kingstinct/react-native-healthkit';

import type { BiometricSample } from './biometrics-storage';
import type { WindowReadResult } from './health-reader';

const MAX_SAMPLES_PER_QUERY = 5000;

export async function readHealthSamplesInWindow(
  startDate: Date,
  endDate: Date,
): Promise<WindowReadResult> {
  const filter = { date: { startDate, endDate } };
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

  const hrSamples: BiometricSample[] = hr.map((s) => ({
    metric: 'heart_rate',
    value: s.quantity,
    unit: 'bpm',
    source: 'apple_health',
    recordedAt: new Date(s.endDate),
  }));
  const hrvSamples: BiometricSample[] = hrv.map((s) => ({
    metric: 'hrv_sdnn',
    value: s.quantity,
    unit: 'ms',
    source: 'apple_health',
    recordedAt: new Date(s.endDate),
  }));
  const extraSamples: BiometricSample[] = [
    ...restingHr.map(
      (s): BiometricSample => ({
        metric: 'resting_hr',
        value: s.quantity,
        unit: 'bpm',
        source: 'apple_health',
        recordedAt: new Date(s.endDate),
      }),
    ),
    ...respRate.map(
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
