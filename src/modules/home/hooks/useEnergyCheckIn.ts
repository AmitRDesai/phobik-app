import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toCamel } from '@/lib/powersync/utils';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const DATE_FORMAT = 'YYYY-MM-DD';

/** Returns YYYY-MM-DD in local time (not UTC) */
function todayLocal(): string {
  return dayjs().format(DATE_FORMAT);
}

/** Returns YYYY-MM-DD offset by `days` from today (negative = past) */
function addDays(days: number): string {
  return dayjs().add(days, 'day').format(DATE_FORMAT);
}

/** Today's most recent energy check-in (null if none set today) */
export function useTodayEnergyCheckIn() {
  const userId = useUserId();
  const today = todayLocal();

  const { data, isLoading, error } = useQuery({
    queryKey: ['energy-check-in-today', userId, today],
    query: db
      .selectFrom('energy_check_in')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('selected_date', '=', today)
      .orderBy('created_at', 'desc')
      .limit(1),
    enabled: !!userId,
  });

  const energyCheckIn = useMemo(
    () => (data?.[0] ? toCamel(data[0]) : null),
    [data],
  );

  return { data: energyCheckIn, isLoading, error };
}

/** Save a new energy check-in for today */
export function useSaveEnergyCheckIn() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      purpose: number;
      mental: number;
      physical: number;
      relationship: number;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      const id = uuid();
      const now = new Date().toISOString();
      const today = todayLocal();
      const energyIndex =
        input.purpose + input.mental + input.physical + input.relationship;

      await db
        .insertInto('energy_check_in')
        .values({
          id,
          user_id: userId,
          purpose: input.purpose,
          mental: input.mental,
          physical: input.physical,
          relationship: input.relationship,
          energy_index: energyIndex,
          selected_date: today,
          created_at: now,
        })
        .execute();

      return { id };
    },
  });
}

/**
 * Energy check-in history for the last `days` days (inclusive of today).
 * Aggregates to one point per day, keeping the latest check-in for each day.
 */
export function useEnergyCheckInHistory(days: number) {
  const userId = useUserId();
  const today = todayLocal();
  const startDate = addDays(-(Math.max(1, days) - 1));

  const { data, isLoading, error } = useQuery({
    queryKey: ['energy-check-in-history', userId, startDate, today],
    query: db
      .selectFrom('energy_check_in')
      .selectAll()
      .where('user_id', '=', userId ?? '')
      .where('selected_date', '>=', startDate)
      .where('selected_date', '<=', today)
      .orderBy('selected_date', 'asc')
      .orderBy('created_at', 'asc'),
    enabled: !!userId,
  });

  const { series, average } = useMemo(() => {
    if (!data || data.length === 0) {
      return { series: [] as { date: string; value: number }[], average: null };
    }

    // Latest check-in per day wins (rows are ordered created_at asc, so overwrite).
    const byDate = new Map<string, number>();
    for (const row of data) {
      const r = toCamel(row) as {
        selectedDate: string;
        energyIndex: number | null;
      };
      if (r.energyIndex == null) continue;
      byDate.set(r.selectedDate, r.energyIndex);
    }

    const series = Array.from(byDate.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([date, value]) => ({ date, value }));

    const average =
      series.length === 0
        ? null
        : Math.round(
            series.reduce((sum, p) => sum + p.value, 0) / series.length,
          );

    return { series, average };
  }, [data]);

  return { series, average, isLoading, error };
}
