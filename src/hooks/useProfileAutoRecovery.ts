import { powersync } from '@/lib/powersync';
import { useUserId } from '@/lib/powersync/useUserId';
import { questionnaireAtom } from '@/store/onboarding';
import { useSaveProfile } from '@/hooks/auth/useProfile';
import { useStatus } from '@powersync/react';
import { useStore } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect, useRef, useState } from 'react';

/**
 * After signup, isAuthenticated flips before the profile can be saved.
 * This hook waits for sync, checks questionnaire data, and saves if needed.
 *
 * Returns `isPending` to keep the splash screen visible until resolved.
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
  const saveProfile = useSaveProfile();
  const store = useStore();
  const [settled, setSettled] = useState(false);
  const attempted = useRef(false);

  // Reset when auth state changes
  useEffect(() => {
    if (!isAuthenticated) {
      setSettled(false);
      attempted.current = false;
    }
  }, [isAuthenticated]);

  // Profile found — we're done
  useEffect(() => {
    if (isAuthenticated && hasProfile) {
      setSettled(true);
    }
  }, [isAuthenticated, hasProfile]);

  // Main logic: wait for sync, check questionnaire, save if needed
  useEffect(() => {
    if (!isAuthenticated || !userId || settled || attempted.current) return;
    if (!status.hasSynced) return;

    attempted.current = true;

    (async () => {
      // If profile already in SQLite (sync brought it), done
      const existing = await powersync.getOptional<{ id: string }>(
        'SELECT id FROM user_profile WHERE user_id = ?',
        [userId],
      );
      if (existing) {
        // Profile found via direct read — clear stale questionnaire data.
        // Don't setSettled here: wait for the watched query to update hasProfile
        // (the "Profile found" effect above handles it). This prevents the
        // profile-setup screen from flashing before hasProfile catches up.
        store.set(questionnaireAtom, RESET);
        return;
      }

      // Check questionnaire data from storage
      const q = await store.get(questionnaireAtom);
      if (!q.age || !q.termsAcceptedAt) {
        // No questionnaire data — user needs profile-setup screen
        setSettled(true);
        return;
      }

      // New user with questionnaire data — save profile
      saveProfile.mutate({
        ageRange: q.age,
        genderIdentity: q.gender,
        goals: q.goals,
        termsAcceptedAt: q.termsAcceptedAt,
        privacyAcceptedAt: q.privacyAcceptedAt,
      });
      // Don't setSettled here — wait for hasProfile to become true (above effect)
      store.set(questionnaireAtom, RESET);
    })();
  }, [isAuthenticated, userId, settled, status.hasSynced, saveProfile, store]);

  // Pending until settled (only matters when authenticated)
  return { isPending: isAuthenticated && !settled };
}
