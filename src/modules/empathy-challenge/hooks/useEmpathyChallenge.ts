import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const activeChallengeOptions =
  orpc.empathyChallenge.getActiveChallenge.queryOptions();

export function useActiveChallenge() {
  return useQuery(activeChallengeOptions);
}

export function useStartChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.empathyChallenge.startChallenge.mutationOptions(),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: activeChallengeOptions.queryKey,
      });

      const previous = queryClient.getQueryData(
        activeChallengeOptions.queryKey,
      );

      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(activeChallengeOptions.queryKey, data);
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          activeChallengeOptions.queryKey,
          context.previous,
        );
      }
    },
  });
}

export function useStartDay() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.empathyChallenge.startDay.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activeChallengeOptions.queryKey,
      });
    },
  });
}

export function useCompleteDay() {
  const queryClient = useQueryClient();
  return useMutation({
    ...orpc.empathyChallenge.completeDay.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activeChallengeOptions.queryKey,
      });
    },
  });
}
