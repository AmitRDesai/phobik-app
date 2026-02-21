import { orpc } from '@/lib/orpc';
import { useMutation } from '@tanstack/react-query';

export function useUploadProfilePicture() {
  return useMutation({
    ...orpc.profile.uploadProfilePicture.mutationOptions(),
  });
}
