import { useCompleteOnboarding } from '@/modules/onboarding/hooks/useCompleteOnboarding';
import { useSaveProfile } from '@/hooks/auth/useProfile';
import {
  onboardingAnswersValueAtom,
  resetOnboardingAtom,
} from '@/store/onboarding';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRef } from 'react';

/**
 * Persist the collected onboarding answers and mark onboarding complete. Used
 * by the final "You're all set" screen on both paths (email + social) — by the
 * time it runs the user is always authenticated. Writes everything to the local
 * `user_profile` row (PowerSync uploads it), sets `onboarding_completed_at`,
 * then clears the on-device draft.
 */
export function useFlushOnboarding() {
  const answers = useAtomValue(onboardingAnswersValueAtom);
  const saveProfile = useSaveProfile();
  const completeOnboarding = useCompleteOnboarding();
  const reset = useSetAtom(resetOnboardingAtom);

  // Guards against a destructive second run: `reset()` blanks the Jotai answers
  // at the end of the happy path, so a re-tap (before the CTA disables) would
  // otherwise re-enter with default answers and overwrite the saved profile.
  const flushedRef = useRef(false);

  return useMutation({
    mutationFn: async () => {
      if (flushedRef.current) return;
      flushedRef.current = true;

      // Snapshot the answers up front. `reset()` clears the atom below, but the
      // capture here means the persisted values are always the real ones even
      // if the closed-over `answers` changes underneath us mid-flight.
      const captured = answers;

      try {
        await saveProfile.mutateAsync(captured);
        await completeOnboarding.mutateAsync();
        reset();
      } catch (err) {
        // Allow a genuine retry after a failure — the writes above are
        // idempotent (existence-checked upsert + onboarding flag), and the
        // answers were not cleared because `reset()` never ran.
        flushedRef.current = false;
        throw err;
      }
    },
  });
}
