import { useRouter } from 'expo-router';
import { useCallback } from 'react';

/**
 * Enter the Morning Reset from Home. Just pushes `/morning-reset`;
 * Landing (the index of the morning-reset stack) owns the session
 * lifecycle — creating a fresh row, abandoning stale ones, and
 * atomically rebuilding the back-stack on resume via
 * `CommonActions.reset`.
 */
export function useEnterMorningReset() {
  const router = useRouter();
  return useCallback(() => {
    router.push('/morning-reset');
  }, [router]);
}
