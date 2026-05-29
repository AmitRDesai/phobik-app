import { useCompleteOnboarding } from '@/modules/onboarding/hooks/useCompleteOnboarding';
import { useSaveProfile } from '@/hooks/auth/useProfile';
import {
  onboardingAnswersValueAtom,
  resetOnboardingAtom,
} from '@/store/onboarding';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

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

  return useMutation({
    mutationFn: async () => {
      await saveProfile.mutateAsync(answers);
      await completeOnboarding.mutateAsync();
      reset();
    },
  });
}
