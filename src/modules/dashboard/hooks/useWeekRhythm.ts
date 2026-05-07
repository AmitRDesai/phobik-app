import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export type RhythmStatus = 'both' | 'one' | 'none' | 'future';

export type DayRhythm = {
  /** YYYY-MM-DD in local time */
  date: string;
  /** 0 = Sun, 6 = Sat */
  weekday: number;
  /** 1–31 */
  dayNum: number;
  /** S/M/T/W/T/F/S */
  weekdayLabel: string;
  isToday: boolean;
  isFuture: boolean;
  dailyFlowDone: boolean;
  morningResetDone: boolean;
  status: RhythmStatus;
};

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getCurrentWeekStart(): dayjs.Dayjs {
  const today = dayjs();
  return today.startOf('day').subtract(today.day(), 'day');
}

/**
 * Returns the current week (Sun→Sat) with completion status per day for
 * Daily Flow and Morning Quick Reset. Reads `daily_flow_session` and
 * `morning_reset_session` filtered by `status = 'completed'` and grouped
 * by the local date of `completed_at`.
 */
export function useWeekRhythm(): {
  days: DayRhythm[];
  weekStart: string;
  weekEnd: string;
  isLoading: boolean;
} {
  const userId = useUserId();
  const weekStart = getCurrentWeekStart();
  const weekStartIso = weekStart.toISOString();
  const weekEndIso = weekStart.add(7, 'day').toISOString();

  const flowQuery = useQuery({
    queryKey: ['week-rhythm-flow', userId, weekStartIso],
    query: db
      .selectFrom('daily_flow_session')
      .select(['completed_at'])
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed')
      .where('completed_at', '>=', weekStartIso)
      .where('completed_at', '<', weekEndIso),
    enabled: !!userId,
  });

  const resetQuery = useQuery({
    queryKey: ['week-rhythm-reset', userId, weekStartIso],
    query: db
      .selectFrom('morning_reset_session')
      .select(['completed_at'])
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed')
      .where('completed_at', '>=', weekStartIso)
      .where('completed_at', '<', weekEndIso),
    enabled: !!userId,
  });

  return useMemo(() => {
    const flowDates = new Set<string>();
    for (const row of flowQuery.data ?? []) {
      const ts = row.completed_at as string | null;
      if (ts) flowDates.add(dayjs(ts).format('YYYY-MM-DD'));
    }
    const resetDates = new Set<string>();
    for (const row of resetQuery.data ?? []) {
      const ts = row.completed_at as string | null;
      if (ts) resetDates.add(dayjs(ts).format('YYYY-MM-DD'));
    }

    const today = dayjs().format('YYYY-MM-DD');
    const days: DayRhythm[] = [];
    for (let i = 0; i < 7; i++) {
      const d = weekStart.add(i, 'day');
      const date = d.format('YYYY-MM-DD');
      const isToday = date === today;
      const isFuture = date > today;
      const dailyFlowDone = flowDates.has(date);
      const morningResetDone = resetDates.has(date);
      const status: RhythmStatus = isFuture
        ? 'future'
        : dailyFlowDone && morningResetDone
          ? 'both'
          : dailyFlowDone || morningResetDone
            ? 'one'
            : 'none';
      days.push({
        date,
        weekday: i,
        dayNum: d.date(),
        weekdayLabel: WEEKDAY_LABELS[i]!,
        isToday,
        isFuture,
        dailyFlowDone,
        morningResetDone,
        status,
      });
    }

    return {
      days,
      weekStart: weekStart.format('YYYY-MM-DD'),
      weekEnd: weekStart.add(6, 'day').format('YYYY-MM-DD'),
      isLoading: flowQuery.isLoading || resetQuery.isLoading,
    };
  }, [
    flowQuery.data,
    flowQuery.isLoading,
    resetQuery.data,
    resetQuery.isLoading,
    weekStart,
  ]);
}
