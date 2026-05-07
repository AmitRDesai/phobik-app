import { useMemo } from 'react';
import {
  pickDailyPlan,
  todayLocal,
  type PlanEntry,
} from '../lib/daily-plan-seed';

/**
 * Three deterministic practices for the given local date (defaults to today).
 * Same date always returns the same trio — no PowerSync, no backend.
 */
export function useDailyPlan(date?: string): PlanEntry[] {
  return useMemo(() => pickDailyPlan(date ?? todayLocal()), [date]);
}
