import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfileStatus(enabled: boolean) {
  return useQuery({
    ...orpc.profile.getProfileStatus.queryOptions(),
    enabled,
    retry: 2,
    staleTime: Infinity,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpc.profile.saveProfile.mutationOptions(),
    onSuccess: () => {
      queryClient.setQueryData(
        orpc.profile.getProfileStatus.key({ type: 'query' }),
        {
          hasProfile: true,
          onboardingCompleted: false,
        },
      );
    },
  });
}
