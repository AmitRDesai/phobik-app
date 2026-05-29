import { useStatus } from '@powersync/react';

/**
 * Holds the splash screen briefly after authentication until PowerSync has
 * completed its first sync, so a returning user's synced profile (and its
 * `onboarding_completed_at`) is known before the navigation guard runs —
 * otherwise the guard could flash the onboarding stack before the profile
 * arrives.
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

  // Wait only when authenticated, no local profile yet, and the first sync
  // hasn't landed. Once synced (or a profile exists locally) we trust the
  // profile status and let the guard route.
  const isPending = isAuthenticated && !hasProfile && !status.hasSynced;

  return { isPending };
}
