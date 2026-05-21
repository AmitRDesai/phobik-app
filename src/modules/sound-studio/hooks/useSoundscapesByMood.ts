import { useMemo } from 'react';

import {
  soundscapesForMood,
  type SoundscapeTrack,
} from '../data/curated-soundscapes';
import type { SoundscapeMood } from '../data/sound-studio';

export function useSoundscapesByMood(mood: SoundscapeMood | null) {
  const data = useMemo<SoundscapeTrack[]>(
    () => (mood ? soundscapesForMood(mood) : []),
    [mood],
  );
  return { data, isLoading: false, error: null as Error | null };
}
