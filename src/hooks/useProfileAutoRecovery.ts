import { powersync } from '@/lib/powersync';
import { useUserId } from '@/lib/powersync/useUserId';
import { useStatus } from '@powersync/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Holds the splash screen after authentication until we authoritatively know
 * whether the user has a profile — so the navigation guard never flashes the
 * onboarding stack on a cold start before the synced profile arrives.
 *
 * The subtlety: `status.hasSynced` flips true the instant the first sync writes
 * rows to local SQLite, but the watched `useProfileStatus` query updates one
 * React tick later. Releasing on `hasSynced` alone would let go while
 * `hasProfile` is still stale-false, momentarily routing a returning user to
 * onboarding.
 *
 * So once synced we read the profile row directly (authoritative — rows are
 * persisted before `hasSynced` is set):
 *  - row exists  → stay pending until the watched `hasProfile` catches up
 *                  (`!hasProfile` below), so the guard goes to home.
 *  - no row      → genuinely new / social user → release so onboarding shows.
 *
 * Onboarding answers are no longer flushed here: the unified flow persists
 * everything itself on the final completion screen (see `useFlushOnboarding`).
 */
export function useProfileAutoRecovery({
  isAuthenticated,
  hasProfile,
}: {
  isAuthenticated: boolean;
  hasProfile: boolean;
}) {
  const status = useStatus();
  const userId = useUserId();
  // The user id for which the post-sync direct read found NO profile row.
  // Keyed by user so a sign-out / account switch can't reuse a stale verdict.
  const [noProfileFor, setNoProfileFor] = useState<string | null>(null);
  const checkedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      checkedForUser.current = null;
      return;
    }
    if (checkedForUser.current === userId || !status.hasSynced) return;
    checkedForUser.current = userId;

    (async () => {
      const existing = await powersync.getOptional<{ id: string }>(
        'SELECT id FROM user_profile WHERE user_id = ?',
        [userId],
      );
      // No profile → release (onboarding). If one exists, stay pending and let
      // the watched `hasProfile` settle the gate once it catches up.
      if (!existing) setNoProfileFor(userId);
    })();
  }, [isAuthenticated, userId, status.hasSynced]);

  const noProfileConfirmed = !!userId && noProfileFor === userId;
  const isPending = isAuthenticated && !hasProfile && !noProfileConfirmed;

  return { isPending };
}
