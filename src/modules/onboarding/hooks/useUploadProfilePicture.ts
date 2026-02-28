import { getSession } from '@/lib/auth';
import { orpc } from '@/lib/orpc';
import { useMutation } from '@tanstack/react-query';

export function useUploadProfilePicture() {
  return useMutation({
    ...orpc.profile.uploadProfilePicture.mutationOptions(),
    onSuccess: async () => {
      await getSession({ query: { disableCookieCache: true } });
    },
  });
}
