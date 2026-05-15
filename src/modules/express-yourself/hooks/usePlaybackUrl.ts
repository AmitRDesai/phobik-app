import { rpcClient } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

/**
 * Resolves a song row's S3 `audio_key` to a short-lived presigned URL the
 * audio player can stream from.
 */
export function usePlaybackUrl(id: string | undefined) {
  return useQuery({
    queryKey: ['song-playback-url', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing song id');
      return await rpcClient.song.getPlaybackUrl({ id });
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
