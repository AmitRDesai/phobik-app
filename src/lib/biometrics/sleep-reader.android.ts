import {
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  readRecords,
  SdkAvailabilityStatus,
  SleepStageType,
} from 'react-native-health-connect';

import type { SleepSessionInput } from './sleep-storage';

const MAX_RECORDS = 200;

function durationMinutes(start: string, end: string): number {
  return Math.max(
    0,
    (new Date(end).getTime() - new Date(start).getTime()) / 60_000,
  );
}

export async function readSleepSessionsInWindow(
  start: Date,
  end: Date,
): Promise<SleepSessionInput[]> {
  const status = await getSdkStatus();
  if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) return [];
  await initialize();

  const granted = await getGrantedPermissions();
  const hasSleep = granted.some(
    (p) => p.recordType === 'SleepSession' && p.accessType === 'read',
  );
  if (!hasSleep) return [];

  const result = await readRecords('SleepSession', {
    timeRangeFilter: {
      operator: 'between',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    },
    ascendingOrder: true,
    pageSize: MAX_RECORDS,
  }).catch(() => ({ records: [] as never[] }));

  const sessions: SleepSessionInput[] = [];
  for (const record of result.records) {
    const startTime = new Date(record.startTime);
    const endTime = new Date(record.endTime);
    const totalSpanMinutes = durationMinutes(record.startTime, record.endTime);

    let deep = 0;
    let rem = 0;
    let light = 0;
    let awake = 0;
    let asleepGeneric = 0;
    let hasStageBreakdown = false;

    for (const stage of record.stages ?? []) {
      const dur = durationMinutes(stage.startTime, stage.endTime);
      switch (stage.stage) {
        case SleepStageType.LIGHT:
          light += dur;
          hasStageBreakdown = true;
          break;
        case SleepStageType.DEEP:
          deep += dur;
          hasStageBreakdown = true;
          break;
        case SleepStageType.REM:
          rem += dur;
          hasStageBreakdown = true;
          break;
        case SleepStageType.AWAKE:
          awake += dur;
          break;
        case SleepStageType.SLEEPING:
          asleepGeneric += dur;
          break;
        default:
          break;
      }
    }

    const stagedTotal = deep + rem + light + asleepGeneric;
    // If the device reports stages, trust them. Otherwise treat the entire
    // session as undifferentiated asleep time.
    const totalMinutes = stagedTotal > 0 ? stagedTotal : totalSpanMinutes;
    const inBedMinutes =
      stagedTotal > 0 ? stagedTotal + awake : totalSpanMinutes;

    sessions.push({
      startTime,
      endTime,
      inBedMinutes,
      totalMinutes,
      deepMinutes: hasStageBreakdown ? deep : null,
      remMinutes: hasStageBreakdown ? rem : null,
      lightMinutes: hasStageBreakdown ? light : null,
      awakeMinutes: awake > 0 ? awake : null,
      source: 'health_connect',
    });
  }

  return sessions.filter((s) => s.totalMinutes > 0);
}
