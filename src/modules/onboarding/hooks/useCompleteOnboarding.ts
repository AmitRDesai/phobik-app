import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const queryKey = orpc.profile.getProfileStatus.key({ type: 'query' });

  return useMutation({
    ...orpc.profile.completeOnboarding.mutationOptions(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (prev: any) => ({
        ...prev,
        onboardingCompleted: true,
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
