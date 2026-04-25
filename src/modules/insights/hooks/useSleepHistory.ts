import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import type { TimeRange } from '@/modules/insights/store/insights';
import { useQuery } from '@powersync/tanstack-react-query';

export type SleepSession = {
  id: string;
  startTime: Date;
  endTime: Date;
  inBedMinutes: number;
  totalMinutes: number;
  deepMinutes: number | null;
  remMinutes: number | null;
  lightMinutes: number | null;
  awakeMinutes: number | null;
  efficiencyPct: number | null;
  restorativePct: number | null;
  source: string;
};

export type SleepHistoryStats = {
  sessions: SleepSession[];
  lastNight: SleepSession | null;
  avgTotalMinutes: number | null;
  avgEfficiencyPct: number | null;
  avgRestorativePct: number | null;
  avgDeepPct: number | null; // deep / total * 100
  avgRemPct: number | null;
  /** 0-100, derived from duration + efficiency + restorative composition. */
  lastNightScore: number | null;
  hasData: boolean;
  isLoading: boolean;
};

const RANGE_DAYS: Record<TimeRange, number> = {
  Day: 1,
  Week: 7,
  '2 Weeks': 14,
  Month: 30,
};

function durationScore(totalMinutes: number): number {
  const hours = totalMinutes / 60;
  if (hours >= 7 && hours <= 9) return 30;
  if (hours >= 6 && hours < 7) return 20;
  if (hours > 9 && hours <= 10) return 20;
  if (hours >= 5 && hours < 6) return 10;
  if (hours > 10 && hours <= 11) return 10;
  return 0;
}

function efficiencyScore(efficiencyPct: number | null): number {
  if (efficiencyPct == null) return 15; // neutral when unknown
  if (efficiencyPct >= 85) return 30;
  if (efficiencyPct >= 75) return 20;
  if (efficiencyPct >= 60) return 10;
  return 0;
}

function restorativeScore(s: SleepSession): number {
  if (s.totalMinutes <= 0) return 0;
  const deepPct =
    s.deepMinutes != null ? (s.deepMinutes / s.totalMinutes) * 100 : null;
  const remPct =
    s.remMinutes != null ? (s.remMinutes / s.totalMinutes) * 100 : null;
  if (deepPct == null || remPct == null) return 20; // neutral when stages absent
  if (deepPct >= 13 && remPct >= 20) return 40;
  if (deepPct >= 10 && remPct >= 15) return 30;
  if (deepPct >= 8 || remPct >= 12) return 20;
  if (deepPct >= 5 || remPct >= 8) return 10;
  return 0;
}

export function computeSleepScore(s: SleepSession | null): number | null {
  if (!s || s.totalMinutes <= 0) return null;
  const score =
    durationScore(s.totalMinutes) +
    efficiencyScore(s.efficiencyPct) +
    restorativeScore(s);
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function useSleepHistory(range: TimeRange): SleepHistoryStats {
  const userId = useUserId();
  const startIso = new Date(
    Date.now() - RANGE_DAYS[range] * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, isLoading } = useQuery({
    queryKey: ['sleep-history', userId, range],
    query: db
      .selectFrom('sleep_session')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('start_time', '>=', startIso)
      .orderBy('start_time', 'desc'),
    enabled: !!userId,
  });

  const sessions: SleepSession[] = (data ?? []).map((r) => ({
    id: r.id,
    startTime: new Date(r.start_time as string),
    endTime: new Date(r.end_time as string),
    inBedMinutes: (r.in_bed_minutes as number) ?? 0,
    totalMinutes: (r.total_minutes as number) ?? 0,
    deepMinutes: (r.deep_minutes as number | null) ?? null,
    remMinutes: (r.rem_minutes as number | null) ?? null,
    lightMinutes: (r.light_minutes as number | null) ?? null,
    awakeMinutes: (r.awake_minutes as number | null) ?? null,
    efficiencyPct: (r.efficiency_pct as number | null) ?? null,
    restorativePct: (r.restorative_pct as number | null) ?? null,
    source: (r.source as string) ?? '',
  }));

  if (sessions.length === 0) {
    return {
      sessions: [],
      lastNight: null,
      avgTotalMinutes: null,
      avgEfficiencyPct: null,
      avgRestorativePct: null,
      avgDeepPct: null,
      avgRemPct: null,
      lastNightScore: null,
      hasData: false,
      isLoading,
    };
  }

  const lastNight = sessions[0]!;
  let sumTotal = 0;
  let countTotal = 0;
  let sumEff = 0;
  let countEff = 0;
  let sumRest = 0;
  let countRest = 0;
  let sumDeepPct = 0;
  let countDeepPct = 0;
  let sumRemPct = 0;
  let countRemPct = 0;
  for (const s of sessions) {
    if (s.totalMinutes > 0) {
      sumTotal += s.totalMinutes;
      countTotal += 1;
    }
    if (s.efficiencyPct != null) {
      sumEff += s.efficiencyPct;
      countEff += 1;
    }
    if (s.restorativePct != null) {
      sumRest += s.restorativePct;
      countRest += 1;
    }
    if (s.deepMinutes != null && s.totalMinutes > 0) {
      sumDeepPct += (s.deepMinutes / s.totalMinutes) * 100;
      countDeepPct += 1;
    }
    if (s.remMinutes != null && s.totalMinutes > 0) {
      sumRemPct += (s.remMinutes / s.totalMinutes) * 100;
      countRemPct += 1;
    }
  }

  return {
    sessions,
    lastNight,
    avgTotalMinutes: countTotal > 0 ? sumTotal / countTotal : null,
    avgEfficiencyPct: countEff > 0 ? sumEff / countEff : null,
    avgRestorativePct: countRest > 0 ? sumRest / countRest : null,
    avgDeepPct: countDeepPct > 0 ? sumDeepPct / countDeepPct : null,
    avgRemPct: countRemPct > 0 ? sumRemPct / countRemPct : null,
    lastNightScore: computeSleepScore(lastNight),
    hasData: true,
    isLoading,
  };
}

export function useLastNightRestingHr(
  startTime: Date | null,
  endTime: Date | null,
): number | null {
  const userId = useUserId();

  const { data } = useQuery({
    queryKey: [
      'sleep-resting-hr',
      userId,
      startTime?.toISOString() ?? null,
      endTime?.toISOString() ?? null,
    ],
    query: db
      .selectFrom('biometric_reading')
      .select(['value'])
      .where('user_id', '=', userId ?? '')
      .where('metric', 'in', ['heart_rate', 'resting_hr'])
      .where('recorded_at', '>=', startTime?.toISOString() ?? '1970-01-01')
      .where('recorded_at', '<=', endTime?.toISOString() ?? '1970-01-01'),
    enabled: !!userId && !!startTime && !!endTime,
  });

  if (!data || data.length === 0) return null;
  const sum = data.reduce<number>(
    (acc, r) => acc + ((r.value as number) ?? 0),
    0,
  );
  return Math.round(sum / data.length);
}
