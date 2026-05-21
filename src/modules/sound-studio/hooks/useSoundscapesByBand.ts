import { useMemo } from 'react';

import {
  soundscapesForBand,
  type SoundscapeTrack,
} from '../data/curated-soundscapes';
import type { SoundscapeBand } from '../data/sound-studio';

export function useSoundscapesByBand(band: SoundscapeBand | null) {
  const data = useMemo<SoundscapeTrack[]>(
    () => (band ? soundscapesForBand(band) : []),
    [band],
  );
  return { data, isLoading: false, error: null as Error | null };
}
