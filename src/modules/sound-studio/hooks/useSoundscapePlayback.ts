import { useStreamedAudioPlayer } from '@/lib/audio/useStreamedAudioPlayer';

import { SOUNDSCAPE_BY_SLUG } from '../data/curated-soundscapes';

export function useSoundscapePlayback(slug: string | null) {
  const soundscape = slug ? (SOUNDSCAPE_BY_SLUG[slug] ?? null) : null;
  const audio = useStreamedAudioPlayer(soundscape?.audioAssetKey ?? null);

  return {
    soundscape,
    isLoadingDetail: false,
    detailError: null as Error | null,
    audio,
  };
}
