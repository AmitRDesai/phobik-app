import { rpcClient } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

/**
 * Resolves a sound row's S3 `audio_key` to a short-lived presigned URL the
 * audio player can stream from (online-only; cached 5 min).
 */
export function usePlaybackUrl(id: string | undefined) {
  return useQuery({
    queryKey: ['sound-playback-url', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing sound id');
      return await rpcClient.song.getPlaybackUrl({ id });
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
