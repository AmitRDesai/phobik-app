import {
  CategoryValueSleepAnalysis,
  queryCategorySamples,
} from '@kingstinct/react-native-healthkit';

import type { SleepSessionInput } from './sleep-storage';

const MAX_SAMPLES = 5000;
// HealthKit fragments sleep into one sample per stage transition. Two
// adjacent samples within `SESSION_GAP_MS` are considered the same session
// (typical sleep is contiguous; ~3 hours is well above the largest awake
// interruption inside one night).
const SESSION_GAP_MS = 3 * 60 * 60 * 1000;

type RawSample = {
  startDate: Date;
  endDate: Date;
  value: CategoryValueSleepAnalysis;
};

function emptySession(start: Date) {
  return {
    startTime: start,
    endTime: start,
    inBedMinutes: 0,
    totalMinutes: 0,
    deepMinutes: null as number | null,
    remMinutes: null as number | null,
    lightMinutes: null as number | null,
    awakeMinutes: null as number | null,
  };
}

function durationMinutes(s: { startDate: Date; endDate: Date }): number {
  return Math.max(0, (s.endDate.getTime() - s.startDate.getTime()) / 60_000);
}

function collapseSamples(samples: readonly RawSample[]): SleepSessionInput[] {
  if (samples.length === 0) return [];
  // Ensure ascending by start.
  const sorted = [...samples].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );

  const groups: RawSample[][] = [];
  let current: RawSample[] = [sorted[0]!];
  let lastEnd = sorted[0]!.endDate.getTime();
  for (let i = 1; i < sorted.length; i++) {
    const s = sorted[i]!;
    if (s.startDate.getTime() - lastEnd > SESSION_GAP_MS) {
      groups.push(current);
      current = [];
    }
    current.push(s);
    lastEnd = Math.max(lastEnd, s.endDate.getTime());
  }
  groups.push(current);

  return groups
    .map((group) => {
      const session = emptySession(group[0]!.startDate);
      let firstStart = group[0]!.startDate.getTime();
      let lastSampleEnd = group[0]!.endDate.getTime();
      let hasStageBreakdown = false;
      let asleepUnspecifiedMinutes = 0;
      let deep = 0;
      let rem = 0;
      let light = 0;
      let awake = 0;
      let inBedExplicit = 0;

      for (const s of group) {
        firstStart = Math.min(firstStart, s.startDate.getTime());
        lastSampleEnd = Math.max(lastSampleEnd, s.endDate.getTime());
        const dur = durationMinutes(s);
        switch (s.value) {
          case CategoryValueSleepAnalysis.inBed:
            inBedExplicit += dur;
            break;
          case CategoryValueSleepAnalysis.awake:
            awake += dur;
            break;
          case CategoryValueSleepAnalysis.asleepCore:
            light += dur;
            hasStageBreakdown = true;
            break;
          case CategoryValueSleepAnalysis.asleepDeep:
            deep += dur;
            hasStageBreakdown = true;
            break;
          case CategoryValueSleepAnalysis.asleepREM:
            rem += dur;
            hasStageBreakdown = true;
            break;
          case CategoryValueSleepAnalysis.asleepUnspecified:
            // value === 1 covers both "asleep" and "asleepUnspecified" in
            // older HealthKit data — treat as undifferentiated asleep time.
            asleepUnspecifiedMinutes += dur;
            break;
          default:
            break;
        }
      }

      const totalMinutes = deep + rem + light + asleepUnspecifiedMinutes;
      // If we have explicit "in bed" samples use them; otherwise approximate
      // from start→end span minus awake (Apple Watch users typically have
      // implicit in-bed coverage from asleep + awake samples).
      const spanMinutes = (lastSampleEnd - firstStart) / 60_000;
      const inBedMinutes =
        inBedExplicit > 0 ? inBedExplicit : Math.max(spanMinutes, totalMinutes);

      session.startTime = new Date(firstStart);
      session.endTime = new Date(lastSampleEnd);
      session.inBedMinutes = inBedMinutes;
      session.totalMinutes = totalMinutes;
      session.deepMinutes = hasStageBreakdown ? deep : null;
      session.remMinutes = hasStageBreakdown ? rem : null;
      session.lightMinutes = hasStageBreakdown ? light : null;
      session.awakeMinutes = awake > 0 ? awake : null;

      return {
        ...session,
        source: 'apple_health' as const,
      };
    })
    .filter((s) => s.totalMinutes > 0);
}

export async function readSleepSessionsInWindow(
  startDate: Date,
  endDate: Date,
): Promise<SleepSessionInput[]> {
  const samples = await queryCategorySamples(
    'HKCategoryTypeIdentifierSleepAnalysis',
    {
      filter: { date: { startDate, endDate } },
      limit: MAX_SAMPLES,
      ascending: true,
    },
  ).catch(() => [] as readonly RawSample[]);

  return collapseSamples(samples as readonly RawSample[]);
}
