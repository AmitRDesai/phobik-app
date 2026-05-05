import {
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  readRecords,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

import type { BiometricSample } from './biometrics-storage';
import type { WindowReadResult } from './health-reader';

const MAX_RECORDS = 1000;

export async function readHealthSamplesInWindow(
  start: Date,
  end: Date,
): Promise<WindowReadResult> {
  const status = await getSdkStatus();
  if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
    return { hrSamples: [], hrvSamples: [], extraSamples: [] };
  }
  await initialize();

  const granted = await getGrantedPermissions();
  const can = (recordType: string) =>
    granted.some((p) => p.recordType === recordType && p.accessType === 'read');
  const hasHr = can('HeartRate');
  const hasHrv = can('HeartRateVariabilityRmssd');
  const hasRestingHr = can('RestingHeartRate');
  const hasRespRate = can('RespiratoryRate');
  if (!hasHr && !hasHrv && !hasRestingHr && !hasRespRate) {
    return { hrSamples: [], hrvSamples: [], extraSamples: [] };
  }

  const timeRangeFilter = {
    operator: 'between' as const,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };

  const [hrResult, hrvResult, restingHrResult, respRateResult] =
    await Promise.all([
      hasHr
        ? readRecords('HeartRate', {
            timeRangeFilter,
            ascendingOrder: false,
            pageSize: MAX_RECORDS,
          })
        : Promise.resolve({ records: [] as never[] }),
      hasHrv
        ? readRecords('HeartRateVariabilityRmssd', {
            timeRangeFilter,
            ascendingOrder: false,
            pageSize: MAX_RECORDS,
          })
        : Promise.resolve({ records: [] as never[] }),
      hasRestingHr
        ? readRecords('RestingHeartRate', {
            timeRangeFilter,
            ascendingOrder: false,
            pageSize: MAX_RECORDS,
          })
        : Promise.resolve({ records: [] as never[] }),
      hasRespRate
        ? readRecords('RespiratoryRate', {
            timeRangeFilter,
            ascendingOrder: false,
            pageSize: MAX_RECORDS,
          })
        : Promise.resolve({ records: [] as never[] }),
    ]);

  const hrSamples: BiometricSample[] = [];
  for (const record of hrResult.records) {
    for (const sample of record.samples ?? []) {
      hrSamples.push({
        metric: 'heart_rate',
        value: sample.beatsPerMinute,
        unit: 'bpm',
        source: 'health_connect',
        recordedAt: new Date(sample.time),
      });
    }
  }

  const hrvSamples: BiometricSample[] = hrvResult.records.map((r) => ({
    metric: 'hrv_rmssd',
    value: r.heartRateVariabilityMillis,
    unit: 'ms',
    source: 'health_connect',
    recordedAt: new Date(r.time),
  }));

  const extraSamples: BiometricSample[] = [
    ...restingHrResult.records.map(
      (r): BiometricSample => ({
        metric: 'resting_hr',
        value: r.beatsPerMinute,
        unit: 'bpm',
        source: 'health_connect',
        recordedAt: new Date(r.time),
      }),
    ),
    ...respRateResult.records.map(
      (r): BiometricSample => ({
        metric: 'respiratory_rate',
        value: r.rate,
        unit: 'breaths_per_min',
        source: 'health_connect',
        recordedAt: new Date(r.time),
      }),
    ),
  ];

  return { hrSamples, hrvSamples, extraSamples };
}
