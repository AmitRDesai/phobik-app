import { orpc } from '@/lib/orpc';
import { useMutation } from '@tanstack/react-query';

export function useSaveOnboardingAnswers() {
  return useMutation({
    ...orpc.profile.saveOnboardingAnswers.mutationOptions(),
  });
}
