import type { SleepSessionInput } from './sleep-storage';

/**
 * Fallback (web) — no Health APIs; sleep cannot be read.
 */
export async function readSleepSessionsInWindow(
  _start: Date,
  _end: Date,
): Promise<SleepSessionInput[]> {
  return [];
}
