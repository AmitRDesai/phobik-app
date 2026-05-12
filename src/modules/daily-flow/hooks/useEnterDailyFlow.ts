import { useRouter } from 'expo-router';
import { useCallback } from 'react';

/**
 * Enter the Daily Flow from Home. Defers all resume / fresh-start logic
 * to `ResumeDispatcher` at `/daily-flow` so there's a single source of
 * truth — the dispatcher reads the active session, builds the back-stack
 * atomically via `CommonActions.reset` on resume, or creates a fresh
 * session and replaces to `/daily-flow/intro` otherwise.
 */
export function useEnterDailyFlow() {
  const router = useRouter();
  return useCallback(() => {
    router.push('/daily-flow');
  }, [router]);
}
