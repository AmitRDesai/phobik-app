import { useEffect, useState } from 'react';

/**
 * Returns a "now" timestamp (ms since epoch) that refreshes on a fixed
 * interval. Use instead of `Date.now()` in render code so freshness checks
 * against `useNow()` don't trigger React Compiler's "impure function during
 * render" rule and recompute on every render.
 *
 * Default interval is 30s — enough for "is this stat fresh" checks against
 * a several-minute window without burning frames.
 */
export function useNow(intervalMs: number = 30_000): number {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
