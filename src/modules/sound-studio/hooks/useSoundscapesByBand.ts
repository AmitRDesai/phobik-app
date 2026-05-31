import {
  soundscapesForBand,
  type SoundscapeTrack,
} from '../data/curated-soundscapes';
import type { SoundscapeBand } from '../data/sound-studio';

export function useSoundscapesByBand(band: SoundscapeBand | null) {
  const data: SoundscapeTrack[] = band ? soundscapesForBand(band) : [];
  return { data, isLoading: false, error: null as Error | null };
}
