import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

const DATE_FORMAT = 'YYYY-MM-DD';

function todayLocal(): string {
  return dayjs().format(DATE_FORMAT);
}

export type SelectedDashboardDate = {
  /** YYYY-MM-DD in local time. */
  date: string;
  /** dayjs instance for formatting/comparison. */
  day: dayjs.Dayjs;
  isToday: boolean;
  /** Move one day back. Always allowed. */
  goBack: () => void;
  /** Move one day forward. No-op when already on today. */
  goForward: () => void;
  /** Whether the forward chevron should be enabled. */
  canGoForward: boolean;
};

/**
 * Local state for the dashboard's day navigator. Scoped to past + today —
 * the formula is "no future days, ever", so callers can safely query on
 * `date` without having to handle a not-yet-happened case.
 */
export function useSelectedDashboardDate(
  initialDate?: string,
): SelectedDashboardDate {
  const [date, setDate] = useState<string>(initialDate ?? todayLocal());
  const day = dayjs(date);
  const today = todayLocal();
  const isToday = date === today;

  const goBack = useCallback(() => {
    setDate((d) => dayjs(d).subtract(1, 'day').format(DATE_FORMAT));
  }, []);

  const goForward = useCallback(() => {
    setDate((d) => {
      const next = dayjs(d).add(1, 'day').format(DATE_FORMAT);
      return next > todayLocal() ? d : next;
    });
  }, []);

  return {
    date,
    day,
    isToday,
    goBack,
    goForward,
    canGoForward: !isToday,
  };
}
