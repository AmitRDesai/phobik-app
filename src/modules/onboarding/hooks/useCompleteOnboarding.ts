import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpc.profile.completeOnboarding.mutationOptions(),
    onSuccess: () => {
      queryClient.setQueryData(
        orpc.profile.getProfileStatus.key({ type: 'query' }),
        (prev: any) => ({
          ...prev,
          onboardingCompleted: true,
        }),
      );
    },
  });
}
